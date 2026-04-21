import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ListingCard } from "@/components/ListingCard";

const ACCENT = "#2ed2c3";

export const dynamic = "force-dynamic";
export const revalidate = 0;

function capitalize(str) {
  return String(str || "")
    .split(/[\s-]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function parseSlug(slug) {
  if (!slug || typeof slug !== "string" || !slug.includes("-in-")) {
    return null;
  }
  const [rawCategory, ...rest] = slug.split("-in-");
  const rawCity = rest.join("-in-");
  if (!rawCategory || !rawCity) return null;

  return {
    category: rawCategory.replace(/-/g, " ").trim(),
    city: rawCity.replace(/-/g, " ").trim(),
    categoryLabel: capitalize(rawCategory),
    cityLabel: capitalize(rawCity),
  };
}

async function getBaseUrl() {
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host");
  const proto =
    h.get("x-forwarded-proto") ||
    (host && host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

async function fetchListings(category, city) {
  try {
    const baseUrl = await getBaseUrl();
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (city) params.set("city", city);

    const res = await fetch(`${baseUrl}/api/listings?${params.toString()}`, {
      cache: "no-store",
    });

    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.listings) ? data.listings : [];
  } catch (err) {
    console.error("[seo-slug] fetch listings error:", err?.message || err);
    return [];
  }
}

function buildSeoParagraph(categoryLabel, cityLabel, count) {
  const hasResults = count > 0;
  const countPhrase = hasResults
    ? `We've handpicked ${count} verified ${categoryLabel.toLowerCase()} businesses across ${cityLabel}`
    : `We're actively curating the best ${categoryLabel.toLowerCase()} services in ${cityLabel}`;

  return `Looking for the best ${categoryLabel} in ${cityLabel}? You're in the right place. ${countPhrase} — each one reviewed for quality, reliability, and customer satisfaction. Whether you need quick support, a trusted professional for a long-term project, or simply want to compare options, our directory helps you shortlist the right ${categoryLabel.toLowerCase()} near you in minutes. Every listing includes contact details, services offered, and location, so you can reach out directly without any middlemen. Discover top-rated ${categoryLabel} in ${cityLabel} and hire with confidence — trusted by locals, loved by businesses.`;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);
  if (!parsed) return { title: "Not Found" };

  const { categoryLabel, cityLabel } = parsed;
  const title = `Best ${categoryLabel} in ${cityLabel} | Top Rated Services`;
  const description = `Find the best ${categoryLabel} in ${cityLabel}. Browse top-rated, verified ${categoryLabel.toLowerCase()} services with contact details, reviews, and locations — all in one place.`;

  return {
    title,
    description,
    alternates: { canonical: `/${slug}` },
    openGraph: {
      title,
      description,
      type: "website",
      url: `/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function SeoCityCategoryPage({ params }) {
  const { slug } = await params;
  const parsed = parseSlug(slug);

  if (!parsed) {
    notFound();
  }

  const { category, city, categoryLabel, cityLabel } = parsed;
  const listings = await fetchListings(category, city);
  const seoParagraph = buildSeoParagraph(categoryLabel, cityLabel, listings.length);

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <section className="relative overflow-hidden bg-zinc-900 text-white">
        <div
          aria-hidden
          className="absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(1000px 500px at 20% 0%, rgba(46,210,195,0.35), transparent 60%), radial-gradient(800px 400px at 100% 100%, rgba(46,210,195,0.22), transparent 60%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-black/60 mix-blend-multiply"
        />

        <div className="relative mx-auto max-w-[1200px] px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex items-center gap-2 text-xs font-medium text-white/70"
          >
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>
            <span aria-hidden>/</span>
            <Link
              href="/listings"
              className="transition-colors hover:text-white"
            >
              Listings
            </Link>
            <span aria-hidden>/</span>
            <span className="text-white">
              {categoryLabel} in {cityLabel}
            </span>
          </nav>

          <span
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider"
            style={{
              backgroundColor: `${ACCENT}22`,
              color: ACCENT,
            }}
          >
            <SparkleIcon />
            Local Directory
          </span>

          <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl">
            Best <span style={{ color: ACCENT }}>{categoryLabel}</span> in{" "}
            <span style={{ color: ACCENT }}>{cityLabel}</span>
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
            Find top-rated {categoryLabel.toLowerCase()} services in {cityLabel}{" "}
            — trusted by locals, verified for quality, and ready to help.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="#listings"
              className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: ACCENT }}
            >
              View {listings.length > 0 ? listings.length : ""} Listings
              <ArrowRightIcon />
            </Link>
            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 rounded-md border border-white/25 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <PlusIcon />
              List Your Business
            </Link>
          </div>

          <dl className="mt-10 grid max-w-xl grid-cols-3 gap-4 text-white">
            <HeroStat label="Listings" value={listings.length} />
            <HeroStat label="City" value={cityLabel} />
            <HeroStat label="Category" value={categoryLabel} />
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-8 rounded-2xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <span
              className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wider"
              style={{ backgroundColor: `${ACCENT}15`, color: "#1fa99c" }}
            >
              <InfoIcon />
              About this page
            </span>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              {categoryLabel} services in {cityLabel}, at a glance
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">
              A curated guide to help homeowners, renters, and businesses
              connect with the right {categoryLabel.toLowerCase()} quickly.
            </p>
          </div>
          <p className="text-base leading-relaxed text-zinc-700">
            {seoParagraph}
          </p>
        </div>
      </section>

      <section
        id="listings"
        className="mx-auto max-w-[1200px] scroll-mt-20 px-4 pb-20 sm:px-6 lg:px-8"
      >
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Top {categoryLabel} in {cityLabel}
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              {listings.length > 0
                ? `Showing ${listings.length} ${
                    listings.length === 1 ? "result" : "results"
                  } near you`
                : "No results yet — check back soon"}
            </p>
          </div>
          <Link
            href="/listings"
            className="hidden items-center gap-1 text-sm font-semibold text-[#1fa99c] transition-colors hover:text-[#2ed2c3] sm:inline-flex"
          >
            Browse all listings
            <ArrowRightIcon />
          </Link>
        </div>

        {listings.length === 0 ? (
          <EmptyState categoryLabel={categoryLabel} cityLabel={cityLabel} />
        ) : (
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings.map((listing) => (
              <li key={listing._id || listing.slug}>
                <ListingCard listing={listing} />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-16 sm:px-6 lg:px-8">
          <div
            className="overflow-hidden rounded-2xl p-8 text-center sm:p-12"
            style={{
              background:
                "linear-gradient(135deg, rgba(46,210,195,0.12), rgba(46,210,195,0.04))",
            }}
          >
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
              Are you a {categoryLabel.toLowerCase()} in {cityLabel}?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-zinc-600 sm:text-base">
              Add your business to our directory and get discovered by hundreds
              of local customers looking for services like yours every day.
            </p>
            <Link
              href="/add-listing"
              className="mt-6 inline-flex items-center gap-2 rounded-md px-6 py-3 text-sm font-semibold text-white shadow-sm transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: ACCENT }}
            >
              <PlusIcon />
              Add Your Listing — Free
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function HeroStat({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
      <dt className="text-[10px] font-semibold uppercase tracking-wider text-white/60">
        {label}
      </dt>
      <dd className="mt-1 truncate text-base font-semibold text-white sm:text-lg">
        {value}
      </dd>
    </div>
  );
}

function EmptyState({ categoryLabel, cityLabel }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
      <div
        className="mb-5 flex h-16 w-16 items-center justify-center rounded-full"
        style={{ backgroundColor: `${ACCENT}15`, color: "#1fa99c" }}
      >
        <ClockIcon />
      </div>
      <h3 className="text-xl font-semibold text-zinc-900">
        Coming soon in this area
      </h3>
      <p className="mt-2 max-w-md text-sm text-zinc-500">
        We&apos;re still building our list of {categoryLabel.toLowerCase()} in{" "}
        {cityLabel}. In the meantime, you can explore all listings or add your
        own business.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/listings"
          className="inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors"
          style={{ backgroundColor: ACCENT }}
        >
          Browse all listings
          <ArrowRightIcon />
        </Link>
        <Link
          href="/add-listing"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-900"
        >
          <PlusIcon />
          Add your business
        </Link>
      </div>
    </div>
  );
}

function SparkleIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 3v4M12 17v4M3 12h4M17 12h4M5.64 5.64l2.83 2.83M15.54 15.54l2.83 2.83M5.64 18.36l2.83-2.83M15.54 8.46l2.83-2.83"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12h14M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 5v14M5 12h14"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 8h.01M11 12h1v5h1"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7v5l3 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
