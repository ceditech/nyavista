import assert from "node:assert/strict";
import test from "node:test";
import { userProfileSchema, userPreferencesSchema, type Bookmark } from "../lib/domain.ts";
import {
  createInMemoryUserProfileRepository,
  createInMemoryPreferencesRepository,
  createInMemoryBookmarkRepository,
} from "../lib/repositories.ts";

const now = "2026-08-03T12:00:00Z";

function bookmark(uid: string, id: string): Bookmark {
  return { id, uid, storySlug: "togo-public-policy", createdAt: now };
}

test("domain schemas validate at the boundary", () => {
  assert.doesNotThrow(() =>
    userProfileSchema.parse({ uid: "u1", displayName: "A", email: null, locale: "en-US", createdAt: now, updatedAt: now }),
  );
  // Unknown key rejected (strict), bad timestamp rejected, empty uid rejected.
  assert.throws(() => userProfileSchema.parse({ uid: "u1", displayName: "A", email: null, locale: "en-US", createdAt: now, updatedAt: now, role: "admin" }));
  assert.throws(() => userProfileSchema.parse({ uid: "u1", displayName: "A", email: null, locale: "en-US", createdAt: "2026/08/03", updatedAt: now }));
  assert.throws(() => userProfileSchema.parse({ uid: "", displayName: "A", email: null, locale: "en-US", createdAt: now, updatedAt: now }));
  // Preferences: enum + alpha-2 country validation.
  assert.doesNotThrow(() =>
    userPreferencesSchema.parse({ uid: "u1", countries: ["US", "TG"], regions: [], categories: [], topics: [], sources: [], language: "en-US", depth: "standard", formats: ["text", "audio"] , updatedAt: now }),
  );
  assert.throws(() => userPreferencesSchema.parse({ uid: "u1", countries: ["USA"], regions: [], categories: [], topics: [], sources: [], language: "en-US", depth: "standard", formats: [], updatedAt: now }));
  assert.throws(() => userPreferencesSchema.parse({ uid: "u1", countries: [], regions: [], categories: [], topics: [], sources: [], language: "en-US", depth: "supersede", formats: [], updatedAt: now }));
});

test("singleton repository stores per-uid and validates writes", async () => {
  const repo = createInMemoryUserProfileRepository();
  assert.equal(await repo.get("u1"), null);
  const saved = await repo.save({ uid: "u1", displayName: "A", email: "a@x.test", locale: "en-US", createdAt: now, updatedAt: now });
  assert.equal(saved.uid, "u1");
  assert.deepEqual(await repo.get("u1"), saved);
  assert.equal(await repo.get("u2"), null);
  await assert.rejects(async () => repo.save({ uid: "u1", displayName: "" } as never));
});

test("owned-collection repository is owner-scoped", async () => {
  const repo = createInMemoryBookmarkRepository();
  await repo.add(bookmark("user-1", "b1"));
  await repo.add(bookmark("user-1", "b2"));
  await repo.add(bookmark("user-2", "b1"));

  const forUser1 = await repo.list("user-1");
  assert.deepEqual(forUser1.map((b) => b.id).sort(), ["b1", "b2"]);
  // user-2's identically-named bookmark is isolated.
  assert.deepEqual((await repo.list("user-2")).map((b) => b.id), ["b1"]);
  assert.equal((await repo.get("user-1", "b1"))?.uid, "user-1");
  assert.equal(await repo.get("user-1", "nope"), null);
});

test("owned-collection remove only affects the owner's record", async () => {
  const repo = createInMemoryBookmarkRepository();
  await repo.add(bookmark("user-1", "b1"));
  await repo.add(bookmark("user-2", "b1"));
  await repo.remove("user-1", "b1");
  assert.equal(await repo.get("user-1", "b1"), null);
  assert.equal((await repo.get("user-2", "b1"))?.uid, "user-2"); // untouched
});

test("owned-collection add validates the record", async () => {
  const repo = createInMemoryBookmarkRepository();
  await assert.rejects(async () => repo.add({ id: "b1", uid: "user-1" } as never));
});

test("preferences repository round-trips a full preference set", async () => {
  const repo = createInMemoryPreferencesRepository();
  const prefs = { uid: "u1", countries: ["US"], regions: ["west-africa"], categories: ["economy"], topics: ["trade"], sources: ["demo-source"], language: "en-US", depth: "deep" as const, formats: ["video" as const], updatedAt: now };
  assert.deepEqual(await repo.save(prefs), prefs);
  assert.deepEqual(await repo.get("u1"), prefs);
});
