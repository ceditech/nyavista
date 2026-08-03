import assert from "node:assert/strict";
import test from "node:test";

const emulatorOrigin = process.env.FIREBASE_AUTH_EMULATOR_HOST
  ? `http://${process.env.FIREBASE_AUTH_EMULATOR_HOST}`
  : "http://127.0.0.1:9099";
const identityEndpoint = `${emulatorOrigin}/identitytoolkit.googleapis.com/v1`;
const email = `fictional-user-${process.pid}@example.test`;
const password = "Fictional-Test-Password-023!";

async function authRequest(path: string, body: Record<string, unknown>) {
  const response = await fetch(`${identityEndpoint}/${path}?key=demo-key`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() as Record<string, unknown> };
}

test("Auth Emulator proves registration, verification, denial, sign-in, and recovery", async () => {
  const signup = await authRequest("accounts:signUp", { email, password, returnSecureToken: true });
  assert.equal(signup.status, 200);
  assert.equal(signup.body.email, email);
  assert.equal(typeof signup.body.localId, "string");
  assert.equal(typeof signup.body.idToken, "string");

  const verification = await authRequest("accounts:sendOobCode", { requestType: "VERIFY_EMAIL", idToken: signup.body.idToken });
  assert.equal(verification.status, 200);
  assert.equal(verification.body.email, email);

  const duplicate = await authRequest("accounts:signUp", { email, password, returnSecureToken: true });
  assert.equal(duplicate.status, 400);
  assert.match(JSON.stringify(duplicate.body), /EMAIL_EXISTS/);

  const denied = await authRequest("accounts:signInWithPassword", { email, password: "Incorrect-Test-Password!", returnSecureToken: true });
  assert.equal(denied.status, 400);
  assert.match(JSON.stringify(denied.body), /INVALID_(PASSWORD|LOGIN_CREDENTIALS)/);

  const signin = await authRequest("accounts:signInWithPassword", { email, password, returnSecureToken: true });
  assert.equal(signin.status, 200);
  assert.equal(signin.body.email, email);

  const recovery = await authRequest("accounts:sendOobCode", { requestType: "PASSWORD_RESET", email });
  assert.equal(recovery.status, 200);
  assert.equal(recovery.body.email, email);
});
