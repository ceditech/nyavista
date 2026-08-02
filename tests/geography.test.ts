import assert from "node:assert/strict";
import test from "node:test";
import { product } from "../lib/product.ts";
import { parseFeedRequest, selectFeedCandidates, type FeedCandidate } from "../lib/geography.ts";

const candidates: FeedCandidate[] = [
  { id: "togo-public-policy", countryCodes: ["TG"], regionIds: ["west-africa"], subjectIds: ["public-policy"] },
  { id: "canada-economy", countryCodes: ["CA"], regionIds: ["northern-america"], subjectIds: ["economy"] },
  { id: "japan-technology", countryCodes: ["JP"], regionIds: ["eastern-asia"], subjectIds: ["technology"] },
  { id: "global-climate", countryCodes: [], regionIds: [], subjectIds: ["climate"] },
];

test("normalizes and validates bounded global, country, and region requests", () => {
  assert.deepEqual(parseFeedRequest({ scope: { kind: "global" } }), { scope: { kind: "global" }, pageSize: 20 });
  assert.equal(parseFeedRequest({ scope: { kind: "country", countryCode: " tg " }, pageSize: 5 }).scope.kind, "country");
  assert.deepEqual(
    selectFeedCandidates(candidates, { scope: { kind: "region", regionId: "west-africa", countryCodes: ["TG", "GH"] } }),
    [candidates[0]],
  );
  assert.throws(() => parseFeedRequest({ scope: { kind: "country", countryCode: "TGO" } }));
  assert.throws(() => parseFeedRequest({ scope: { kind: "region", regionId: "West Africa", countryCodes: ["TG"] } }));
  assert.throws(() => parseFeedRequest({ scope: { kind: "region", regionId: "west-africa", countryCodes: ["TG", "TG"] } }));
  assert.throws(() => parseFeedRequest({ scope: { kind: "global" }, pageSize: 51 }));
});

test("keeps subject taxonomy separate and preserves deterministic source order", () => {
  const selected = selectFeedCandidates(candidates, { scope: { kind: "global" }, pageSize: 2 });
  assert.deepEqual(selected.map(({ id }) => id), ["togo-public-policy", "canada-economy"]);
  assert.deepEqual(selected[0].subjectIds, ["public-policy"]);
});

test("does not use commercial-market priority to admit, boost, or suppress countries", () => {
  assert.equal(product.editorialPolicy.marketPriorityAffectsEditorialImportance, false);
  const globalIds = selectFeedCandidates(candidates, { scope: { kind: "global" }, pageSize: 10 }).map(({ id }) => id);
  assert.deepEqual(globalIds, candidates.map(({ id }) => id));
  assert.deepEqual(
    selectFeedCandidates(candidates, { scope: { kind: "country", countryCode: "TG" } }).map(({ id }) => id),
    ["togo-public-policy"],
  );
  assert.deepEqual(
    selectFeedCandidates(candidates, { scope: { kind: "country", countryCode: "CA" } }).map(({ id }) => id),
    ["canada-economy"],
  );
});

test("rejects malformed candidates at the domain boundary", () => {
  assert.throws(() => selectFeedCandidates([
    { id: "bad", countryCodes: ["USA"], regionIds: [], subjectIds: [] } as unknown as FeedCandidate,
  ], { scope: { kind: "global" } }));
});
