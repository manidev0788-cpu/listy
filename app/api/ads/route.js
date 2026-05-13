import { NextResponse } from "next/server";
import { categoryNameFromSlug } from "@/lib/categorySlug";
import { getListingsForCategory } from "@/lib/getListingsForCategory";
import { clampQueryTerm } from "@/lib/listingValidation";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/ads?category=slug
 * Returns `{ ok, ads, count, offline? }` — `ads` matches listing shape used by the site.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const slug = clampQueryTerm(
    (searchParams.get("category") || "").trim().toLowerCase(),
    80
  );

  if (!slug) {
    return NextResponse.json({ ok: true, ads: [], count: 0 });
  }

  const name = categoryNameFromSlug(slug);
  if (!name) {
    return NextResponse.json({ ok: true, ads: [], count: 0 });
  }

  const { listings, offline } = await getListingsForCategory(name);

  return NextResponse.json({
    ok: true,
    ads: listings,
    count: listings.length,
    category: name,
    ...(offline ? { offline: true } : {}),
  });
}
