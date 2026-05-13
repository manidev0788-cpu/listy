import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";

export default function ListingNotFound() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] items-center justify-center bg-[#f8f9fa] px-4 py-20">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl ring-1 ring-zinc-100">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#2ed2c3]/10 text-[#2ed2c3]">
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
              d="M9.5 9.5A2.5 2.5 0 0 1 12 8a2.5 2.5 0 0 1 .8 4.87c-.5.2-.8.65-.8 1.18V14m0 3v.01"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <h1 className="mt-5 text-2xl font-bold text-zinc-900">Listing not found</h1>
        <p className="mt-2 text-sm text-zinc-500">
          We couldn&apos;t find the listing you&apos;re looking for. It may have
          been removed or the link is incorrect.
        </p>
        <Link
          href="/listings"
          className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-6 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          Browse All Listings
        </Link>
      </div>
    </main>
  );
}
