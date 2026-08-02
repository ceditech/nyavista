import { expect, test } from "@playwright/test";

const surfaces = [
  { id: "marketing", marker: "Understand the news in minutes, not hours." },
  { id: "briefing", marker: "Every story." },
  { id: "tracker", marker: "Every sprint, phase, and feature" },
  { id: "editorial", marker: "Editorial clarity at every gate." },
] as const;

const themes = ["light", "dark"] as const;

const viewports = [
  { id: "mobile", width: 390, height: 844 },
  { id: "tablet", width: 768, height: 1024 },
  { id: "desktop", width: 1440, height: 1000 },
  { id: "large-desktop", width: 1920, height: 1080 },
] as const;

for (const surface of surfaces) {
  for (const theme of themes) {
    for (const viewport of viewports) {
      test(`${surface.id} · ${theme} · ${viewport.id}`, async ({ page }) => {
        const consoleErrors: string[] = [];
        const failedResponses: string[] = [];
        page.on("console", (message) => {
          if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) consoleErrors.push(message.text());
        });
        page.on("response", (response) => {
          if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`);
        });

        await page.setViewportSize({ width: viewport.width, height: viewport.height });
        await page.emulateMedia({ reducedMotion: "reduce" });
        await page.goto("/", { waitUntil: "networkidle" });
        if (surface.id !== "marketing") await page.getByRole("button", { name: /Explore NyaVista/ }).click();
        const mobileNavigation = page.getByRole("button", { name: "Open navigation" });
        if (surface.id !== "briefing" && await mobileNavigation.isVisible()) await mobileNavigation.click();
        if (surface.id === "tracker") await page.getByRole("button", { name: /Project tracker/ }).click();
        if (surface.id === "editorial") await page.getByRole("button", { name: /Editorial overview/ }).click();
        if (theme === "dark") await page.getByRole("button", { name: "Switch to dark theme" }).click();
        await expect(page.locator(".app")).toHaveAttribute("data-theme", theme);
        await expect(page.locator("main")).toContainText(surface.marker);
        await expect(page.locator("[data-nextjs-dialog], .vite-error-overlay, #webpack-dev-server-client-overlay")).toHaveCount(0);

        const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
        expect(horizontalOverflow, "page must not overflow the viewport horizontally").toBe(false);
        expect(consoleErrors, "browser console must not contain errors").toEqual([]);
        expect(failedResponses, "page resources must load successfully").toEqual([]);

        await expect(page).toHaveScreenshot(`${surface.id}-${theme}-${viewport.id}.png`);
      });
    }
  }
}

for (const theme of themes) {
  for (const viewport of viewports) {
    test(`trust route · ${theme} · ${viewport.id}`, async ({ page }) => {
      const consoleErrors: string[] = [];
      const failedResponses: string[] = [];
      page.on("console", (message) => { if (message.type() === "error" && !message.text().startsWith("Failed to load resource:")) consoleErrors.push(message.text()); });
      page.on("response", (response) => { if (response.status() >= 400) failedResponses.push(`${response.status()} ${response.url()}`); });
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.emulateMedia({ reducedMotion: "reduce" });
      await page.goto("/privacy", { waitUntil: "networkidle" });
      if (theme === "dark") await page.getByRole("button", { name: "Switch to dark theme" }).click();
      await expect(page.locator(".app")).toHaveAttribute("data-theme", theme);
      await expect(page.getByRole("heading", { level: 1, name: /Privacy notice/ })).toBeVisible();
      await expect(page.getByRole("note")).toContainText("Review required");
      const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
      expect(horizontalOverflow, "trust page must not overflow horizontally").toBe(false);
      expect(consoleErrors).toEqual([]);
      expect(failedResponses).toEqual([]);
      await expect(page).toHaveScreenshot(`trust-${theme}-${viewport.id}.png`);
    });
  }
}

for (const viewport of viewports) {
  test(`marketing interactions · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { level: 1, name: "Understand the news in minutes, not hours." })).toBeVisible();
    await expect(page.locator("nav[aria-label='Marketing navigation']")).toHaveCount(1);
    await expect(page.getByText("Fictional planning content.")).toBeVisible();
    await page.getByRole("button", { name: "Switch to dark theme" }).click();
    await expect(page.locator(".app")).toHaveAttribute("data-theme", "dark");
    await page.getByRole("button", { name: /Explore NyaVista/ }).click();
    await expect(page.getByRole("heading", { name: /Every story/ })).toBeVisible();
  });
}

for (const viewport of viewports) {
  test(`marketing route navigation · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/privacy", { waitUntil: "networkidle" });
    await expect(page.getByRole("heading", { name: /Privacy notice/ })).toBeVisible();
    await page.getByRole("link", { name: "NyaVista home" }).click();
    await expect(page.getByRole("heading", { name: "Understand the news in minutes, not hours." })).toBeVisible();
  });
}

for (const viewport of viewports.filter(({ id }) => id === "mobile" || id === "tablet")) {
  test(`sidebar drawer · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Explore NyaVista/ }).click();
    const menu = page.getByRole("button", { name: "Open navigation" });
    const sidebar = page.getByRole("complementary", { name: "Primary navigation" });
    await expect(menu).toBeVisible();
    await expect(menu).toContainText("Menu");
    await menu.click();
    await expect(menu).toHaveAttribute("aria-expanded", "true");
    await expect(sidebar).toBeInViewport();
    await page.locator(".sidebar-backdrop").click({ position: { x: viewport.width - 20, y: 20 } });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(sidebar).not.toBeInViewport();
  });
}
