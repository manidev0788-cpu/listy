import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth";
import { authOptions, isAdminEmail } from "@/lib/auth";
import { getDb } from "@/lib/mongodb";
import { buildListingPatch } from "@/lib/listingValidation";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ownersMatch(recordUserId, sessionEmail) {
  return (
    String(recordUserId || "").toLowerCase() ===
    String(sessionEmail || "").toLowerCase()
  );
}

function isObjectIdString(id) {
  return typeof id === "string" && /^[a-f0-9]{24}$/i.test(id);
}

function validatePatch(patch) {
  if (Object.keys(patch).length === 0) {
    return { ok: false, message: "No changes provided." };
  }

  if (Object.prototype.hasOwnProperty.call(patch, "name") && !patch.name) {
    return { ok: false, message: "Business name cannot be empty." };
  }
  if (
    Object.prototype.hasOwnProperty.call(patch, "category") &&
    !patch.category
  ) {
    return { ok: false, message: "Category cannot be empty." };
  }
  if (
    Object.prototype.hasOwnProperty.call(patch, "address") &&
    !patch.address
  ) {
    return { ok: false, message: "Address cannot be empty." };
  }
  if (
    Object.prototype.hasOwnProperty.call(patch, "email") &&
    patch.email &&
    !EMAIL_RE.test(patch.email)
  ) {
    return { ok: false, message: "Please enter a valid email address." };
  }

  return { ok: true };
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
      { ok: false, message: "Unauthorized" },
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

  const patch = buildListingPatch(body);
  const patchCheck = validatePatch(patch);
  if (!patchCheck.ok) {
    return NextResponse.json(
      { ok: false, message: patchCheck.message },
      { status: 400 }
    );
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

    if (!admin && !ownersMatch(existing.userId, userEmail)) {
      return NextResponse.json(
        { ok: false, message: "Forbidden" },
        { status: 403 }
      );
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
      { ok: false, message: "Unauthorized" },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const userEmail = session.user.email;
  const admin = isAdminEmail(userEmail);

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

    if (!admin && !ownersMatch(existing.userId, userEmail)) {
      return NextResponse.json(
        { ok: false, message: "Forbidden" },
        { status: 403 }
      );
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
