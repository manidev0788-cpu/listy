"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ListingCard } from "@/components/ListingCard";
import { SearchableSelect } from "@/components/SearchableSelect";
import { Spinner } from "@/components/Spinner";
import { CATEGORIES } from "@/lib/categories";
import { LOCATIONS } from "@/lib/locations";

const ACCENT = "#2ed2c3";

export default function ListingsPage() {
  return (
    <Suspense fallback={<PageFallback />}>
      <ListingsPageInner />
    </Suspense>
  );
}

function PageFallback() {
  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <section className="mx-auto max-w-[1200px] px-4 py-20 sm:px-6 lg:px-8">
        <LoadingState />
      </section>
    </main>
  );
}

function ListingsPageInner() {
  const urlParams = useSearchParams();

  const [search, setSearch] = useState(() => urlParams.get("search") || "");
  const [location, setLocation] = useState(
    () => urlParams.get("location") || urlParams.get("city") || ""
  );
  const [category, setCategory] = useState(
    () => urlParams.get("category") || ""
  );
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);
  const [hasFilters, setHasFilters] = useState(false);

  const fetchListings = useCallback(async (s = "", loc = "", cat = "") => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (s) params.set("search", s);
      if (loc) params.set("location", loc);
      if (cat) params.set("category", cat);
      const qs = params.toString();
      const url = qs ? `/api/listings?${qs}` : `/api/listings`;

      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data?.message || "Failed to load listings");
      }

      setListings(Array.isArray(data.listings) ? data.listings : []);
      setOffline(Boolean(data.offline) || data.source === "sample");
      setHasFilters(Boolean(s || loc || cat));
    } catch (err) {
      console.error("[listings] fetch error:", err);
      setError(err.message || "Something went wrong");
      setListings([]);
      setOffline(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const s = urlParams.get("search") || "";
    const loc = urlParams.get("location") || urlParams.get("city") || "";
    const cat = urlParams.get("category") || "";
    setSearch(s);
    setLocation(loc);
    setCategory(cat);
    fetchListings(s, loc, cat);
  }, [urlParams, fetchListings]);

  const onSubmit = (e) => {
    e.preventDefault();
    const cat = category === "All Categories" ? "" : category;
    fetchListings(search.trim(), location.trim(), cat.trim());
  };

  const onReset = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    fetchListings();
  };

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      <section className="border-b border-zinc-200 bg-white">
        <div className="mx-auto max-w-[1200px] px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-[#2ed2c3]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#1fa99c]">
                All Businesses
              </span>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-zinc-900 sm:text-4xl md:text-5xl">
                Browse Listings
              </h1>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-zinc-500 sm:text-base">
                Discover local businesses and services submitted to the
                directory.
              </p>
            </div>

            <Link
              href="/add-listing"
              className="inline-flex items-center gap-2 rounded-md bg-[#2ed2c3] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fa99c]"
            >
              <PlusIcon />
              Add Listing
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto -mt-8 max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <form
          onSubmit={onSubmit}
          className="rounded-xl bg-white p-4 shadow-[0_12px_32px_rgba(0,0,0,0.08)] ring-1 ring-zinc-100 sm:p-5"
          role="search"
          aria-label="Filter listings"
        >
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_auto]">
            <div className="relative">
              <span
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              >
                <SearchIcon />
              </span>
              <input
                type="text"
                name="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, category, or service"
                className="h-12 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-3 text-sm text-zinc-900 outline-none transition-colors placeholder:text-zinc-400 focus:border-[#2ed2c3] focus:bg-white focus:ring-2 focus:ring-[#2ed2c3]/25"
              />
            </div>

            <SearchableSelect
              value={location}
              onChange={setLocation}
              options={LOCATIONS}
              placeholder="City, country or area"
              searchPlaceholder="Search locations..."
              emptyLabel="locations"
              leftIcon={<PinIcon />}
              allowCustom
              ariaLabel="Filter by location"
            />

            <SearchableSelect
              value={category}
              onChange={setCategory}
              options={CATEGORIES}
              placeholder="All Categories"
              searchPlaceholder="Search categories..."
              emptyLabel="categories"
              leftIcon={<TagIcon />}
              ariaLabel="Filter by category"
            />

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-lg px-6 text-sm font-semibold text-white shadow-sm transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 lg:flex-none lg:min-w-[140px]"
                style={{ backgroundColor: ACCENT }}
              >
                {loading ? (
                  <Spinner size="sm" color="#ffffff" trackOpacity={0.35} />
                ) : (
                  <>
                    <SearchIcon />
                    Search
                  </>
                )}
              </button>
              {hasFilters && (
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex h-12 items-center justify-center rounded-lg border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-600 transition-colors hover:border-zinc-300 hover:text-zinc-900"
                  aria-label="Clear filters"
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </form>
      </section>

      <section className="mx-auto max-w-[1200px] px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        {offline && !loading && !error && (
          <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="mt-0.5 shrink-0 text-amber-500"
              aria-hidden
            >
              <path
                d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="font-semibold">
                Live database unavailable — showing demo listings.
              </p>
              <p className="mt-0.5 text-amber-700/90">
                Your MongoDB connection couldn&apos;t be reached right now.
                Once it&apos;s back online, your real listings will appear here
                automatically.
              </p>
            </div>
          </div>
        )}

        {error ? (
          <ErrorState message={error} />
        ) : loading ? (
          <LoadingState />
        ) : listings.length === 0 ? (
          <EmptyState hasFilters={hasFilters} onReset={onReset} />
        ) : (
          <>
            <div className="mb-6 flex items-center justify-between">
              <p className="text-sm text-zinc-500">
                Showing{" "}
                <span className="font-semibold text-zinc-900">
                  {listings.length}
                </span>{" "}
                {listings.length === 1 ? "listing" : "listings"}
                {hasFilters ? " matching your filters" : ""}
              </p>
            </div>

            <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {listings.map((listing) => (
                <li key={listing._id}>
                  <ListingCard listing={listing} />
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </main>
  );
}

function LoadingState() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-2xl bg-white px-6 py-24 shadow-[0_4px_20px_rgba(0,0,0,0.04)] ring-1 ring-zinc-100">
      <Spinner size="xl" />
      <p className="text-sm font-medium text-zinc-500">Loading listings…</p>
    </div>
  );
}

function EmptyState({ hasFilters, onReset }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-20 text-center">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#2ed2c3]/10 text-[#1fa99c]">
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <h2 className="text-xl font-semibold text-zinc-900">
        {hasFilters ? "No results found" : "No listings yet"}
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        {hasFilters
          ? "Try adjusting your search or clearing the filters to see more results."
          : "Be the first to add your business and reach more customers."}
      </p>
      {hasFilters ? (
        <button
          type="button"
          onClick={onReset}
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#2ed2c3] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fa99c]"
        >
          Clear Filters
        </button>
      ) : (
        <Link
          href="/add-listing"
          className="mt-6 inline-flex items-center gap-2 rounded-md bg-[#2ed2c3] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#1fa99c]"
        >
          <PlusIcon />
          Add Your First Listing
        </Link>
      )}
    </div>
  );
}

function ErrorState({ message }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-500">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M12 9v4m0 4h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2 className="text-lg font-semibold text-zinc-900">
        Couldn&apos;t load listings
      </h2>
      <p className="mt-2 max-w-sm text-sm text-zinc-500">
        {message || "Please try again in a moment."}
      </p>
    </div>
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

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path
        d="m20 20-3.5-3.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-5a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function ChevronDownIcon() {
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
        d="m6 9 6 6 6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

