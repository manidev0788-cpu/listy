export function slugify(input, fallback = "item") {
  const raw = String(input || "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");

  return raw || fallback;
}

export function createSlug(name, city) {
  const base = `${name || ""}-${city || ""}`;
  return slugify(base, "listing");
}

export function buildListingPath(listing) {
  const slug =
    listing?.slug || createSlug(listing?.name, listing?.city) || "listing";
  return `/listing/${slug}`;
}
