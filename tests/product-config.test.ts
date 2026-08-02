import assert from "node:assert/strict";
import test from "node:test";
import { formatCurrency, formatDateTime, formatNumber, isSupportedLocale, product, resolveLocale, supportedLocales } from "../lib/product.ts";

test("keeps ownership, commercial markets, and editorial importance separate", () => {
  assert.equal(product.owner, "E-DEAL EXPRESS LLC");
  assert.equal(product.foundingCountry, "United States");
  assert.equal(product.editorialScope, "Global, nonpartisan, and country-neutral");
  assert.equal(product.editorialPolicy.marketPriorityAffectsEditorialImportance, false);
  assert.deepEqual(product.commercialMarkets.map((market) => market.countryCode), ["US", "CA", "GB", "NZ", "AU"]);
  assert.deepEqual(product.commercialMarkets.map((market) => market.locale), [...supportedLocales]);
});

test("resolves only supported locale variants with a deterministic fallback", () => {
  assert.equal(isSupportedLocale("en-GB"), true);
  assert.equal(isSupportedLocale("en_US"), true);
  assert.equal(isSupportedLocale("fr-FR"), false);
  assert.equal(resolveLocale("EN_ca"), "en-CA");
  assert.equal(resolveLocale("fr-FR"), "en-US");
  assert.equal(resolveLocale(null), "en-US");
});

test("formats UTC timestamps and locale-aware numbers and currency", () => {
  const instant = "2026-08-01T17:30:00.000Z";
  assert.match(formatDateTime(instant, { locale: "en-US" }), /Aug 1, 2026/);
  assert.match(formatDateTime(instant, { locale: "en-GB" }), /1 Aug 2026/);
  assert.equal(formatNumber(1234.5, { locale: "en-US", minimumFractionDigits: 1 }), "1,234.5");
  assert.match(formatCurrency(25, "usd", { locale: "en-US" }), /^\$25\.00$/);
  assert.throws(() => formatDateTime("not-a-date"), RangeError);
  assert.throws(() => formatNumber(Number.NaN), RangeError);
  assert.throws(() => formatCurrency(10, "US"), RangeError);
});
