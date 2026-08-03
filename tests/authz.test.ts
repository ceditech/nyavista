import assert from "node:assert/strict";
import test from "node:test";
import {
  leastPrivilegeRoleProvider,
  customClaimsRoleProvider,
  resolveAuthzContext,
  authorize,
  requirePermission,
  authorizeSession,
  AuthorizationError,
} from "../lib/authz.ts";
import { type VerifiedSession } from "../lib/server-session.ts";

function session(claims: Record<string, unknown> = {}): VerifiedSession {
  return { uid: "user-123", email: "person@example.test", emailVerified: true, claims };
}

test("least-privilege provider: unauthenticated is guest, authenticated is user", async () => {
  assert.equal(await leastPrivilegeRoleProvider.resolveRole(null), "guest");
  assert.equal(await leastPrivilegeRoleProvider.resolveRole(session()), "user");
});

test("authorize enforces the RBAC matrix for the resolved role", async () => {
  const guest = await resolveAuthzContext(null);
  assert.equal(authorize(guest, "content:read"), true);
  assert.equal(authorize(guest, "content:bookmark"), false);

  const user = await resolveAuthzContext(session());
  assert.equal(authorize(user, "content:bookmark"), true);
  assert.equal(authorize(user, "draft:submit"), false);
  assert.equal(authorize(user, "users:manage"), false);
});

test("requirePermission throws AuthorizationError only when denied", async () => {
  const user = await resolveAuthzContext(session());
  assert.doesNotThrow(() => requirePermission(user, "content:bookmark"));
  assert.throws(() => requirePermission(user, "users:manage"), (error: unknown) => {
    assert.ok(error instanceof AuthorizationError);
    assert.equal(error.role, "user");
    assert.equal(error.permission, "users:manage");
    return true;
  });
});

test("custom-claims provider trusts a verified role claim and falls back safely", async () => {
  const provider = customClaimsRoleProvider();
  // A valid role in a (signature-verified) claim elevates.
  assert.equal(await provider.resolveRole(session({ role: "editor" })), "editor");
  const editor = await resolveAuthzContext(session({ role: "editor" }), provider);
  assert.equal(authorize(editor, "content:approve:standard"), true);
  assert.equal(authorize(editor, "users:manage"), false);

  // An invalid or absent claim falls back to least privilege — never elevates.
  assert.equal(await provider.resolveRole(session({ role: "superuser" })), "user");
  assert.equal(await provider.resolveRole(session()), "user");
  assert.equal(await provider.resolveRole(null), "guest");
});

test("authorizeSession composes resolution and the permission check", async () => {
  assert.equal(await authorizeSession(null, "content:read"), true);
  assert.equal(await authorizeSession(null, "content:bookmark"), false);
  assert.equal(await authorizeSession(session(), "content:bookmark"), true);
  assert.equal(await authorizeSession(session({ role: "administrator" }), "users:manage", customClaimsRoleProvider()), true);
});
