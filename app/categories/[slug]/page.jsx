import Link from "next/link";
import { notFound } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { categoryNameFromSlug } from "@/lib/categorySlug";
import { getListingsForCategory } from "@/lib/getListingsForCategory";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const name = categoryNameFromSlug(slug);
  if (!name) {
    return { title: "Category | Listfy" };
  }
  return {
    title: `${name} Listings | Listfy Directory`,
    description: `Browse ${name} businesses on Listfy. Compare local listings, photos, and contact information.`,
    openGraph: {
      title: `${name} | Listfy`,
      description: `Find ${name} services and businesses near you on Listfy.`,
    },
  };
}

export default async function CategorySlugPage({ params }) {
  const { slug } = await params;
  const categoryName = categoryNameFromSlug(slug);
  if (!categoryName) notFound();

  const { listings, offline } = await getListingsForCategory(categoryName);

  return (
    <main className="min-h-screen bg-[#f8faf9]">
      <div className="border-b border-zinc-200 bg-gradient-to-br from-[#0b0b0d] via-zinc-900 to-zinc-950">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-12">
          <nav aria-label="Breadcrumb" className="text-sm text-white/70">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link href="/" className="hover:text-white">
                  Home
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li>
                <Link href="/categories" className="hover:text-white">
                  Categories
                </Link>
              </li>
              <li aria-hidden className="text-white/40">
                /
              </li>
              <li className="font-medium text-white">{categoryName}</li>
            </ol>
          </nav>
          <h1 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {categoryName}
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/80 sm:text-base">
            Listings tagged in this category. Select a card to view full
            details.
          </p>
          {offline ? (
            <p className="mt-4 rounded-lg bg-amber-500/15 px-3 py-2 text-xs font-medium text-amber-100 ring-1 ring-amber-400/30 sm:text-sm">
              Live database unavailable — showing offline or demo listings if
              available.
            </p>
          ) : null}
        </div>
      </div>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center">
            <p className="text-lg font-semibold text-zinc-800">
              No listings found
            </p>
            <p className="mt-2 text-sm text-zinc-600">
              Nothing in this category yet. Try another category or add your
              business.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/categories"
                className="rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-semibold text-zinc-800 hover:border-zinc-400"
              >
                All categories
              </Link>
              <Link
                href="/add-listing"
                className="rounded-lg bg-[#2ed2c3] px-4 py-2 text-sm font-bold text-zinc-900 hover:bg-[#26c2b5]"
              >
                Add listing
              </Link>
            </div>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <li key={listing.slug || listing._id || listing.name}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
