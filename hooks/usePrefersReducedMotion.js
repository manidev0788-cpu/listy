"use client";

import { useSyncExternalStore } from "react";

function subscribeReducedMotion(cb) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

function snapshotReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Hydration-safe `prefers-reduced-motion` (false on server, then synced on client).
 */
export function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    snapshotReducedMotion,
    () => false
  );
}
