import assert from "node:assert/strict";
import test from "node:test";
import { getMarketingPage, marketingPages, resolveProductionOrigin } from "../lib/marketing.ts";

test("registers every required marketing and trust route without duplicates", () => {
  const slugs = marketingPages.map(({ slug }) => slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const required of ["product", "features", "how-it-works", "global-coverage", "video-explainers", "audio-briefings", "professionals", "organizations", "pricing", "about", "newsletter", "contact", "faq", "editorial-standards", "source-methodology", "recommendation-methodology", "ai-disclosure", "corrections", "copyright-dmca", "privacy", "terms", "cookies", "community-guidelines", "accessibility"]) assert.ok(getMarketingPage(required), `${required} must be registered`);
});

test("marks policy shells for review and keeps commercial placeholders truthful", () => {
  for (const slug of ["editorial-standards", "privacy", "terms", "cookies", "copyright-dmca", "accessibility"]) assert.equal(getMarketingPage(slug)?.legalReview, true);
  assert.match(getMarketingPage("pricing")?.description ?? "", /not published/i);
  assert.match(getMarketingPage("contact")?.description ?? "", /does not invent/i);
  assert.match(getMarketingPage("newsletter")?.sections[1]?.body ?? "", /do not collect/i);
});

test("accepts only clean HTTPS production origins", () => {
  assert.equal(resolveProductionOrigin("https://nyavista.example"), "https://nyavista.example");
  for (const invalid of [undefined, "http://nyavista.example", "https://user:pass@nyavista.example", "https://nyavista.example/path", "not-a-url"]) assert.equal(resolveProductionOrigin(invalid), null);
});
