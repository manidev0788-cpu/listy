import { escapeRegex } from "@/lib/listingValidation";

/**
 * Mongo filter for GET /api/listings. All string fields should be pre-normalized
 * with clampQueryTerm (empty strings are ignored).
 */
export function buildListingsMongoFilter({ search, location, city, category }) {
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

  return andClauses.length > 0 ? { $and: andClauses } : {};
}
