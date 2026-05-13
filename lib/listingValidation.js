/**
 * Listing payload limits and validation for API routes (shared POST/PATCH).
 */

export const MAX_FILTER_STRING_LEN = 120;

export const MAX_LISTING_IMAGE_CHARS = 600_000; // ~base64 image cap; adjust if you use object storage only

export function escapeRegex(str) {
  return String(str).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const LIMITS = {
  name: 200,
  category: 120,
  address: 500,
  pincode: 32,
  city: 120,
  country: 120,
  services: 2000,
  phone: 40,
  email: 254,
  website: 2000,
  description: 15_000,
  image: MAX_LISTING_IMAGE_CHARS,
};

/** Regex filter strings longer than this are rejected early (avoid pathological `$regex`). */
export const REGEX_TERM_MAX_LENGTH = MAX_FILTER_STRING_LEN;

export function clampQueryTerm(value, max = REGEX_TERM_MAX_LENGTH) {
  const s = (value ?? "").toString().trim();
  return s.length > max ? s.slice(0, max) : s;
}

function clampStr(raw, max) {
  if (raw === null || raw === undefined) return "";
  const s = typeof raw === "string" ? raw.trim() : String(raw).trim();
  return s.length > max ? s.slice(0, max) : s;
}

/**
 * Normalize request body fields for creation (never trust client for userId/slug/_id).
 */
export function sanitizeListingPayload(body) {
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
    name: clampStr(name, LIMITS.name),
    category: clampStr(category, LIMITS.category),
    address: clampStr(address, LIMITS.address),
    pincode: clampStr(pincode, LIMITS.pincode),
    city: clampStr(city, LIMITS.city),
    country: clampStr(country, LIMITS.country),
    services: clampStr(services, LIMITS.services),
    phone: clampStr(phone, LIMITS.phone),
    email: clampStr(email, LIMITS.email).toLowerCase(),
    website: clampStr(website, LIMITS.website),
    description: clampStr(description, LIMITS.description),
    image:
      typeof image === "string"
        ? image.slice(0, LIMITS.image)
        : "",
  };
}

/**
 * Validates POST /api/listings body (beyond auth).
 */
export function validateListingCreate(payload) {
  if (!payload.name) {
    return { ok: false, message: "Business name is required." };
  }
  if (!payload.category) {
    return { ok: false, message: "Category is required." };
  }
  if (!payload.address) {
    return { ok: false, message: "Address is required." };
  }
  if (
    payload.email &&
    payload.email !== "" &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)
  ) {
    return {
      ok: false,
      message: "Please enter a valid email address.",
    };
  }
  return { ok: true };
}

/** Fields allowed on PATCH — values coerced/truncated */
export function buildListingPatch(body) {
  const EDIT_KEYS = [
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
  const patch = {};
  for (const key of EDIT_KEYS) {
    if (body && Object.prototype.hasOwnProperty.call(body, key)) {
      const limit = LIMITS[key] ?? 4000;
      if (key === "image") {
        const raw = body[key];
        patch[key] =
          typeof raw === "string"
            ? raw.slice(0, MAX_LISTING_IMAGE_CHARS)
            : "";
      } else {
        const v = clampStr(body[key], limit);
        patch[key] = key === "email" ? v.toLowerCase() : v;
      }
    }
  }
  return patch;
}
