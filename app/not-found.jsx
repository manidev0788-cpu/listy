import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100vh-72px)] min-w-0 flex-col items-center justify-center bg-[#f8f9fa] px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-2xl border border-dashed border-zinc-300 bg-white px-8 py-12 shadow-sm ring-1 ring-zinc-100">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#1fa99c]">
          404
        </p>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          Page not found
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          The page you requested does not exist or may have been moved. Check
          the URL or return to the home page.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-[#2ed2c3] px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-[#1fa99c]"
          >
            Go home
          </Link>
          <Link
            href="/listings"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:border-zinc-300 hover:bg-zinc-50"
          >
            Browse listings
          </Link>
        </div>
      </div>
    </main>
  );
}
