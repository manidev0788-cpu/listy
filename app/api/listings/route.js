import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { createSlug } from "@/lib/slug";
import { filterSampleListings } from "@/lib/sampleListings";
import {
  appendLocalListing,
  filterLocalListings,
  localSlugExists,
  readLocalListings,
} from "@/lib/localStore";

async function generateUniqueSlug(db, name, city) {
  const base = createSlug(name, city) || "listing";
  let candidate = base;
  let attempt = 0;

  while (
    await db.collection("listings").findOne({ slug: candidate }, { projection: { _id: 1 } })
  ) {
    attempt += 1;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
    if (attempt > 5) break;
  }

  return candidate;
}

async function generateUniqueLocalSlug(name, city) {
  const base = createSlug(name, city) || "listing";
  let candidate = base;
  let attempt = 0;

  while (await localSlugExists(candidate)) {
    attempt += 1;
    const suffix = Math.random().toString(36).slice(2, 6);
    candidate = `${base}-${suffix}`;
    if (attempt > 5) break;
  }

  return candidate;
}

function buildListingPayload(body) {
  const {
    name,
    category,
    address,
    pincode,
    city,
    country,
    services,
    phone,
    email,
    website,
    description,
    image,
  } = body || {};

  return {
    name: (name || "").toString().trim(),
    category: (category || "").toString().trim(),
    address: (address || "").toString().trim(),
    pincode: (pincode || "").toString().trim(),
    city: (city || "").toString().trim(),
    country: (country || "").toString().trim(),
    services: (services || "").toString().trim(),
    phone: (phone || "").toString().trim(),
    email: (email || "").toString().trim().toLowerCase(),
    website: (website || "").toString().trim(),
    description: (description || "").toString().trim(),
    image: image || "",
  };
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

  const base = buildListingPayload(body);

  if (!base.name) {
    return NextResponse.json(
      { ok: false, message: "Business name is required" },
      { status: 400 }
    );
  }

  const userId = session.user.email;

  try {
    const db = await getDb();
    const slug = await generateUniqueSlug(db, base.name, base.city);

    const listing = {
      ...base,
      slug,
      userId,
      createdAt: new Date(),
    };

    console.log("[listings] new submission (db):", listing.name, slug);

    const result = await db.collection("listings").insertOne(listing);

    return NextResponse.json(
      {
        ok: true,
        source: "db",
        message: "Listing saved successfully",
        id: result.insertedId,
        slug,
        data: listing,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "[listings] DB write failed, saving to local store:",
      error?.message || error
    );

    try {
      const slug = await generateUniqueLocalSlug(base.name, base.city);
      const createdAt = new Date().toISOString();
      const localId = `local-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;

      const listing = {
        _id: localId,
        ...base,
        slug,
        userId,
        createdAt,
        isLocal: true,
      };

      await appendLocalListing(listing);

      console.log("[listings] new submission (local):", listing.name, slug);

      return NextResponse.json(
        {
          ok: true,
          source: "local",
          offline: true,
          message:
            "Saved locally — MongoDB is offline. Your listing will appear on the site immediately.",
          id: localId,
          slug,
          data: listing,
        },
        { status: 200 }
      );
    } catch (localErr) {
      console.error("[listings] local save failed:", localErr);
      return NextResponse.json(
        {
          ok: false,
          message:
            (localErr && localErr.message) ||
            (error && error.message) ||
            "Failed to save listing",
        },
        { status: 500 }
      );
    }
  }
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const search = (searchParams.get("search") || "").trim();
  const location = (searchParams.get("location") || "").trim();
  const city = (searchParams.get("city") || "").trim();
  const category = (searchParams.get("category") || "").trim();

  const localMatches = await filterLocalListings({
    search,
    location,
    city,
    category,
  });

  try {
    const andClauses = [];

    if (search) {
      const rx = escapeRegex(search);
      andClauses.push({
        $or: [
          { name: { $regex: rx, $options: "i" } },
          { category: { $regex: rx, $options: "i" } },
          { services: { $regex: rx, $options: "i" } },
          { description: { $regex: rx, $options: "i" } },
        ],
      });
    }

    if (location) {
      const rx = escapeRegex(location);
      andClauses.push({
        $or: [
          { city: { $regex: rx, $options: "i" } },
          { country: { $regex: rx, $options: "i" } },
          { address: { $regex: rx, $options: "i" } },
          { pincode: { $regex: rx, $options: "i" } },
        ],
      });
    }

    if (city) {
      andClauses.push({
        city: { $regex: escapeRegex(city), $options: "i" },
      });
    }

    if (category) {
      andClauses.push({
        category: { $regex: escapeRegex(category), $options: "i" },
      });
    }

    const query = andClauses.length > 0 ? { $and: andClauses } : {};

    const db = await getDb();
    const listings = await db
      .collection("listings")
      .find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const needsBackfill = listings.filter(
      (l) => !l.slug || typeof l.slug !== "string"
    );

    if (needsBackfill.length > 0) {
      const usedSlugs = new Set(
        listings
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

    const merged = [...localMatches, ...listings];

    return NextResponse.json({
      ok: true,
      source: "db",
      count: merged.length,
      listings: merged,
    });
  } catch (error) {
    console.error(
      "[listings] DB unavailable, serving local + sample listings:",
      error?.message || error
    );

    const sample = filterSampleListings({ search, location, city, category });
    const merged = [...localMatches, ...sample];

    return NextResponse.json({
      ok: true,
      source: localMatches.length > 0 ? "local" : "sample",
      offline: true,
      hasLocal: localMatches.length > 0,
      message:
        localMatches.length > 0
          ? "Live database unavailable — showing your locally saved listings plus demo data."
          : "Live database unavailable — showing demo listings instead.",
      count: merged.length,
      listings: merged,
    });
  }
}
