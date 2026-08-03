import assert from "node:assert/strict";
import test from "node:test";
import {
  roles,
  rolePermissions,
  permissions,
  permissionsForRole,
  hasPermission,
  isRole,
  type Role,
  type Permission,
} from "../lib/rbac.ts";

test("defines exactly the seven spec roles with a permission set each", () => {
  assert.deepEqual([...roles], ["guest", "user", "premium", "contributor", "editor", "senior_editor", "administrator"]);
  assert.equal(new Set(roles).size, roles.length);
  for (const role of roles) {
    assert.ok(permissionsForRole(role).length > 0, `${role} has permissions`);
    assert.equal(new Set(permissionsForRole(role)).size, permissionsForRole(role).length, `${role} has no duplicate permissions`);
  }
});

test("guest and user baselines match spec §6", () => {
  assert.ok(hasPermission("guest", "content:read"));
  assert.ok(hasPermission("guest", "content:search"));
  assert.ok(hasPermission("guest", "newsletter:subscribe"));
  // Guest cannot personalize or act on content.
  assert.equal(hasPermission("guest", "content:bookmark"), false);
  assert.equal(hasPermission("guest", "personalization:manage"), false);

  // User adds personalization on top of every guest permission.
  assert.ok(hasPermission("user", "content:bookmark"));
  assert.ok(hasPermission("user", "history:manage"));
  assert.equal(hasPermission("user", "draft:submit"), false);
  assert.equal(hasPermission("user", "content:approve:standard"), false);
});

test("contributor can submit but cannot publish or approve", () => {
  assert.ok(hasPermission("contributor", "draft:submit"));
  assert.ok(hasPermission("contributor", "source:submit"));
  assert.ok(hasPermission("contributor", "script:submit"));
  // "cannot publish" (spec §6): no scheduling/publishing or approval authority.
  assert.equal(hasPermission("contributor", "publishing:schedule"), false);
  assert.equal(hasPermission("contributor", "content:approve:standard"), false);
  assert.equal(hasPermission("contributor", "content:review"), false);
});

test("editorial authority escalates editor → senior_editor → administrator", () => {
  assert.ok(hasPermission("editor", "content:review"));
  assert.ok(hasPermission("editor", "content:approve:standard"));
  assert.equal(hasPermission("editor", "content:approve:sensitive"), false);

  assert.ok(hasPermission("senior_editor", "content:approve:sensitive"));
  assert.ok(hasPermission("senior_editor", "correction:manage"));
  assert.ok(hasPermission("senior_editor", "publishing:schedule"));
  assert.equal(hasPermission("senior_editor", "users:manage"), false);

  assert.ok(hasPermission("administrator", "users:manage"));
  assert.ok(hasPermission("administrator", "roles:manage"));
  assert.ok(hasPermission("administrator", "audit:read"));
  assert.ok(hasPermission("administrator", "costs:read"));
});

test("staff chain is cumulative over the base user", () => {
  const chain: Role[] = ["guest", "user", "contributor", "editor", "senior_editor", "administrator"];
  for (let i = 1; i < chain.length; i++) {
    const lower = new Set(permissionsForRole(chain[i - 1]));
    const higher = new Set(permissionsForRole(chain[i]));
    for (const permission of lower) {
      assert.ok(higher.has(permission), `${chain[i]} inherits ${permission} from ${chain[i - 1]}`);
    }
  }
});

test("premium is a separate consumer axis, not editorial authority", () => {
  // Premium extends user with consumer perks.
  assert.ok(hasPermission("premium", "media:read:premium"));
  assert.ok(hasPermission("premium", "content:read:deep"));
  assert.ok(hasPermission("premium", "content:bookmark")); // still a user
  // Premium grants no staff/editorial authority.
  assert.equal(hasPermission("premium", "draft:submit"), false);
  assert.equal(hasPermission("premium", "content:approve:standard"), false);

  // And the staff chain does not silently absorb billing-tier perks — proving
  // authorization is permission-based, not a single linear role rank.
  assert.equal(hasPermission("administrator", "media:read:premium"), false);
  assert.equal(hasPermission("administrator", "tracking:expanded"), false);
});

test("permission list is complete and deduplicated", () => {
  const union = new Set<Permission>();
  for (const role of roles) for (const permission of permissionsForRole(role)) union.add(permission);
  assert.equal(permissions.length, union.size);
  assert.deepEqual(new Set(permissions), union);
});

test("rolePermissions matrix is exposed for every role", () => {
  for (const role of roles) assert.equal(rolePermissions[role], permissionsForRole(role));
});

test("isRole guards untrusted role strings", () => {
  assert.ok(isRole("administrator"));
  assert.ok(isRole("guest"));
  assert.equal(isRole("root"), false);
  assert.equal(isRole("Administrator"), false); // case-sensitive
  assert.equal(isRole(42), false);
  assert.equal(isRole(null), false);
  assert.equal(isRole(undefined), false);
});
