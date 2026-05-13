"use client";

import { useState } from "react";
import { HydrationSafeLink as Link } from "@/components/HydrationSafeLink";
import { buildListingPath } from "@/lib/slug";

const ACCENT = "#2ed2c3";

export function ListingCard({ listing }) {
  const { name, category, city, phone, image } = listing;
  const [imageFailed, setImageFailed] = useState(false);

  const initial = (name || "?").trim().charAt(0).toUpperCase();
  const hasImage =
    typeof image === "string" && image.length > 0 && !imageFailed;
  const href = buildListingPath(listing);

  return (
    <Link
      href={href}
      className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] ring-1 ring-zinc-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(0,0,0,0.12)] hover:ring-[#2ed2c3]/30 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2ed2c3]"
    >
      <div className="relative h-44 w-full overflow-hidden bg-linear-to-br from-[#2ed2c3] to-[#1fa99c]">
        {hasImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name || "Listing image"}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-t from-black/45 via-black/10 to-transparent"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-white/15 text-4xl font-bold text-white ring-2 ring-white/30 backdrop-blur-sm">
              {initial}
            </span>
          </div>
        )}

        {category && (
          <span className="absolute left-3 top-3 inline-flex max-w-[calc(100%-1.5rem)] items-center gap-1 truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-800 shadow-sm sm:left-4 sm:top-4 sm:max-w-[85%] sm:px-3 sm:text-[11px]">
            <TagIcon />
            {category}
          </span>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-semibold text-zinc-900 transition-colors duration-200 group-hover:text-[#1fa99c] sm:line-clamp-1 sm:text-lg">
          {name || "Untitled Listing"}
        </h3>

        <ul className="mt-3 space-y-2 text-sm text-zinc-600">
          {city && (
            <li className="flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2ed2c3]/10"
                style={{ color: ACCENT }}
              >
                <PinIcon />
              </span>
              <span className="truncate">{city}</span>
            </li>
          )}

          {phone && (
            <li className="flex items-center gap-2">
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2ed2c3]/10"
                style={{ color: ACCENT }}
              >
                <PhoneIcon />
              </span>
              <span className="truncate">{phone}</span>
            </li>
          )}
        </ul>

        <div className="mt-auto flex min-h-11 items-center justify-between border-t border-zinc-100 pt-4">
          <span className="text-xs font-medium text-zinc-400">
            View details
          </span>
          <span
            className="inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 group-hover:translate-x-1"
            style={{ backgroundColor: `${ACCENT}15`, color: ACCENT }}
          >
            <ArrowRightIcon />
          </span>
        </div>
      </div>
    </Link>
  );
}

function TagIcon() {
  return (
    <svg
      width="10"
      height="10"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0l-7.2-7.2A2 2 0 0 1 3 12V4a1 1 0 0 1 1-1h8a2 2 0 0 1 1.4.6l7.2 7.2a2 2 0 0 1 0 2.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" />
    </svg>
  );
}

function PinIcon() {
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
        d="M12 8a3 3 0 1 0 0 6 3 3 0 0 0 0-6Zm0-5a8 8 0 0 0-8 8c0 5.25 8 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function PhoneIcon() {
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
        d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
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
