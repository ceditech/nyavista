import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  outputDir: "./test-results",
  fullyParallel: false,
  forbidOnly: true,
  retries: 0,
  workers: 1,
  reporter: [["list"], ["html", { open: "never" }]],
  snapshotPathTemplate: "{testDir}/visual-baselines/{arg}{ext}",
  expect: {
    toHaveScreenshot: {
      animations: "disabled",
      caret: "hide",
      scale: "css",
      maxDiffPixelRatio: 0.001,
    },
  },
  use: {
    baseURL: "http://[::1]:3100",
    browserName: "chromium",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "America/Chicago",
    serviceWorkers: "block",
  },
  webServer: {
    command: "pnpm dev -- --port 3100",
    url: "http://[::1]:3100",
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_FIREBASE_API_KEY: "",
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: "",
      NEXT_PUBLIC_FIREBASE_PROJECT_ID: "",
      NEXT_PUBLIC_FIREBASE_APP_ID: "",
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: "",
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: "",
      NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL: "",
    },
  },
});
