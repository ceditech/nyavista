/**
 * F-030 Slice 1b — server-side Firebase identity verification (server-only).
 *
 * Verifies a Firebase ID token (an RS256 JWT) against Google's public signing
 * keys using Web Crypto (`crypto.subtle`). This is the runtime-native path for
 * Cloudflare Workers, where the Node-oriented Firebase Admin SDK is unsuitable
 * (decision D-005). The module is fail-closed: any malformed, mis-signed,
 * expired, or mis-audienced token yields `{ ok: false }`, never a session.
 *
 * SERVER-ONLY. Never import this into a Client Component or ship it to the
 * browser. It grants no authorization by itself — pair it with `lib/authz.ts`.
 *
 * The signing-key lookup is injected (`resolveKey`) so the cryptographic and
 * claims logic stays pure and unit-testable without network access. The
 * production resolver (`createGoogleSecureTokenKeyResolver`) is a separate,
 * cache-aware concern.
 */

export interface VerifiedSession {
  uid: string;
  email: string | null;
  emailVerified: boolean;
  claims: Record<string, unknown>;
}

export interface VerifyOptions {
  /** Firebase project id; must equal the token `aud` and appear in `iss`. */
  projectId: string;
  /** Resolve a public JWK by its `kid`; return null when unknown. */
  resolveKey: (kid: string) => Promise<JsonWebKey | null>;
  /** Current time in epoch ms; injectable for deterministic tests. */
  now?: number;
  /** Clock-skew tolerance in seconds. */
  leewaySeconds?: number;
}

export type VerifyResult =
  | { ok: true; session: VerifiedSession }
  | { ok: false; reason: string };

function fail(reason: string): VerifyResult {
  return { ok: false, reason };
}

function base64UrlToBytes(input: string): Uint8Array<ArrayBuffer> {
  const padding = input.length % 4 === 0 ? "" : "=".repeat(4 - (input.length % 4));
  const base64 = input.replaceAll("-", "+").replaceAll("_", "/") + padding;
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function base64UrlToString(input: string): string {
  return new TextDecoder().decode(base64UrlToBytes(input));
}

function decodeSegment(segment: string): Record<string, unknown> | null {
  try {
    const parsed: unknown = JSON.parse(base64UrlToString(segment));
    return typeof parsed === "object" && parsed !== null ? (parsed as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

/**
 * Verify a Firebase ID token and return the trusted session, or a reason for
 * rejection. Validates signature (RS256), `alg`, `kid`, `iss`, `aud`, `exp`,
 * `iat`, `auth_time`, and `sub`.
 */
export async function verifyFirebaseIdToken(token: string, options: VerifyOptions): Promise<VerifyResult> {
  if (typeof token !== "string") return fail("malformed-token");
  const segments = token.split(".");
  if (segments.length !== 3) return fail("malformed-token");
  const [headerSegment, payloadSegment, signatureSegment] = segments;

  const header = decodeSegment(headerSegment);
  if (!header) return fail("invalid-header");
  if (header.alg !== "RS256") return fail("unexpected-alg");
  if (header.typ !== undefined && header.typ !== "JWT") return fail("unexpected-typ");
  const kid = header.kid;
  if (typeof kid !== "string" || kid.length === 0) return fail("missing-kid");

  const payload = decodeSegment(payloadSegment);
  if (!payload) return fail("invalid-payload");

  const jwk = await options.resolveKey(kid);
  if (!jwk) return fail("unknown-kid");

  let key: CryptoKey;
  try {
    key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  } catch {
    return fail("invalid-key");
  }

  const signature = base64UrlToBytes(signatureSegment);
  const signedData = new TextEncoder().encode(`${headerSegment}.${payloadSegment}`);
  const validSignature = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, signature, signedData);
  if (!validSignature) return fail("invalid-signature");

  const now = options.now ?? Date.now();
  const leeway = (options.leewaySeconds ?? 0) * 1000;

  if (typeof payload.exp !== "number" || payload.exp * 1000 <= now - leeway) return fail("expired");
  if (typeof payload.iat !== "number" || payload.iat * 1000 > now + leeway) return fail("issued-in-future");
  if (payload.auth_time !== undefined && (typeof payload.auth_time !== "number" || payload.auth_time * 1000 > now + leeway)) {
    return fail("invalid-auth-time");
  }
  if (payload.aud !== options.projectId) return fail("audience-mismatch");
  if (payload.iss !== `https://securetoken.google.com/${options.projectId}`) return fail("issuer-mismatch");
  if (typeof payload.sub !== "string" || payload.sub.length === 0) return fail("missing-subject");

  return {
    ok: true,
    session: {
      uid: payload.sub,
      email: typeof payload.email === "string" ? payload.email : null,
      emailVerified: payload.email_verified === true,
      claims: payload,
    },
  };
}

/** Extract a bearer token from a request's Authorization header, or null. */
export function readBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = /^Bearer\s+(.+)$/i.exec(header.trim());
  return match ? match[1].trim() : null;
}

const SECURE_TOKEN_JWKS_URL =
  "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com";

/**
 * Production key resolver: fetches Google's Secure Token JWK set and caches it
 * by `kid` until the response's `Cache-Control: max-age` elapses, refreshing
 * once on an unknown `kid` (key rotation). `fetchImpl` is injectable for tests.
 */
export function createGoogleSecureTokenKeyResolver(fetchImpl: typeof fetch = fetch): (kid: string) => Promise<JsonWebKey | null> {
  let cache: { keys: Map<string, JsonWebKey>; expiresAt: number } | null = null;

  async function load(): Promise<Map<string, JsonWebKey>> {
    const response = await fetchImpl(SECURE_TOKEN_JWKS_URL);
    if (!response.ok) throw new Error(`Secure Token JWKS fetch failed: ${response.status}`);
    const body = (await response.json()) as { keys?: (JsonWebKey & { kid?: string })[] };
    const keys = new Map<string, JsonWebKey>();
    for (const jwk of body.keys ?? []) if (typeof jwk.kid === "string") keys.set(jwk.kid, jwk);
    const maxAge = parseMaxAge(response.headers.get("cache-control")) ?? 3600;
    cache = { keys, expiresAt: Date.now() + maxAge * 1000 };
    return keys;
  }

  return async (kid: string) => {
    if (!cache || cache.expiresAt <= Date.now()) await load();
    if (cache!.keys.has(kid)) return cache!.keys.get(kid) ?? null;
    // Unknown kid: keys may have rotated — refresh once before giving up.
    await load();
    return cache!.keys.get(kid) ?? null;
  };
}

function parseMaxAge(cacheControl: string | null): number | null {
  if (!cacheControl) return null;
  const match = /max-age=(\d+)/.exec(cacheControl);
  return match ? Number(match[1]) : null;
}
