import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import {
  deleteLocalListingById,
  findLocalListingById,
  updateLocalListingById,
} from "@/lib/localStore";

const EDITABLE_FIELDS = [
  "name",
  "category",
  "address",
  "pincode",
  "city",
  "country",
  "services",
  "phone",
  "email",
  "website",
  "description",
  "image",
];

function isObjectIdString(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

function buildPatch(body) {
  const patch = {};
  for (const key of EDITABLE_FIELDS) {
    if (body && Object.prototype.hasOwnProperty.call(body, key)) {
      const value = body[key];
      const normalized =
        typeof value === "string" ? value.trim() : value ?? "";
      patch[key] =
        key === "email" && typeof normalized === "string"
          ? normalized.toLowerCase()
          : normalized;
    }
  }
  return patch;
}

function serializeListing(row) {
  return {
    ...row,
    _id: typeof row._id === "string" ? row._id : row._id.toString(),
    createdAt:
      row.createdAt instanceof Date
        ? row.createdAt.toISOString()
        : row.createdAt || null,
    updatedAt:
      row.updatedAt instanceof Date
        ? row.updatedAt.toISOString()
        : row.updatedAt || null,
  };
}

export async function GET(_request, context) {
  const { id } = await context.params;

  const local = await findLocalListingById(id);
  if (local) {
    return NextResponse.json({
      ok: true,
      source: "local",
      listing: serializeListing(local),
    });
  }

  if (!isObjectIdString(id)) {
    return NextResponse.json(
      { ok: false, message: "Listing not found" },
      { status: 404 }
    );
  }

  try {
    const db = await getDb();
    const row = await db
      .collection("listings")
      .findOne({ _id: new ObjectId(id) });
    if (!row) {
      return NextResponse.json(
        { ok: false, message: "Listing not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      source: "db",
      listing: serializeListing(row),
    });
  } catch (err) {
    console.error("[listings/:id GET] error:", err?.message || err);
    return NextResponse.json(
      { ok: false, message: "Could not fetch listing" },
      { status: 500 }
    );
  }
}

export async function PUT(request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const userEmail = session.user.email;
  const admin = isAdminEmail(userEmail);

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  const patch = buildPatch(body);

  const local = await findLocalListingById(id);
  if (local) {
    if (!admin && local.userId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    const updated = await updateLocalListingById(id, {
      ...patch,
      updatedAt: new Date().toISOString(),
    });
    return NextResponse.json({
      ok: true,
      source: "local",
      message: "Listing updated",
      listing: serializeListing(updated),
    });
  }

  if (!isObjectIdString(id)) {
    return NextResponse.json(
      { ok: false, message: "Listing not found" },
      { status: 404 }
    );
  }

  try {
    const db = await getDb();
    const _id = new ObjectId(id);
    const existing = await db.collection("listings").findOne({ _id });

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "Listing not found" },
        { status: 404 }
      );
    }

    if (!admin && existing.userId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("listings").updateOne(
      { _id },
      { $set: { ...patch, updatedAt: new Date() } }
    );

    const updated = await db.collection("listings").findOne({ _id });

    return NextResponse.json({
      ok: true,
      source: "db",
      message: "Listing updated",
      listing: serializeListing(updated),
    });
  } catch (err) {
    console.error("[listings/:id PUT] error:", err?.message || err);
    return NextResponse.json(
      { ok: false, message: "Could not update listing" },
      { status: 500 }
    );
  }
}

export async function DELETE(_request, context) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const userEmail = session.user.email;
  const admin = isAdminEmail(userEmail);

  const local = await findLocalListingById(id);
  if (local) {
    if (!admin && local.userId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    await deleteLocalListingById(id);
    return NextResponse.json({
      ok: true,
      source: "local",
      message: "Listing deleted",
    });
  }

  if (!isObjectIdString(id)) {
    return NextResponse.json(
      { ok: false, message: "Listing not found" },
      { status: 404 }
    );
  }

  try {
    const db = await getDb();
    const _id = new ObjectId(id);
    const existing = await db.collection("listings").findOne({ _id });

    if (!existing) {
      return NextResponse.json(
        { ok: false, message: "Listing not found" },
        { status: 404 }
      );
    }

    if (!admin && existing.userId !== userEmail) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.collection("listings").deleteOne({ _id });

    return NextResponse.json({
      ok: true,
      source: "db",
      message: "Listing deleted",
    });
  } catch (err) {
    console.error("[listings/:id DELETE] error:", err?.message || err);
    return NextResponse.json(
      { ok: false, message: "Could not delete listing" },
      { status: 500 }
    );
  }
}
