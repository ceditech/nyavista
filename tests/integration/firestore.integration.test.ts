/**
 * F-034 / F-030 service-account integration suite (LIVE, opt-in).
 *
 * Verifies the *deployed* Firestore rules behave, by acting as synthetic users
 * against the real project. Requires `GOOGLE_APPLICATION_CREDENTIALS` (Admin SDK
 * service account) and the `NEXT_PUBLIC_FIREBASE_*` web config — run via
 * `pnpm test:integration` (loads .env.local). Skipped when unconfigured, so it
 * never breaks the hermetic `pnpm test`.
 *
 * It writes only to namespaced `itest-*` user paths and one `admin/itest-*` doc,
 * and deletes every synthetic auth user and document in teardown.
 */

import assert from "node:assert/strict";
import test, { after, before } from "node:test";
import { cert, deleteApp as deleteAdminApp, initializeApp as initAdminApp } from "firebase-admin/app";
import { getAuth as getAdminAuth } from "firebase-admin/auth";
import { getFirestore as getAdminFirestore } from "firebase-admin/firestore";
import { deleteApp as deleteClientApp, initializeApp as initClientApp, type FirebaseApp } from "firebase/app";
import { getAuth as getClientAuth, signInWithCustomToken } from "firebase/auth";
import { doc, getDoc, getFirestore as getClientFirestore, setDoc, terminate, type Firestore } from "firebase/firestore";
import { createFirestoreBookmarkRepository, createFirestoreUserProfileRepository } from "../../lib/firestore-repositories.ts";

const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
const configured = Boolean(projectId && apiKey && process.env.GOOGLE_APPLICATION_CREDENTIALS);

if (!configured) {
  test("firestore integration suite", { skip: "set GOOGLE_APPLICATION_CREDENTIALS + NEXT_PUBLIC_FIREBASE_* in .env.local" }, () => {});
} else {
  const suffix = `${Date.now()}`;
  const uidA = `itest-${suffix}-a`;
  const uidB = `itest-${suffix}-b`;
  const uidAdmin = `itest-${suffix}-admin`;
  const uidForged = `itest-${suffix}-forged`;
  const adminDocId = `itest-${suffix}`;
  const iso = new Date().toISOString();

  // Sign custom tokens locally with the service-account private key (via a path)
  // so the suite needs no IAM Service Account Credentials API on the project.
  const adminApp = initAdminApp({ credential: cert(process.env.GOOGLE_APPLICATION_CREDENTIALS as string), projectId }, `admin-${suffix}`);
  const adminAuth = getAdminAuth(adminApp);
  const adminDb = getAdminFirestore(adminApp);

  const contexts: { app: FirebaseApp; db: Firestore; uid: string }[] = [];

  async function asUser(uid: string, claims?: Record<string, unknown>): Promise<Firestore> {
    const token = await adminAuth.createCustomToken(uid, claims);
    const app = initClientApp({ apiKey, authDomain: `${projectId}.firebaseapp.com`, projectId }, `client-${uid}`);
    await signInWithCustomToken(getClientAuth(app), token);
    const db = getClientFirestore(app);
    contexts.push({ app, db, uid });
    return db;
  }

  async function assertDenied(operation: Promise<unknown>): Promise<void> {
    await assert.rejects(operation, (error: unknown) => {
      const code = error && typeof error === "object" && "code" in error ? String((error as { code: unknown }).code) : "";
      assert.ok(code.includes("permission-denied"), `expected permission-denied, got "${code}"`);
      return true;
    });
  }

  let dbA: Firestore;
  let dbB: Firestore;
  let dbAdmin: Firestore;
  let dbForged: Firestore;

  before(async () => {
    [dbA, dbB, dbAdmin, dbForged] = await Promise.all([
      asUser(uidA),
      asUser(uidB),
      asUser(uidAdmin, { role: "administrator" }),
      asUser(uidForged, { role: "superuser" }), // not a known role
    ]);
  });

  after(async () => {
    for (const ctx of contexts) {
      try { await terminate(ctx.db); } catch { /* ignore */ }
      try { await deleteClientApp(ctx.app); } catch { /* ignore */ }
    }
    for (const uid of [uidA, uidB, uidAdmin, uidForged]) {
      try { await adminDb.recursiveDelete(adminDb.doc(`users/${uid}`)); } catch { /* ignore */ }
      try { await adminDb.recursiveDelete(adminDb.doc(`userData/${uid}`)); } catch { /* ignore */ }
      try { await adminAuth.deleteUser(uid); } catch { /* ignore */ }
    }
    try { await adminDb.doc(`admin/${adminDocId}`).delete(); } catch { /* ignore */ }
    try { await deleteAdminApp(adminApp); } catch { /* ignore */ }
  });

  test("owner can create, list, and remove their own bookmark", async () => {
    const repo = createFirestoreBookmarkRepository(dbA);
    await repo.add({ id: "bm1", uid: uidA, storySlug: "togo-public-policy", createdAt: iso });
    assert.ok((await repo.list(uidA)).some((b) => b.id === "bm1"));
    await repo.remove(uidA, "bm1");
    assert.equal(await repo.get(uidA, "bm1"), null);
  });

  test("a user cannot read another user's owner-scoped data", async () => {
    await createFirestoreBookmarkRepository(dbA).add({ id: "shared", uid: uidA, storySlug: "s", createdAt: iso });
    await assertDenied(getDoc(doc(dbB, "userData", uidA, "bookmarks", "shared")));
  });

  test("admin collection: denied for a normal user, allowed for a verified administrator claim", async () => {
    await assertDenied(setDoc(doc(dbA, "admin", adminDocId), { flag: true }));
    await assert.doesNotReject(setDoc(doc(dbAdmin, "admin", adminDocId), { flag: true }));
  });

  test("a forged/unknown role claim does not elevate (fail-closed on live rules)", async () => {
    await assertDenied(setDoc(doc(dbForged, "admin", `${adminDocId}-forged`), { flag: true }));
  });

  test("profile: owner writes and reads; other user denied; admin may read", async () => {
    await createFirestoreUserProfileRepository(dbA).save({ uid: uidA, displayName: "A", email: null, locale: "en-US", createdAt: iso, updatedAt: iso });
    await assert.doesNotReject(getDoc(doc(dbA, "users", uidA)));
    await assertDenied(getDoc(doc(dbB, "users", uidA)));
    await assert.doesNotReject(getDoc(doc(dbAdmin, "users", uidA)));
  });
}
