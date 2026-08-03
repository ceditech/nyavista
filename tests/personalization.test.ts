import assert from "node:assert/strict";
import test from "node:test";
import { type Firestore } from "firebase/firestore";
import { bookmarkSchema, followSchema, historyEntrySchema } from "../lib/domain.ts";
import {
  bookmarkId,
  followId,
  historyId,
  makeBookmark,
  makeFollow,
  makeHistoryEntry,
  createUserPersonalization,
} from "../lib/personalization.ts";

const now = "2026-08-03T12:00:00Z";

test("ids are idempotent by target", () => {
  assert.equal(bookmarkId("story-a"), "story-a");
  assert.equal(followId("country", "TG"), "country:TG");
  assert.equal(historyId("story-a"), "story-a");
  // Re-adding the same target yields the same id (update, not duplicate).
  assert.equal(makeBookmark("u1", "story-a", now).id, makeBookmark("u1", "story-a", "2026-08-04T00:00:00Z").id);
  assert.equal(makeFollow("u1", "source", "reuters", now).id, makeFollow("u1", "source", "reuters", now).id);
});

test("factories produce schema-valid records with the target encoded", () => {
  assert.doesNotThrow(() => bookmarkSchema.parse(makeBookmark("u1", "togo-public-policy", now)));
  assert.doesNotThrow(() => historyEntrySchema.parse(makeHistoryEntry("u1", "story-a", now)));
  const follow = makeFollow("u1", "region", "west-africa", now);
  assert.doesNotThrow(() => followSchema.parse(follow));
  assert.deepEqual(follow.target, { kind: "region", id: "west-africa" });
});

test("createUserPersonalization exposes all repositories for a uid", () => {
  const personalization = createUserPersonalization({} as unknown as Firestore, "u1");
  assert.equal(personalization.uid, "u1");
  assert.equal(typeof personalization.profile.get, "function");
  assert.equal(typeof personalization.preferences.save, "function");
  assert.equal(typeof personalization.bookmarks.add, "function");
  assert.equal(typeof personalization.follows.list, "function");
  assert.equal(typeof personalization.history.remove, "function");
});
