import assert from "node:assert/strict";
import test from "node:test";
import { selectFeedCandidates } from "../lib/geography.ts";
import { demoStories, demoStorySchema, getDemoStory } from "../lib/stories.ts";

test("validates every fictional story and keeps disclosure data internally consistent", () => {
  assert.equal(demoStories.length, 4);
  for (const story of demoStories) {
    assert.deepEqual(demoStorySchema.parse(story), story);
    assert.equal(story.sources.length, story.sourceCount);
    assert.match(story.uncertainty, /fictional|demo|claimed|illustrative|verification/i);
    assert.equal(getDemoStory(story.slug)?.id, story.id);
  }
});

test("uses the F-020 geography contract for priority and non-priority country feeds", () => {
  const togo = selectFeedCandidates(demoStories, { scope: { kind: "country", countryCode: "TG" } });
  const canada = selectFeedCandidates(demoStories, { scope: { kind: "country", countryCode: "CA" } });
  assert.deepEqual(togo.map(({ id }) => id), ["language-ai"]);
  assert.deepEqual(canada.map(({ id }) => id), ["heat-services"]);
});

test("rejects a story whose displayed source count does not match its register", () => {
  assert.throws(() => demoStorySchema.parse({ ...demoStories[0], sourceCount: 99 }));
});
