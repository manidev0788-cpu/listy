import { CATEGORIES } from "@/lib/categories";
import { slugify } from "@/lib/slug";

const slugToName = new Map();
for (const name of CATEGORIES) {
  slugToName.set(slugify(name), name);
}

export function categoryNameFromSlug(slug) {
  if (!slug || typeof slug !== "string") return null;
  return slugToName.get(slug.trim().toLowerCase()) || null;
}

export function slugForCategoryName(name) {
  return slugify(name);
}
