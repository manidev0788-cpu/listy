"use client";

import { useEffect } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";

export default function ListingError({ error, reset }) {
  useEffect(() => {
    console.error("[listing] page error:", error?.message || error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8f9fa] px-4 py-20">
      <div className="w-full max-w-md rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-xl ring-1 ring-zinc-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-rose-50 text-rose-500">
          <svg
            width="28"
            height="28"
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
        <h1 className="mt-5 text-2xl font-bold text-zinc-900">
          Couldn&apos;t load this listing
        </h1>
        <p className="mt-2 text-sm text-zinc-500">
          The database may be temporarily unavailable. Please try again in a
          moment.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Try again
          </button>
          <Link
            href="/listings"
            className="inline-flex h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-6 text-sm font-semibold text-zinc-700 transition-colors hover:border-zinc-300"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </main>
  );
}
