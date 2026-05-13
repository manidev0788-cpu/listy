"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalErrorPage({ error, reset }) {
  useEffect(() => {
    console.error("[app-error]", error?.message || error);
  }, [error]);

  return (
    <main className="flex min-h-[calc(100vh-72px)] min-w-0 flex-col items-center justify-center bg-[#f8f9fa] px-4 py-16 text-center">
      <div className="w-full max-w-md rounded-2xl border border-rose-200 bg-rose-50/80 px-8 py-10 shadow-sm ring-1 ring-rose-100">
        <h1 className="text-xl font-bold text-zinc-900 sm:text-2xl">
          Something went wrong
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-zinc-600">
          This page hit an unexpected error. You can try again or go back to a
          safe area of the site.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="inline-flex min-h-11 items-center justify-center rounded-md bg-zinc-900 px-5 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-zinc-800"
          >
            Try again
          </button>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-md border border-zinc-200 bg-white px-5 text-sm font-medium text-zinc-700 transition-colors duration-200 hover:border-zinc-300"
          >
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
