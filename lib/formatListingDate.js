/**
 * Stable date label for hydrating client components: same locale and UTC
 * calendar on server and browser (avoids TZ / default-locale mismatches).
 */
export function formatListingDate(iso) {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toLocaleDateString("en-US", {
      timeZone: "UTC",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return "—";
  }
}
