import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } }, { waitUntil() {}, passThroughOnException() {} });
}

test("server-renders the NyaVista demo shell truthfully", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<title>NyaVista — Every story\. A clearer view\.<\/title>/i);
  assert.match(html, /<html lang="en-US">/i);
  assert.match(html, /name="robots" content="noindex, nofollow"/i);
  assert.match(html, /name="publisher" content="E-DEAL EXPRESS LLC"/i);
  assert.match(html, /property="og:locale" content="en_US"/i);
  assert.match(html, /name="theme-color" content="#031b2d" media="\(prefers-color-scheme: dark\)"/i);
  assert.match(html, /Demo experience/i);
  assert.match(html, /no live reporting/i);
  assert.match(html, /Understand the news in minutes, not hours/i);
  assert.match(html, /Marketing navigation/);
  assert.match(html, /Fictional planning content/);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("centralizes product identity and preserves living delivery records", async () => {
  const [product, tracker, handoff, page, css] = await Promise.all([
    readFile(new URL("../lib/product.ts", import.meta.url), "utf8"),
    readFile(new URL("../PRODUCT_TRACKER.md", import.meta.url), "utf8"),
    readFile(new URL("../CLAUDE_HANDOFF.md", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(product, /E-DEAL EXPRESS LLC/);
  assert.match(product, /United States/);
  assert.match(tracker, /### Sprint register/);
  assert.match(tracker, /### Feature progress register/);
  assert.match(tracker, /F-016/);
  assert.match(handoff, /Cross-Agent Implementation Handoff/);
  assert.match(page, /virtual:product-tracker/);
  assert.match(page, /tracker\.sprints\.map/);
  assert.match(page, /trackerCheckpoints\.map/);
  assert.match(page, /data-theme=/);
  assert.match(css, /prefers-reduced-motion/);
  assert.match(css, /:focus-visible/);
});

test("keeps the complete visual baseline matrix", async () => {
  const files = await readdir(new URL("./visual-baselines/", import.meta.url));
  const pngs = files.filter((file) => file.endsWith(".png"));
  assert.equal(pngs.length, 32);
  for (const surface of ["marketing", "briefing", "tracker", "editorial"]) {
    for (const theme of ["light", "dark"]) {
      for (const viewport of ["mobile", "tablet", "desktop", "large-desktop"]) {
        assert.ok(pngs.includes(`${surface}-${theme}-${viewport}.png`));
      }
    }
  }
});
