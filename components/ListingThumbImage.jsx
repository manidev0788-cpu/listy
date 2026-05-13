"use client";

import { useState } from "react";

/**
 * Small listing thumbnail with graceful fallback when `src` fails to load.
 */
export function ListingThumbImage({ src, name, className = "" }) {
  const [failed, setFailed] = useState(false);
  const initial = (name || "?").trim().charAt(0).toUpperCase();

  if (!src || failed) {
    return (
      <div
        className={`flex shrink-0 items-center justify-center rounded-md bg-[#2ed2c3]/10 text-sm font-semibold text-[#1fa99c] ring-1 ring-zinc-200 ${className}`}
        aria-hidden
      >
        {initial}
      </div>
    );
  }

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary listing URLs */}
      <img
        src={src}
        alt=""
        className={className}
        onError={() => setFailed(true)}
      />
    </>
  );
}
