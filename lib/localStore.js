import { promises as fs } from "node:fs";
import path from "node:path";

function resolveDataDir() {
  if (process.env.LISTFY_DATA_DIR?.trim()) {
    return path.resolve(process.env.LISTFY_DATA_DIR.trim());
  }
  if (process.env.VERCEL) {
    return path.join("/tmp", "listfy-data");
  }
  return path.join(process.cwd(), ".data");
}

const DATA_DIR = resolveDataDir();
const LISTINGS_FILE = path.join(DATA_DIR, "listings.json");

async function ensureFile() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {}

  try {
    await fs.access(LISTINGS_FILE);
  } catch {
    await fs.writeFile(LISTINGS_FILE, "[]", "utf8");
  }
}

export async function readLocalListings() {
  try {
    await ensureFile();
    const raw = await fs.readFile(LISTINGS_FILE, "utf8");
    const parsed = JSON.parse(raw || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[localStore] read error:", err?.message || err);
    return [];
  }
}

export async function writeLocalListings(list) {
  try {
    await ensureFile();
    await fs.writeFile(LISTINGS_FILE, JSON.stringify(list, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("[localStore] write error:", err?.message || err);
    return false;
  }
}

export async function appendLocalListing(listing) {
  const all = await readLocalListings();
  all.unshift(listing);
  await writeLocalListings(all);
  return listing;
}

export async function findLocalListingBySlug(slug) {
  if (!slug) return null;
  const all = await readLocalListings();
  return all.find((l) => l.slug === slug) || null;
}

function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export async function filterLocalListings({
  search = "",
  location = "",
  city = "",
  category = "",
} = {}) {
  let out = await readLocalListings();

  if (search) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    out = out.filter(
      (l) =>
        rx.test(l.name || "") ||
        rx.test(l.category || "") ||
        rx.test(l.services || "") ||
        rx.test(l.description || "")
    );
  }

  if (location) {
    const rx = new RegExp(escapeRegex(location.trim()), "i");
    out = out.filter(
      (l) =>
        rx.test(l.city || "") ||
        rx.test(l.country || "") ||
        rx.test(l.address || "") ||
        rx.test(l.pincode || "")
    );
  }

  if (city) {
    const rx = new RegExp(escapeRegex(city.trim()), "i");
    out = out.filter((l) => rx.test(l.city || ""));
  }

  if (category) {
    const rx = new RegExp(escapeRegex(category.trim()), "i");
    out = out.filter((l) => rx.test(l.category || ""));
  }

  return out;
}

export async function localSlugExists(slug) {
  const all = await readLocalListings();
  return all.some((l) => l.slug === slug);
}

export async function updateLocalListingBySlug(slug, patch) {
  const all = await readLocalListings();
  const idx = all.findIndex((l) => l.slug === slug);
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeLocalListings(all);
  return all[idx];
}

export async function deleteLocalListingBySlug(slug) {
  const all = await readLocalListings();
  const next = all.filter((l) => l.slug !== slug);
  if (next.length === all.length) return false;
  await writeLocalListings(next);
  return true;
}

export async function findLocalListingById(id) {
  if (!id) return null;
  const all = await readLocalListings();
  return all.find((l) => String(l._id) === String(id)) || null;
}

export async function updateLocalListingById(id, patch) {
  const all = await readLocalListings();
  const idx = all.findIndex((l) => String(l._id) === String(id));
  if (idx === -1) return null;
  all[idx] = { ...all[idx], ...patch };
  await writeLocalListings(all);
  return all[idx];
}

export async function deleteLocalListingById(id) {
  const all = await readLocalListings();
  const next = all.filter((l) => String(l._id) !== String(id));
  if (next.length === all.length) return false;
  await writeLocalListings(next);
  return true;
}
