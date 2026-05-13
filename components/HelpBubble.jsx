"use client";

import { useEffect, useState } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";

/**
 * Lightweight on-site help entry (contact + quick links). Keeps theme; mobile-safe sizing.
 */
export function HelpBubble() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div
      className="pointer-events-none fixed bottom-0 right-0 z-40 flex flex-col items-end gap-3 p-4 sm:bottom-2 sm:right-2 sm:p-5"
      style={{
        paddingBottom: "max(1rem, env(safe-area-inset-bottom))",
        paddingRight: "max(1rem, env(safe-area-inset-right))",
      }}
    >
      <div className="pointer-events-auto flex max-w-[calc(100vw-2rem)] flex-col items-end gap-2">
        {open && (
          <div
            id="help-bubble-panel"
            className="max-h-[min(55vh,22rem)] w-[min(18rem,calc(100vw-2rem))] origin-bottom-right overflow-y-auto overscroll-contain rounded-2xl border border-zinc-200/80 bg-white/95 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.12)] ring-1 ring-zinc-100 backdrop-blur-md motion-safe:animate-[fade-in_220ms_ease-out_both] dark:border-zinc-600/80 dark:bg-zinc-900/95 dark:ring-zinc-800"
            role="dialog"
            aria-label="Help and contact"
          >
            <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
              How can we help?
            </p>
            <p className="mt-1 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
              Questions about listings or your account? Reach us or keep browsing.
            </p>
            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="mt-3 flex min-h-11 w-full items-center justify-center rounded-xl bg-[#2ed2c3] px-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-[#26b9ac] active:scale-[0.99]"
            >
              Contact us
            </Link>
            <Link
              href="/listings"
              onClick={() => setOpen(false)}
              className="mt-2 flex min-h-11 w-full items-center justify-center rounded-xl border border-zinc-200 bg-white px-4 text-sm font-medium text-zinc-800 transition duration-200 hover:border-zinc-300 hover:bg-zinc-50 active:scale-[0.99] dark:border-zinc-600 dark:bg-zinc-800/80 dark:text-zinc-100 dark:hover:border-zinc-500 dark:hover:bg-zinc-800"
            >
              Browse listings
            </Link>
          </div>
        )}

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="help-bubble-panel"
          id="help-bubble-trigger"
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#2ed2c3] text-white shadow-[0_8px_24px_rgba(46,210,195,0.45)] ring-2 ring-white/90 transition duration-200 hover:bg-[#26b9ac] hover:shadow-[0_10px_28px_rgba(46,210,195,0.5)] active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#2ed2c3] dark:ring-zinc-700"
        >
          <span className="sr-only">{open ? "Close help menu" : "Open help menu"}</span>
          {open ? <CloseIcon /> : <ChatIcon />}
        </button>
      </div>
    </div>
  );
}

function ChatIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M21 12a9 9 0 0 1-9 9 9.1 9.1 0 0 1-4.2-1L3 21l1-4.8A9 9 0 1 1 21 12Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
