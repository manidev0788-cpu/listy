"use client";

import { useMemo, useState } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { slugForCategoryName } from "@/lib/categorySlug";
import { FEATURED_CATEGORIES_NAV } from "@/lib/featuredCategories";

const ACCENT = "#2ed2c3";

export function CategoriesDirectory({ categories }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return categories;
    return categories.filter((c) => c.toLowerCase().includes(needle));
  }, [categories, q]);

  return (
    <div className="space-y-10">
      <section aria-labelledby="featured-cat-heading">
        <h2
          id="featured-cat-heading"
          className="text-lg font-bold text-zinc-900 sm:text-xl"
        >
          Popular categories
        </h2>
        <p className="mt-2 text-sm text-zinc-600">
          Quick links to high-traffic segments on Listfy.
        </p>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURED_CATEGORIES_NAV.map((c) => (
            <li key={c.slug}>
              <Link
                href={`/categories/${c.slug}`}
                className="flex items-center gap-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition hover:border-[#2ed2c3]/50 hover:shadow-md"
              >
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-xl text-2xl"
                  style={{ backgroundColor: `${ACCENT}18` }}
                  aria-hidden
                >
                  {c.emoji}
                </span>
                <span className="font-semibold text-zinc-900">
                  {c.shortLabel || c.name}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="all-cat-heading">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2
              id="all-cat-heading"
              className="text-lg font-bold text-zinc-900 sm:text-xl"
            >
              All categories
            </h2>
            <p className="mt-2 text-sm text-zinc-600">
              {categories.length} topics — search to narrow the list.
            </p>
          </div>
          <label className="block w-full sm:max-w-xs">
            <span className="sr-only">Search categories</span>
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Type to filter…"
              className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm outline-none ring-0 focus:border-[#2ed2c3] focus:ring-2 focus:ring-[#2ed2c3]/25"
            />
          </label>
        </div>

        <ul className="mt-6 columns-1 gap-x-8 text-sm sm:columns-2 md:columns-3 lg:columns-4">
          {filtered.map((name) => (
            <li key={name} className="mb-2 break-inside-avoid">
              <Link
                href={`/categories/${slugForCategoryName(name)}`}
                className="text-zinc-600 transition hover:text-[#1fa99c]"
              >
                {name}
              </Link>
            </li>
          ))}
        </ul>

        {filtered.length === 0 ? (
          <p className="mt-6 text-sm text-zinc-500">No categories match.</p>
        ) : null}
      </section>
    </div>
  );
}
