/**
 * Parse a fetch `Response` body as JSON without throwing.
 * Handles empty bodies and HTML error pages (common when proxies/CDNs fail).
 *
 * @param {Response} res
 * @returns {Promise<Record<string, unknown>>}
 */
export async function readJsonResponse(res) {
  let text = "";
  try {
    text = await res.text();
  } catch {
    return {
      ok: false,
      message: "Could not read the server response. Please try again.",
    };
  }
  const trimmed = (text || "").trim();
  if (!trimmed) return {};
  try {
    return JSON.parse(trimmed);
  } catch {
    return {
      ok: false,
      message:
        "Received an unexpected response from the server. Please try again.",
    };
  }
}
