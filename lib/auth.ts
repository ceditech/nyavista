import { z } from "zod";

const firebaseConfigSchema = z.object({
  apiKey: z.string().trim().min(1),
  authDomain: z.string().trim().min(1),
  projectId: z.string().trim().min(1),
  appId: z.string().trim().min(1),
  storageBucket: z.string().trim().min(1).optional(),
  messagingSenderId: z.string().trim().min(1).optional(),
}).strict();

export type FirebaseClientConfig = z.infer<typeof firebaseConfigSchema>;
export type AuthConfiguration =
  | { status: "configured"; config: FirebaseClientConfig; emulatorUrl?: string }
  | { status: "disabled"; missing: readonly string[] };

export const firebaseEnvironment = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  emulatorUrl: process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL,
};

const requiredEnvironmentNames = {
  apiKey: "NEXT_PUBLIC_FIREBASE_API_KEY",
  authDomain: "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  projectId: "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  appId: "NEXT_PUBLIC_FIREBASE_APP_ID",
} as const;

export function resolveAuthConfiguration(environment: typeof firebaseEnvironment): AuthConfiguration {
  const missing = Object.entries(requiredEnvironmentNames)
    .filter(([key]) => !environment[key as keyof typeof requiredEnvironmentNames]?.trim())
    .map(([, name]) => name);
  if (missing.length) return { status: "disabled", missing };

  const parsed = firebaseConfigSchema.safeParse({
    apiKey: environment.apiKey,
    authDomain: environment.authDomain,
    projectId: environment.projectId,
    appId: environment.appId,
    storageBucket: environment.storageBucket || undefined,
    messagingSenderId: environment.messagingSenderId || undefined,
  });
  if (!parsed.success) return { status: "disabled", missing: ["valid Firebase web configuration"] };
  return { status: "configured", config: parsed.data, emulatorUrl: environment.emulatorUrl || undefined };
}

export const authConfiguration = resolveAuthConfiguration(firebaseEnvironment);

export type AuthOperation = "sign-in" | "register" | "reset";
export type AuthResult = { ok: true; message: string } | { ok: false; message: string };
let emulatorConnected = false;

export async function runFirebaseAuthOperation(operation: AuthOperation, email: string, password?: string): Promise<AuthResult> {
  if (authConfiguration.status !== "configured") {
    return { ok: false, message: "Authentication is not configured for this environment." };
  }

  try {
    const [{ getApp, getApps, initializeApp }, authModule] = await Promise.all([
      import("firebase/app"),
      import("firebase/auth"),
    ]);
    const app = getApps().length ? getApp() : initializeApp(authConfiguration.config);
    const auth = authModule.getAuth(app);
    if (authConfiguration.emulatorUrl && !emulatorConnected) {
      authModule.connectAuthEmulator(auth, authConfiguration.emulatorUrl, { disableWarnings: true });
      emulatorConnected = true;
    }

    if (operation === "reset") {
      await authModule.sendPasswordResetEmail(auth, email);
      return { ok: true, message: "If the account is eligible, password-reset instructions have been requested." };
    }
    if (!password) return { ok: false, message: "Enter a password to continue." };
    if (operation === "register") {
      const credential = await authModule.createUserWithEmailAndPassword(auth, email, password);
      await authModule.sendEmailVerification(credential.user);
      return { ok: true, message: "Account created. Check your email to verify the address before continuing." };
    }
    await authModule.signInWithEmailAndPassword(auth, email, password);
    return { ok: true, message: "Firebase accepted the credentials. A secure server session is still required before protected features unlock." };
  } catch {
    return { ok: false, message: "We could not complete that request. Check the details or try again later." };
  }
}
