import { expect, test } from "@playwright/test";

const surfaces = [
  { id: "marketing", marker: "Understand the news in minutes, not hours." },
  { id: "briefing", marker: "A clearer view of what matters." },
  { id: "story", marker: "Context before conclusions" },
  { id: "search", marker: "Find context, not just keywords." },
  { id: "media", marker: "Context designed for a smaller screen." },
  { id: "account", marker: "Your news, with privacy-aware controls." },
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
        if ((surface.id === "tracker" || surface.id === "editorial") && await mobileNavigation.isVisible()) await mobileNavigation.click();
        if (surface.id === "story") await page.getByRole("button", { name: /Open story:/ }).first().click();
        if (surface.id === "search") {
          const mobileSearch = page.getByRole("navigation", { name: "Mobile demo navigation" }).getByRole("button", { name: "Search" });
          if (await mobileSearch.isVisible()) await mobileSearch.click(); else await page.getByRole("button", { name: "Search", exact: true }).click();
        }
        if (surface.id === "media") {
          const mobileMedia = page.getByRole("navigation", { name: "Mobile demo navigation" }).getByRole("button", { name: "Media" });
          if (await mobileMedia.isVisible()) await mobileMedia.click(); else {
            if (await mobileNavigation.isVisible()) await mobileNavigation.click();
            await page.getByRole("button", { name: /Media briefings/ }).click();
          }
        }
        if (surface.id === "account") await page.getByRole("button", { name: "Open account access" }).click();
        if (surface.id === "tracker") await page.getByRole("button", { name: /Project tracker/ }).click();
        if (surface.id === "editorial") await page.getByRole("button", { name: /Editorial overview/ }).click();
        if (surface.id !== "marketing") {
          const homeItem = page.getByRole("button", { name: "NyaVista home" });
          await expect(homeItem.locator("svg")).toHaveCount(1);
          await expect(homeItem).not.toContainText("âŒ‚");
        }
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

for (const viewport of viewports) {
  test(`account configuration boundary · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Explore NyaVista/ }).click();
    await page.getByRole("button", { name: "Open account access" }).click();
    await expect(page.getByRole("status")).toContainText("Authentication setup required");
    await expect(page.getByRole("button", { name: "Sign in securely" })).toBeDisabled();
    await page.getByRole("button", { name: "Create account" }).click();
    await expect(page.getByRole("button", { name: "Create and verify account" })).toBeDisabled();
    await page.getByRole("button", { name: "Reset password" }).click();
    await expect(page.getByRole("button", { name: "Request reset" })).toBeDisabled();
    await expect(page.getByText("Client login is not authorization")).toBeVisible();
  });
}

for (const viewport of viewports) {
  test(`search and media interactions · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Explore NyaVista/ }).click();
    const mobileDock = page.getByRole("navigation", { name: "Mobile demo navigation" });
    if (await mobileDock.isVisible()) await mobileDock.getByRole("button", { name: "Search" }).click();
    else await page.getByRole("button", { name: "Search", exact: true }).click();
    const search = page.getByRole("textbox", { name: "Search demo stories" });
    await search.fill("language");
    await expect(page.getByText("1 fictional story")).toBeVisible();
    await search.fill("no matching fictional topic");
    await expect(page.getByRole("status")).toContainText("No fictional stories match");
    await page.getByRole("button", { name: "Clear search and filters" }).click();
    await expect(page.getByText("4 fictional stories")).toBeVisible();
    if (await mobileDock.isVisible()) await mobileDock.getByRole("button", { name: "Media" }).click();
    else {
      const menu = page.getByRole("button", { name: "Open navigation" });
      if (await menu.isVisible()) await menu.click();
      await page.getByRole("button", { name: /Media briefings/ }).click();
    }
    const play = page.getByRole("button", { name: "Play simulated preview" });
    await play.click();
    await expect(page.getByRole("button", { name: "Pause simulated preview" })).toBeVisible();
    await page.getByRole("button", { name: "Mute simulated preview" }).click();
    await expect(page.getByRole("button", { name: "Unmute simulated preview" })).toBeVisible();
    await page.getByRole("button", { name: "CC", exact: true }).click();
    await expect(page.getByText("Accessible text alternative")).toBeVisible();
    await page.getByRole("button", { name: /Open related story/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: /How cities are preparing/ })).toBeVisible();
  });
}

for (const viewport of viewports) {
  test(`feed and story interactions · ${viewport.id}`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /Explore NyaVista/ }).click();
    await page.getByRole("button", { name: "Togo" }).click();
    await expect(page.getByRole("heading", { name: /Small-language AI tools/ })).toBeVisible();
    await expect(page.locator(".feed-stream").getByText("How cities are preparing public services", { exact: false })).toHaveCount(0);
    await page.getByRole("button", { name: /Open story:/ }).click();
    await expect(page.getByRole("heading", { level: 1, name: /Small-language AI tools/ })).toBeVisible();
    await expect(page.getByText("fictional source records")).toBeVisible();
    await expect(page.getByText("What is not established")).toBeVisible();
    await page.getByRole("button", { name: /Back to demo feed/ }).click();
    await expect(page.getByRole("heading", { name: /Small-language AI tools/ })).toBeVisible();
  });
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
    await expect(page.getByRole("heading", { name: /A clearer view of what matters/ })).toBeVisible();
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
    const homeItem = sidebar.getByRole("button", { name: "NyaVista home" });
    await expect(homeItem.locator("svg")).toHaveCount(1);
    await expect(homeItem).not.toContainText("âŒ‚");
    await page.locator(".sidebar-backdrop").click({ position: { x: viewport.width - 20, y: 20 } });
    await expect(menu).toHaveAttribute("aria-expanded", "false");
    await expect(sidebar).not.toBeInViewport();
  });
}
