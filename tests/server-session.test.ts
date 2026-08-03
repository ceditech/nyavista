import assert from "node:assert/strict";
import test from "node:test";
import { verifyFirebaseIdToken, readBearerToken, type VerifyOptions } from "../lib/server-session.ts";

const projectId = "demo-nyavista";
const kid = "test-key-1";
const now = Date.UTC(2026, 7, 2, 12, 0, 0);
const nowSeconds = Math.floor(now / 1000);

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function stringToBase64Url(value: string): string {
  return bytesToBase64Url(new TextEncoder().encode(value));
}

async function generateKeyPair(): Promise<CryptoKeyPair> {
  return crypto.subtle.generateKey(
    { name: "RSASSA-PKCS1-v1_5", modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: "SHA-256" },
    true,
    ["sign", "verify"],
  );
}

async function signJwt(privateKey: CryptoKey, header: object, payload: object): Promise<string> {
  const headerSegment = stringToBase64Url(JSON.stringify(header));
  const payloadSegment = stringToBase64Url(JSON.stringify(payload));
  const data = new TextEncoder().encode(`${headerSegment}.${payloadSegment}`);
  const signature = new Uint8Array(await crypto.subtle.sign("RSASSA-PKCS1-v1_5", privateKey, data));
  return `${headerSegment}.${payloadSegment}.${bytesToBase64Url(signature)}`;
}

const keyPair = await generateKeyPair();
const publicJwk = await crypto.subtle.exportKey("jwk", keyPair.publicKey);
const resolveKey: VerifyOptions["resolveKey"] = async (requestedKid) => (requestedKid === kid ? publicJwk : null);
const options: VerifyOptions = { projectId, resolveKey, now };

const validHeader = { alg: "RS256", typ: "JWT", kid };
const validPayload = {
  iss: `https://securetoken.google.com/${projectId}`,
  aud: projectId,
  sub: "user-123",
  iat: nowSeconds - 60,
  auth_time: nowSeconds - 120,
  exp: nowSeconds + 3600,
  email: "person@example.test",
  email_verified: true,
};

test("accepts a correctly signed, unexpired Firebase ID token", async () => {
  const token = await signJwt(keyPair.privateKey, validHeader, validPayload);
  const result = await verifyFirebaseIdToken(token, options);
  assert.equal(result.ok, true);
  if (result.ok) {
    assert.equal(result.session.uid, "user-123");
    assert.equal(result.session.email, "person@example.test");
    assert.equal(result.session.emailVerified, true);
  }
});

test("rejects an expired token", async () => {
  const token = await signJwt(keyPair.privateKey, validHeader, { ...validPayload, exp: nowSeconds - 10 });
  const result = await verifyFirebaseIdToken(token, options);
  assert.deepEqual(result, { ok: false, reason: "expired" });
});

test("rejects a token issued in the future", async () => {
  const token = await signJwt(keyPair.privateKey, validHeader, { ...validPayload, iat: nowSeconds + 600 });
  assert.deepEqual(await verifyFirebaseIdToken(token, options), { ok: false, reason: "issued-in-future" });
});

test("rejects a wrong audience and a wrong issuer", async () => {
  const wrongAud = await signJwt(keyPair.privateKey, validHeader, { ...validPayload, aud: "someone-else" });
  assert.deepEqual(await verifyFirebaseIdToken(wrongAud, options), { ok: false, reason: "audience-mismatch" });
  const wrongIss = await signJwt(keyPair.privateKey, validHeader, { ...validPayload, iss: "https://evil.example/demo-nyavista" });
  assert.deepEqual(await verifyFirebaseIdToken(wrongIss, options), { ok: false, reason: "issuer-mismatch" });
});

test("rejects a token missing its subject", async () => {
  const token = await signJwt(keyPair.privateKey, validHeader, { ...validPayload, sub: "" });
  assert.deepEqual(await verifyFirebaseIdToken(token, options), { ok: false, reason: "missing-subject" });
});

test("rejects a token signed by a different key", async () => {
  const attacker = await generateKeyPair();
  const token = await signJwt(attacker.privateKey, validHeader, validPayload);
  assert.deepEqual(await verifyFirebaseIdToken(token, options), { ok: false, reason: "invalid-signature" });
});

test("rejects an unknown key id and a non-RS256 algorithm", async () => {
  const unknownKid = await signJwt(keyPair.privateKey, { ...validHeader, kid: "rotated-away" }, validPayload);
  assert.deepEqual(await verifyFirebaseIdToken(unknownKid, options), { ok: false, reason: "unknown-kid" });

  // A "none"/HS256 downgrade must be refused before any key lookup.
  const noneHeader = stringToBase64Url(JSON.stringify({ alg: "none", typ: "JWT", kid }));
  const payloadSegment = stringToBase64Url(JSON.stringify(validPayload));
  const forged = `${noneHeader}.${payloadSegment}.`;
  assert.deepEqual(await verifyFirebaseIdToken(forged, options), { ok: false, reason: "unexpected-alg" });
});

test("rejects structurally malformed tokens", async () => {
  assert.deepEqual(await verifyFirebaseIdToken("not-a-jwt", options), { ok: false, reason: "malformed-token" });
  assert.deepEqual(await verifyFirebaseIdToken("a.b", options), { ok: false, reason: "malformed-token" });
});

test("reads bearer tokens from the Authorization header", () => {
  assert.equal(readBearerToken(new Request("https://x.test", { headers: { authorization: "Bearer abc.def.ghi" } })), "abc.def.ghi");
  assert.equal(readBearerToken(new Request("https://x.test", { headers: { authorization: "bearer  spaced.token.value" } })), "spaced.token.value");
  assert.equal(readBearerToken(new Request("https://x.test")), null);
  assert.equal(readBearerToken(new Request("https://x.test", { headers: { authorization: "Basic abc" } })), null);
});
