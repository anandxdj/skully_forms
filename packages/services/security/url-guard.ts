import dns from "node:dns/promises";
import net from "node:net";

const IS_PROD = (process.env.NODE_ENV as string) === "prod";

const BLOCKED_HOSTNAMES = new Set(["localhost", "ip6-localhost", "ip6-loopback"]);

// Cloud metadata + link-local endpoints we never want to call out to.
const BLOCKED_LITERALS = new Set([
  "169.254.169.254", // AWS / GCP / OCI / DigitalOcean metadata
  "100.100.100.200", // Alibaba metadata
  "metadata.google.internal",
]);

function isPrivateIPv4(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => !Number.isFinite(p) || p < 0 || p > 255)) {
    return true;
  }
  const [a, b] = parts as [number, number, number, number];
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 0) return true;
  if (a === 169 && b === 254) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a >= 224) return true; // multicast + reserved
  return false;
}

function isPrivateIPv6(ip: string): boolean {
  const lower = ip.toLowerCase();
  if (lower === "::1" || lower === "::") return true;
  if (lower.startsWith("fc") || lower.startsWith("fd")) return true; // ULA
  if (lower.startsWith("fe80")) return true; // link-local
  if (lower.startsWith("ff")) return true; // multicast
  if (lower.startsWith("::ffff:")) {
    // IPv4-mapped — extract embedded v4
    const v4 = lower.slice("::ffff:".length);
    if (net.isIPv4(v4)) return isPrivateIPv4(v4);
  }
  return false;
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) return isPrivateIPv4(ip);
  if (net.isIPv6(ip)) return isPrivateIPv6(ip);
  return true;
}

export interface UrlGuardOptions {
  /** When true, http:// is rejected. Defaults to true in prod, false in dev. */
  requireHttps?: boolean;
  /** Skip DNS resolution. Useful for tests; never set in prod paths. */
  skipDnsCheck?: boolean;
}

export interface UrlGuardResult {
  ok: boolean;
  reason?: string;
}

/**
 * Validate a user-supplied URL against SSRF abuse:
 *   - Only http(s) schemes.
 *   - Reject loopback, RFC1918, link-local, CGNAT, multicast, ULA.
 *   - Reject known cloud-metadata hostnames and IPs.
 *   - In prod, require https.
 *   - Resolve DNS and re-check every returned address.
 *
 * IMPORTANT: this validates at store-time. A defender-in-depth caller should
 * also re-resolve immediately before the request to defeat DNS-rebinding.
 */
export async function assertSafeUrl(
  rawUrl: string,
  options: UrlGuardOptions = {},
): Promise<UrlGuardResult> {
  const requireHttps = options.requireHttps ?? IS_PROD;

  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return { ok: false, reason: "URL is malformed." };
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    return { ok: false, reason: "Only http(s) URLs are allowed." };
  }
  if (requireHttps && parsed.protocol !== "https:") {
    return { ok: false, reason: "https is required for webhook URLs." };
  }
  if (parsed.username || parsed.password) {
    return { ok: false, reason: "URL must not contain credentials." };
  }
  if (parsed.port && (parsed.port === "22" || parsed.port === "25")) {
    return { ok: false, reason: "Disallowed port." };
  }

  const host = parsed.hostname.toLowerCase();

  if (BLOCKED_HOSTNAMES.has(host) || BLOCKED_LITERALS.has(host)) {
    return { ok: false, reason: "Host is not reachable from this service." };
  }

  // If the host is already a literal IP, check it directly. Strip IPv6 brackets.
  const literalIp = host.startsWith("[") && host.endsWith("]") ? host.slice(1, -1) : host;
  if (net.isIP(literalIp)) {
    if (BLOCKED_LITERALS.has(literalIp) || isPrivateIp(literalIp)) {
      return { ok: false, reason: "Internal addresses are not allowed." };
    }
    return { ok: true };
  }

  if (options.skipDnsCheck) return { ok: true };

  // Resolve and reject if ANY answer is internal.
  let addresses: { address: string }[];
  try {
    addresses = await dns.lookup(host, { all: true });
  } catch {
    return { ok: false, reason: "Could not resolve host." };
  }
  for (const { address } of addresses) {
    if (BLOCKED_LITERALS.has(address) || isPrivateIp(address)) {
      return { ok: false, reason: "Host resolves to an internal address." };
    }
  }
  return { ok: true };
}
