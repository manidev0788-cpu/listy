import { readJsonResponse } from "@/lib/readJsonResponse";

/**
 * Load NextAuth `/api/auth/providers` without `next-auth/react` `getProviders()`,
 * which logs CLIENT_FETCH_ERROR on every transient failure (common in dev when
 * Turbopack is still compiling the route).
 */
export async function fetchAuthProvidersWithRetry(options = {}) {
  const delaysMs = options.delaysMs ?? [0, 250, 600, 1400, 3000];
  let lastError;

  for (let i = 0; i < delaysMs.length; i++) {
    if (i > 0) {
      await new Promise((r) => setTimeout(r, delaysMs[i] - delaysMs[i - 1]));
    }
    try {
      const res = await fetch("/api/auth/providers", {
        method: "GET",
        credentials: "same-origin",
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      if (!res.ok) {
        lastError = new Error(`providers HTTP ${res.status}`);
        continue;
      }
      const data = await readJsonResponse(res);
      const values = Object.values(data || {});
      const looksLikeProviders = values.some(
        (v) =>
          v &&
          typeof v === "object" &&
          typeof v.type === "string" &&
          (typeof v.id === "string" || typeof v.name === "string")
      );
      if (!looksLikeProviders) {
        lastError = new Error("providers invalid");
        continue;
      }
      return data;
    } catch (err) {
      lastError = err;
    }
  }

  throw lastError ?? new Error("providers unavailable");
}
