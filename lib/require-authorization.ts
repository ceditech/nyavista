/**
 * F-030 Slice 3 — request-level authorization glue (server-only).
 *
 * Ties together `lib/server-session.ts` (verify identity) and `lib/authz.ts`
 * (resolve role + enforce permission) into the chain a route handler runs:
 *
 *   read bearer token -> verify session -> resolve role -> enforce permission
 *
 * Denials surface as `AuthorizationDenied`, which maps to an HTTP 401 (no/invalid
 * session) or 403 (authenticated but under-privileged) Response. Fail-closed: a
 * missing token, an unverifiable token, or an unconfigured project all resolve to
 * the `guest` role, so only guest-level permissions succeed.
 *
 * SERVER-ONLY. No protected routes exist yet (admin = Phase 5, settings = F-024);
 * those handlers call `authorizeRequest(request, permission)` when built. The
 * `verifySession` dependency is injectable so this is unit-testable without
 * network or emulator.
 */

import { type Permission } from "./rbac.ts";
import {
  authorize,
  resolveAuthzContext,
  leastPrivilegeRoleProvider,
  type AuthzContext,
  type RoleProvider,
} from "./authz.ts";
import {
  readBearerToken,
  verifyFirebaseIdToken,
  createGoogleSecureTokenKeyResolver,
  type VerifiedSession,
} from "./server-session.ts";

export type SessionVerifier = (token: string) => Promise<VerifiedSession | null>;

export class AuthorizationDenied extends Error {
  status: 401 | 403;
  permission: Permission;
  constructor(status: 401 | 403, permission: Permission) {
    super(status === 401 ? `Authentication required for "${permission}".` : `Insufficient role for "${permission}".`);
    this.name = "AuthorizationDenied";
    this.status = status;
    this.permission = permission;
  }

  toResponse(): Response {
    const error = this.status === 401 ? "unauthenticated" : "forbidden";
    return new Response(JSON.stringify({ error, permission: this.permission }), {
      status: this.status,
      headers: { "content-type": "application/json" },
    });
  }
}

export interface Authorizer {
  /** Verified session for a request, or null. Never throws for expected failures. */
  sessionFromRequest(request: Request): Promise<VerifiedSession | null>;
  /** Enforce `permission`; return the context when allowed, else throw AuthorizationDenied. */
  authorizeRequest(request: Request, permission: Permission): Promise<AuthzContext>;
}

export function createAuthorizer(options: { verifySession: SessionVerifier; roleProvider?: RoleProvider }): Authorizer {
  const provider = options.roleProvider ?? leastPrivilegeRoleProvider;

  async function sessionFromRequest(request: Request): Promise<VerifiedSession | null> {
    const token = readBearerToken(request);
    if (!token) return null;
    return options.verifySession(token);
  }

  async function authorizeRequest(request: Request, permission: Permission): Promise<AuthzContext> {
    const session = await sessionFromRequest(request);
    const context = await resolveAuthzContext(session, provider);
    if (!authorize(context, permission)) {
      throw new AuthorizationDenied(session ? 403 : 401, permission);
    }
    return context;
  }

  return { sessionFromRequest, authorizeRequest };
}

/**
 * Production verifier: validates the Firebase ID token against Google's public
 * keys, scoped to the configured project. Fail-closed when the project id is
 * absent (mirrors the env name used by `lib/auth.ts`) or the token is invalid.
 */
export function defaultSessionVerifier(
  projectId: string | undefined = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID?.trim() || undefined,
  resolveKey: (kid: string) => Promise<JsonWebKey | null> = createGoogleSecureTokenKeyResolver(),
): SessionVerifier {
  return async (token: string) => {
    if (!projectId) return null;
    const result = await verifyFirebaseIdToken(token, { projectId, resolveKey });
    return result.ok ? result.session : null;
  };
}

/** Default server authorizer (least-privilege role source). Route handlers use this. */
export const { sessionFromRequest, authorizeRequest } = createAuthorizer({
  verifySession: defaultSessionVerifier(),
});
