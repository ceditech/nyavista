import assert from "node:assert/strict";
import test from "node:test";
import { resolveAuthConfiguration } from "../lib/auth.ts";

test("authentication fails closed when required Firebase configuration is absent", () => {
  const result = resolveAuthConfiguration({ apiKey: undefined, authDomain: undefined, projectId: undefined, appId: undefined, storageBucket: undefined, messagingSenderId: undefined, emulatorUrl: undefined });
  assert.equal(result.status, "disabled");
  if (result.status === "disabled") assert.deepEqual(result.missing, ["NEXT_PUBLIC_FIREBASE_API_KEY", "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN", "NEXT_PUBLIC_FIREBASE_PROJECT_ID", "NEXT_PUBLIC_FIREBASE_APP_ID"]);
});

test("authentication accepts a complete Firebase web configuration", () => {
  const result = resolveAuthConfiguration({ apiKey: "demo-key", authDomain: "demo.example", projectId: "demo-project", appId: "demo-app", storageBucket: undefined, messagingSenderId: undefined, emulatorUrl: "http://127.0.0.1:9099" });
  assert.equal(result.status, "configured");
  if (result.status === "configured") assert.equal(result.emulatorUrl, "http://127.0.0.1:9099");
});

test("authentication rejects a non-loopback emulator target", () => {
  const result = resolveAuthConfiguration({ apiKey: "demo-key", authDomain: "demo.example", projectId: "demo-project", appId: "demo-app", storageBucket: undefined, messagingSenderId: undefined, emulatorUrl: "https://example.test:9099" });
  assert.deepEqual(result, { status: "disabled", missing: ["valid loopback Firebase Auth Emulator URL"] });
});
