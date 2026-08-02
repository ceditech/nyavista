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
    baseURL: "http://[::1]:3000",
    browserName: "chromium",
    colorScheme: "light",
    locale: "en-US",
    timezoneId: "America/Chicago",
    serviceWorkers: "block",
  },
  webServer: {
    command: "pnpm dev",
    url: "http://[::1]:3000",
    reuseExistingServer: true,
    timeout: 120_000,
  },
});
