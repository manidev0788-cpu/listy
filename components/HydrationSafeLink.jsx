"use client";

import NextLink from "next/link";

/**
 * Forwards next/link while suppressing attribute mismatches from browser
 * extensions (password managers, translators, Grammarly-style tools) that
 * mutate the DOM before React hydrates.
 */
export function HydrationSafeLink(props) {
  return <NextLink {...props} suppressHydrationWarning />;
}
