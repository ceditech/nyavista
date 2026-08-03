import assert from "node:assert/strict";
import test from "node:test";
import { createAuthorizer, AuthorizationDenied, type SessionVerifier } from "../lib/require-authorization.ts";
import { customClaimsRoleProvider } from "../lib/authz.ts";

const verify: SessionVerifier = async (token) => {
  if (token === "valid-user") return { uid: "u1", email: "u@x.test", emailVerified: true, claims: {} };
  if (token === "valid-admin") return { uid: "a1", email: "a@x.test", emailVerified: true, claims: { role: "administrator" } };
  return null; // any other token is unverifiable
};

const authz = createAuthorizer({ verifySession: verify });
const claimsAuthz = createAuthorizer({ verifySession: verify, roleProvider: customClaimsRoleProvider() });

function request(token?: string): Request {
  return new Request("https://x.test/protected", token ? { headers: { authorization: `Bearer ${token}` } } : undefined);
}

test("no token resolves to guest: guest permissions pass, others 401", async () => {
  const ctx = await authz.authorizeRequest(request(), "content:read");
  assert.equal(ctx.role, "guest");
  await assert.rejects(
    authz.authorizeRequest(request(), "content:bookmark"),
    (error: unknown) => error instanceof AuthorizationDenied && error.status === 401,
  );
});

test("a valid user gets user permissions but is 403 for elevated ones", async () => {
  const ctx = await authz.authorizeRequest(request("valid-user"), "content:bookmark");
  assert.equal(ctx.role, "user");
  assert.equal(ctx.session?.uid, "u1");
  await assert.rejects(
    authz.authorizeRequest(request("valid-user"), "users:manage"),
    (error: unknown) => error instanceof AuthorizationDenied && error.status === 403,
  );
});

test("an unverifiable token is treated as unauthenticated (401), never elevated", async () => {
  await assert.rejects(
    authz.authorizeRequest(request("tampered-or-expired"), "content:bookmark"),
    (error: unknown) => error instanceof AuthorizationDenied && error.status === 401,
  );
});

test("a verified admin custom claim authorizes admin actions", async () => {
  const ctx = await claimsAuthz.authorizeRequest(request("valid-admin"), "users:manage");
  assert.equal(ctx.role, "administrator");
  // Without the custom-claims provider, the same token is only a base user.
  await assert.rejects(
    authz.authorizeRequest(request("valid-admin"), "users:manage"),
    (error: unknown) => error instanceof AuthorizationDenied && error.status === 403,
  );
});

test("sessionFromRequest returns the session or null, fail-closed", async () => {
  assert.equal(await authz.sessionFromRequest(request()), null);
  assert.equal(await authz.sessionFromRequest(request("nope")), null);
  const session = await authz.sessionFromRequest(request("valid-user"));
  assert.equal(session?.uid, "u1");
});

test("AuthorizationDenied maps to the right HTTP response", async () => {
  const unauth = new AuthorizationDenied(401, "content:bookmark").toResponse();
  assert.equal(unauth.status, 401);
  assert.deepEqual(await unauth.json(), { error: "unauthenticated", permission: "content:bookmark" });

  const forbidden = new AuthorizationDenied(403, "users:manage").toResponse();
  assert.equal(forbidden.status, 403);
  assert.deepEqual(await forbidden.json(), { error: "forbidden", permission: "users:manage" });
});
