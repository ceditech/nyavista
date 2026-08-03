/**
 * F-024 Slice 1b — signed-in client Firebase accessor (client-only).
 *
 * Lazily initializes the shared client Firebase app/auth/firestore (reusing the
 * validated F-023 configuration), observes auth state, and hands components a
 * per-user personalization bundle. Dynamic imports keep Firebase out of the
 * initial bundle and off the server. Fails closed: when auth is not configured,
 * the observer reports "no user" and personalization is null.
 *
 * The running app connects to the live project in `.env.local`; a signed-in
 * user's reads/writes are enforced by the deployed owner-only rules (F-030).
 */

import { type FirebaseApp } from "firebase/app";
import { type Auth } from "firebase/auth";
import { type Firestore } from "firebase/firestore";
import { authConfiguration } from "./auth";
import { createUserPersonalization, type UserPersonalization } from "./personalization";

export type SignedInUser = { uid: string; email: string | null; emailVerified: boolean };

type ClientBundle = { app: FirebaseApp; auth: Auth; db: Firestore };
let bundlePromise: Promise<ClientBundle | null> | null = null;

async function loadClient(): Promise<ClientBundle | null> {
  if (authConfiguration.status !== "configured") return null;
  const [appModule, authModule, firestoreModule] = await Promise.all([
    import("firebase/app"),
    import("firebase/auth"),
    import("firebase/firestore"),
  ]);
  const app = appModule.getApps().length ? appModule.getApp() : appModule.initializeApp(authConfiguration.config);
  const auth = authModule.getAuth(app);
  if (authConfiguration.emulatorUrl) {
    try {
      authModule.connectAuthEmulator(auth, authConfiguration.emulatorUrl, { disableWarnings: true });
    } catch {
      /* already connected */
    }
  }
  return { app, auth, db: firestoreModule.getFirestore(app) };
}

/** Shared client bundle, or null when Firebase is not configured. Memoized. */
export function getFirebaseClient(): Promise<ClientBundle | null> {
  if (!bundlePromise) bundlePromise = loadClient();
  return bundlePromise;
}

/** Subscribe to auth state. Resolves to an unsubscribe function. Fails closed to null. */
export async function observeAuthUser(onChange: (user: SignedInUser | null) => void): Promise<() => void> {
  const client = await getFirebaseClient();
  if (!client) {
    onChange(null);
    return () => {};
  }
  const { onAuthStateChanged } = await import("firebase/auth");
  return onAuthStateChanged(client.auth, (user) =>
    onChange(user ? { uid: user.uid, email: user.email, emailVerified: user.emailVerified } : null),
  );
}

/** Personalization repositories bound to a signed-in user, or null when unconfigured. */
export async function getPersonalizationFor(uid: string): Promise<UserPersonalization | null> {
  const client = await getFirebaseClient();
  return client ? createUserPersonalization(client.db, uid) : null;
}
