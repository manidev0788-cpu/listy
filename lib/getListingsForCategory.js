import { getDb } from "@/lib/mongodb";
import { escapeRegex } from "@/lib/listingValidation";
import { ensureListingIndexes } from "@/lib/ensureListingIndexes";

const MAX = 160;

function serializeListing(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const o = { ...doc };
  if (o._id && typeof o._id.toString === "function") {
    o._id = o._id.toString();
  }
  if (o.createdAt instanceof Date) {
    o.createdAt = o.createdAt.toISOString();
  }
  if (o.updatedAt instanceof Date) {
    o.updatedAt = o.updatedAt.toISOString();
  }
  return o;
}

/**
 * Returns listings for a category label (exact name from CATEGORIES / DB).
 */
export async function getListingsForCategory(categoryName) {
  const category = String(categoryName || "")
    .trim()
    .slice(0, MAX);
  if (!category) {
    return { listings: [], offline: false };
  }

  try {
    const db = await getDb();
    await ensureListingIndexes(db);
    const rows = await db
      .collection("listings")
      .find({
        category: { $regex: escapeRegex(category), $options: "i" },
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const listings = dedupeListings(rows).map(serializeListing);
    return { listings, offline: false };
  } catch (err) {
    console.error("[getListingsForCategory]", err?.message || err);
    return { listings: [], offline: true };
  }
}

export function dedupeListings(list) {
  const seen = new Set();
  const out = [];
  for (const l of list) {
    const key =
      (l.slug && String(l.slug)) ||
      (l._id && typeof l._id.toString === "function" && l._id.toString()) ||
      `${l.name || ""}|${l.city || ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(l);
  }
  return out;
}
