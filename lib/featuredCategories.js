/**
 * Featured categories for home hero, footer, and marketing.
 * `slug` matches `slugify(name)` and URL segment `/categories/[slug]`.
 * `name` is the canonical label used for DB/category filters.
 */
export const FEATURED_CATEGORIES_NAV = [
  {
    name: "Automotive",
    shortLabel: "Automotive",
    slug: "automotive",
    emoji: "🚗",
  },
  {
    name: "Beauty & Spas",
    shortLabel: "Beauty & Spa",
    slug: "beauty-spas",
    emoji: "✨",
  },
  {
    name: "Hotels",
    shortLabel: "Hotel",
    slug: "hotels",
    emoji: "🏨",
  },
  {
    name: "Real Estate",
    shortLabel: "Real Estate",
    slug: "real-estate",
    emoji: "🏠",
  },
  {
    name: "Restaurants",
    shortLabel: "Restaurant",
    slug: "restaurants",
    emoji: "🍽️",
  },
  {
    name: "Shopping",
    shortLabel: "Shopping",
    slug: "shopping",
    emoji: "🛍️",
  },
];

export function getFooterCategoryLinks() {
  return FEATURED_CATEGORIES_NAV.map((c) => ({
    name: c.shortLabel,
    href: `/categories/${c.slug}`,
  }));
}
