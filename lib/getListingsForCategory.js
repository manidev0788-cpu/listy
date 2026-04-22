import { getDb } from "@/lib/mongodb";
import { filterSampleListings } from "@/lib/sampleListings";
import { filterLocalListings } from "@/lib/localStore";

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function serializeListing(doc) {
  if (!doc || typeof doc !== "object") return doc;
  const o = { ...doc };
  if (o._id && typeof o._id.toString === "function") {
    o._id = o._id.toString();
  }
  return o;
}

/**
 * Returns listings for a category label (exact name from CATEGORIES / DB).
 */
export async function getListingsForCategory(categoryName) {
  const category = (categoryName || "").trim();
  if (!category) {
    return { listings: [], offline: false };
  }

  const localMatches = await filterLocalListings({
    search: "",
    location: "",
    city: "",
    category,
  });

  try {
    const db = await getDb();
    const rows = await db
      .collection("listings")
      .find({
        category: { $regex: escapeRegex(category), $options: "i" },
      })
      .sort({ createdAt: -1 })
      .limit(100)
      .toArray();

    const listings = dedupeListings([...localMatches, ...rows]).map(
      serializeListing
    );
    return { listings, offline: false };
  } catch (err) {
    console.error("[getListingsForCategory]", err?.message || err);
    const sample = filterSampleListings({
      search: "",
      location: "",
      city: "",
      category,
    });
    const listings = dedupeListings([...localMatches, ...sample]).map(
      serializeListing
    );
    return { listings, offline: true };
  }
}

function dedupeListings(list) {
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
