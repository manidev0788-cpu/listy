import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { devLog } from "@/lib/devLog";
import { createSlug } from "@/lib/slug";
import { ensureListingIndexes } from "@/lib/ensureListingIndexes";
import {
  sanitizeListingPayload,
  validateListingCreate,
  clampQueryTerm,
} from "@/lib/listingValidation";
import { buildListingsMongoFilter } from "@/lib/listingQuery";
import { dedupeListings } from "@/lib/getListingsForCategory";

const MAX_SKIP = 10_000;

function parseBoundedInt(raw, fallback, min, max) {
  const n = Number.parseInt(String(raw ?? ""), 10);
  if (!Number.isFinite(n)) return fallback;
  return Math.min(Math.max(n, min), max);
}

export const runtime = "nodejs";

function serializeListingDoc(doc) {
  if (!doc || typeof doc !== "object") return doc;
  return {
    ...doc,
    _id: doc._id?.toString?.() ?? doc._id,
    createdAt:
      doc.createdAt instanceof Date
        ? doc.createdAt.toISOString()
        : doc.createdAt ?? null,
    updatedAt:
      doc.updatedAt instanceof Date
        ? doc.updatedAt.toISOString()
        : doc.updatedAt ?? null,
    aiGeneratedAt:
      doc.aiGeneratedAt instanceof Date
        ? doc.aiGeneratedAt.toISOString()
        : doc.aiGeneratedAt ?? null,
  };
}

async function generateUniqueSlug(db, name, city) {
  const base = createSlug(name, city) || "listing";
  const maxAttempts = 32;
  for (let i = 0; i < maxAttempts; i += 1) {
    const candidate =
      i === 0 ? base : `${base}-${Math.random().toString(36).slice(2, 9)}`;
    const exists = await db
      .collection("listings")
      .findOne({ slug: candidate }, { projection: { _id: 1 } });
    if (!exists) return candidate;
  }
  throw new Error("Could not generate a unique slug");
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { ok: false, message: "Unauthorized — please sign in to add a listing." },
      { status: 401 }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const base = sanitizeListingPayload(body);
  const validated = validateListingCreate(base);
  if (!validated.ok) {
    return NextResponse.json(
      { ok: false, message: validated.message },
      { status: 400 }
    );
  }

  const userId = session.user.email.toLowerCase();

  try {
    const db = await getDb();
    await ensureListingIndexes(db);

    let slug = await generateUniqueSlug(db, base.name, base.city);
    let lastDup = null;

    for (let ins = 0; ins < 5; ins += 1) {
      const listing = {
        ...base,
        slug,
        userId,
        createdAt: new Date(),
      };

      try {
        const result = await db.collection("listings").insertOne(listing);

        devLog("[listings] new submission (db):", listing.name, slug);

        const data = {
          ...base,
          slug,
          userId,
          _id: result.insertedId.toString(),
          createdAt: listing.createdAt.toISOString(),
        };

        return NextResponse.json(
          {
            ok: true,
            source: "db",
            message: "Listing saved successfully",
            id: result.insertedId.toString(),
            slug,
            data,
          },
          { status: 200 }
        );
      } catch (e) {
        if (e?.code === 11000) {
          lastDup = e;
          slug = await generateUniqueSlug(db, base.name, base.city);
          continue;
        }
        throw e;
      }
    }

    throw lastDup || new Error("Could not allocate unique slug");
  } catch (error) {
    console.error("[listings] DB write failed:", error?.message || error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "We could not save your listing — the database is temporarily unavailable. Please try again in a moment.",
      },
      { status: 503 }
    );
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = clampQueryTerm(searchParams.get("search") || "");
  const location = clampQueryTerm(searchParams.get("location") || "");
  const city = clampQueryTerm(searchParams.get("city") || "");
  const category = clampQueryTerm(searchParams.get("category") || "");

  const limit = parseBoundedInt(searchParams.get("limit"), 100, 1, 100);
  const skip = parseBoundedInt(searchParams.get("skip"), 0, 0, MAX_SKIP);

  try {
    const db = await getDb();
    await ensureListingIndexes(db);

    const query = buildListingsMongoFilter({ search, location, city, category });

    const col = db.collection("listings");
    const [rows, total] = await Promise.all([
      col
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      col.countDocuments(query),
    ]);

    const needsBackfill = rows.filter(
      (l) => !l.slug || typeof l.slug !== "string"
    );

    if (needsBackfill.length > 0) {
      const usedSlugs = new Set(
        rows
          .map((l) => l.slug)
          .filter((s) => typeof s === "string" && s.length > 0)
      );

      const ops = [];
      for (const l of needsBackfill) {
        let candidate = createSlug(l.name, l.city) || "listing";
        let final = candidate;
        let i = 0;
        while (usedSlugs.has(final)) {
          i += 1;
          final = `${candidate}-${i}`;
        }
        usedSlugs.add(final);
        l.slug = final;
        ops.push({
          updateOne: {
            filter: { _id: l._id },
            update: { $set: { slug: final } },
          },
        });
      }

      if (ops.length > 0) {
        try {
          await db.collection("listings").bulkWrite(ops);
        } catch (err) {
          console.error("[listings] slug backfill error:", err);
        }
      }
    }

    const listings = dedupeListings(rows).map(serializeListingDoc);
    const hasMore = skip + listings.length < total;

    return NextResponse.json({
      ok: true,
      source: "db",
      count: listings.length,
      total,
      hasMore,
      pagination: {
        skip,
        limit,
        total,
        dbReturned: rows.length,
      },
      listings,
    });
  } catch (error) {
    console.error("[listings] DB read failed:", error?.message || error);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Could not load listings — the database is temporarily unavailable.",
        count: 0,
        total: 0,
        hasMore: false,
        pagination: { skip, limit, total: 0 },
        listings: [],
      },
      { status: 503 }
    );
  }
}
