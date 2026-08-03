/**
 * F-030 Slice 1a — Role-based access control (RBAC) domain model.
 *
 * A pure, side-effect-free authorization vocabulary derived from the roles in
 * NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md §6. This module defines *who may do
 * what*. It performs no identity checks and reads no request state; server-side
 * enforcement (session verification and `authorize()`) is F-030 Slice 1b and
 * consumes this model.
 *
 * Per spec §6: "Every permission must be enforced on the server. Hidden UI is
 * not authorization." This matrix must never be the sole gate in the UI.
 *
 * Modeling decision (recorded as D-006): `premium` is a consumer entitlement
 * tier branching off `user`; it does NOT grant editorial authority. Editorial
 * and administrative roles form a separate cumulative staff chain over the base
 * signed-in `user` (user → contributor → editor → senior_editor →
 * administrator). Billing-based access (F-072) and staff access to premium
 * content are intentionally left as separate, additive concerns to reconcile
 * later, rather than conflated into this matrix now. Authorization is
 * permission-based, not role-rank-based, so the two axes never need a single
 * linear ordering.
 */

export const roles = [
  "guest",
  "user",
  "premium",
  "contributor",
  "editor",
  "senior_editor",
  "administrator",
] as const;

export type Role = (typeof roles)[number];

// Guest — spec §6: browse, search, view sources, limited media, newsletter signup.
const guestPermissions = [
  "content:read",
  "content:search",
  "source:read",
  "media:read:limited",
  "newsletter:subscribe",
] as const;

// User — adds: personalize, follow, bookmark, save media, manage alerts and history.
const userPermissions = [
  ...guestPermissions,
  "personalization:manage",
  "content:follow",
  "content:bookmark",
  "media:save",
  "alerts:manage",
  "history:manage",
] as const;

// Premium user — consumer tier over `user`: deeper context, advanced filters,
// premium media, expanded tracking. Not part of the staff chain.
const premiumPermissions = [
  ...userPermissions,
  "content:read:deep",
  "search:filters:advanced",
  "media:read:premium",
  "tracking:expanded",
] as const;

// Contributor — staff over `user`: submit drafts, sources, and scripts. Cannot publish.
const contributorPermissions = [
  ...userPermissions,
  "draft:submit",
  "source:submit",
  "script:submit",
] as const;

// Editor — adds: review and approve standard-risk content.
const editorPermissions = [
  ...contributorPermissions,
  "content:review",
  "content:approve:standard",
] as const;

// Senior editor — adds: approve sensitive content, corrections, overrides, schedules.
const seniorEditorPermissions = [
  ...editorPermissions,
  "content:approve:sensitive",
  "correction:manage",
  "content:override",
  "publishing:schedule",
] as const;

// Administrator — adds: manage users, roles, sources, markets, providers,
// settings, audit, and costs.
const administratorPermissions = [
  ...seniorEditorPermissions,
  "users:manage",
  "roles:manage",
  "sources:manage",
  "markets:manage",
  "providers:manage",
  "settings:manage",
  "audit:read",
  "costs:read",
] as const;

// The full permission union is the union of the two chain tips: the premium
// branch and the administrator staff chain together cover every permission.
export type Permission =
  | (typeof premiumPermissions)[number]
  | (typeof administratorPermissions)[number];

const rolePermissionMap: Record<Role, readonly Permission[]> = {
  guest: guestPermissions,
  user: userPermissions,
  premium: premiumPermissions,
  contributor: contributorPermissions,
  editor: editorPermissions,
  senior_editor: seniorEditorPermissions,
  administrator: administratorPermissions,
};

/** The role → permissions matrix, read-only. */
export const rolePermissions: Readonly<Record<Role, readonly Permission[]>> = rolePermissionMap;

/** Every distinct permission in the model, deduplicated. */
export const permissions: readonly Permission[] = [
  ...new Set<Permission>([...administratorPermissions, ...premiumPermissions]),
];

/** Permissions granted to a role. */
export function permissionsForRole(role: Role): readonly Permission[] {
  return rolePermissionMap[role];
}

/** True when `role` is granted `permission`. Permission-based, not role-rank-based. */
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissionMap[role].includes(permission);
}

/** Runtime type guard for role strings arriving from untrusted sources. */
export function isRole(value: unknown): value is Role {
  return typeof value === "string" && (roles as readonly string[]).includes(value);
}
