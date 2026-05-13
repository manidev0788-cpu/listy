/** Development-only console helpers (avoid noisy / sensitive logs in production). */
export function devLog(...args) {
  if (process.env.NODE_ENV === "development") {
    console.log(...args);
  }
}

export function devWarn(...args) {
  if (process.env.NODE_ENV === "development") {
    console.warn(...args);
  }
}
