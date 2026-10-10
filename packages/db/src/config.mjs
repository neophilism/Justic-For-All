/**
 * Fail-closed validation. Never return or log invalid credential-bearing URLs.
 * @param {string | undefined} raw
 * @param {"production" | "development" | "test"} environment
 * @returns {{ok: true, url: string} | {ok: false, reason: "unconfigured" | "invalid_configuration"}}
 */
export function parseDatabaseUrl(raw, environment = "development") {
  if (!raw) return { ok: false, reason: "unconfigured" };
  try {
    const u = new URL(raw);
    if (!["postgres:","postgresql:"].includes(u.protocol) || !u.hostname || !u.username || !u.pathname || u.pathname === "/") {
      return { ok: false, reason: "invalid_configuration" };
    }
    if (environment === "production" && !["require","verify-full"].includes(u.searchParams.get("sslmode"))) {
      return { ok: false, reason: "invalid_configuration" };
    }
    return { ok: true, url: raw };
  } catch {
    return { ok: false, reason: "invalid_configuration" };
  }
}
