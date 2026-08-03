/**
 * F-030 Slice 1b — server-side authorization.
 *
 * Turns a verified session (`lib/server-session.ts`) into an authorization
 * decision against the RBAC model (`lib/rbac.ts`). Roles are resolved through
 * a `RoleProvider` seam so the role *source* can change (least-privilege now;
 * a Firestore store in F-034; verified custom claims when an admin backend
 * exists) without touching any caller — decision D-005.
 *
 * SERVER-ONLY. Authorization is permission-based, not role-rank-based, and
 * fails closed: an unresolved or unauthenticated caller gets the least
 * privilege, never an elevated role.
 */

import { hasPermission, isRole, type Permission, type Role } from "./rbac.ts";
import { type VerifiedSession } from "./server-session.ts";

export interface RoleProvider {
  /** Resolve the role for a verified session (or null when unauthenticated). Must fail closed. */
  resolveRole(session: VerifiedSession | null): Promise<Role>;
}

/**
 * Default provider: unauthenticated → `guest`; any verified session → base
 * `user`. Elevated roles require a real source (F-034 store or verified custom
 * claims) and are intentionally never granted here.
 */
export const leastPrivilegeRoleProvider: RoleProvider = {
  async resolveRole(session) {
    return session ? "user" : "guest";
  },
};

/**
 * Provider that trusts a role in a signature-verified custom claim, falling
 * back to `base` when the claim is absent or invalid. Safe because the claim
 * comes from an already-verified token; assigning such claims is a privileged
 * admin operation delivered later (F-033).
 */
export function customClaimsRoleProvider(base: RoleProvider = leastPrivilegeRoleProvider, claimName = "role"): RoleProvider {
  return {
    async resolveRole(session) {
      if (session) {
        const claimed = session.claims[claimName];
        if (isRole(claimed)) return claimed;
      }
      return base.resolveRole(session);
    },
  };
}

export interface AuthzContext {
  session: VerifiedSession | null;
  role: Role;
}

export class AuthorizationError extends Error {
  permission: Permission;
  role: Role;
  constructor(permission: Permission, role: Role) {
    super(`Role "${role}" lacks permission "${permission}".`);
    this.name = "AuthorizationError";
    this.permission = permission;
    this.role = role;
  }
}

/** Resolve the role for a session and return an authorization context. */
export async function resolveAuthzContext(
  session: VerifiedSession | null,
  provider: RoleProvider = leastPrivilegeRoleProvider,
): Promise<AuthzContext> {
  return { session, role: await provider.resolveRole(session) };
}

/** True when the context's role holds `permission`. */
export function authorize(context: AuthzContext, permission: Permission): boolean {
  return hasPermission(context.role, permission);
}

/** Throw `AuthorizationError` when the context's role lacks `permission`. */
export function requirePermission(context: AuthzContext, permission: Permission): void {
  if (!authorize(context, permission)) throw new AuthorizationError(permission, context.role);
}

/** One-shot convenience: resolve the role for a session and check `permission`. */
export async function authorizeSession(
  session: VerifiedSession | null,
  permission: Permission,
  provider: RoleProvider = leastPrivilegeRoleProvider,
): Promise<boolean> {
  return authorize(await resolveAuthzContext(session, provider), permission);
}
