/**
 * F-034 Slice 1b — Firestore-backed repository implementations.
 *
 * Concrete implementations of the F-034 repository interfaces over the modular
 * `firebase/firestore` SDK, enforced by the deployed owner-only Firestore rules
 * (F-030). A `Firestore` instance is injected so the caller (the client app, or
 * the service-account integration suite) supplies the auth context — these do
 * real I/O and are verified by the integration suite (`pnpm test:integration`),
 * not by unit tests. Reads/writes are Zod-validated at the boundary; `uid` and
 * `id` come from the document path, not stored fields.
 *
 * Document layout mirrors `firestore.rules`:
 *   users/{uid}                          -> profile
 *   userData/{uid}/preferences/current   -> preferences (singleton)
 *   userData/{uid}/bookmarks/{id}        -> bookmarks
 *   userData/{uid}/follows/{id}          -> follows
 *   userData/{uid}/history/{id}          -> history
 */

import { collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, setDoc, type Firestore } from "firebase/firestore";
import {
  bookmarkSchema,
  followSchema,
  historyEntrySchema,
  userPreferencesSchema,
  userProfileSchema,
} from "./domain.ts";
import {
  type BookmarkRepository,
  type FollowRepository,
  type HistoryRepository,
  type PreferencesRepository,
  type UserProfileRepository,
} from "./repositories.ts";

const PREFERENCES_DOC = "current";

export function createFirestoreUserProfileRepository(db: Firestore): UserProfileRepository {
  return {
    async get(uid) {
      const snap = await getDoc(doc(db, "users", uid));
      return snap.exists() ? userProfileSchema.parse({ uid, ...snap.data() }) : null;
    },
    async save(value) {
      const p = userProfileSchema.parse(value);
      await setDoc(doc(db, "users", p.uid), {
        displayName: p.displayName,
        email: p.email,
        locale: p.locale,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      });
      return p;
    },
  };
}

export function createFirestorePreferencesRepository(db: Firestore): PreferencesRepository {
  return {
    async get(uid) {
      const snap = await getDoc(doc(db, "userData", uid, "preferences", PREFERENCES_DOC));
      return snap.exists() ? userPreferencesSchema.parse({ uid, ...snap.data() }) : null;
    },
    async save(value) {
      const p = userPreferencesSchema.parse(value);
      await setDoc(doc(db, "userData", p.uid, "preferences", PREFERENCES_DOC), {
        countries: p.countries,
        regions: p.regions,
        categories: p.categories,
        topics: p.topics,
        sources: p.sources,
        language: p.language,
        depth: p.depth,
        formats: p.formats,
        updatedAt: p.updatedAt,
      });
      return p;
    },
  };
}

export function createFirestoreBookmarkRepository(db: Firestore): BookmarkRepository {
  return {
    async list(uid) {
      const snap = await getDocs(query(collection(db, "userData", uid, "bookmarks"), orderBy("createdAt", "desc")));
      return snap.docs.map((d) => bookmarkSchema.parse({ id: d.id, uid, ...d.data() }));
    },
    async get(uid, id) {
      const snap = await getDoc(doc(db, "userData", uid, "bookmarks", id));
      return snap.exists() ? bookmarkSchema.parse({ id: snap.id, uid, ...snap.data() }) : null;
    },
    async add(record) {
      const p = bookmarkSchema.parse(record);
      await setDoc(doc(db, "userData", p.uid, "bookmarks", p.id), { storySlug: p.storySlug, createdAt: p.createdAt });
      return p;
    },
    async remove(uid, id) {
      await deleteDoc(doc(db, "userData", uid, "bookmarks", id));
    },
  };
}

export function createFirestoreFollowRepository(db: Firestore): FollowRepository {
  return {
    async list(uid) {
      const snap = await getDocs(query(collection(db, "userData", uid, "follows"), orderBy("createdAt", "desc")));
      return snap.docs.map((d) => followSchema.parse({ id: d.id, uid, ...d.data() }));
    },
    async get(uid, id) {
      const snap = await getDoc(doc(db, "userData", uid, "follows", id));
      return snap.exists() ? followSchema.parse({ id: snap.id, uid, ...snap.data() }) : null;
    },
    async add(record) {
      const p = followSchema.parse(record);
      await setDoc(doc(db, "userData", p.uid, "follows", p.id), { target: p.target, createdAt: p.createdAt });
      return p;
    },
    async remove(uid, id) {
      await deleteDoc(doc(db, "userData", uid, "follows", id));
    },
  };
}

export function createFirestoreHistoryRepository(db: Firestore): HistoryRepository {
  return {
    async list(uid) {
      const snap = await getDocs(query(collection(db, "userData", uid, "history"), orderBy("viewedAt", "desc")));
      return snap.docs.map((d) => historyEntrySchema.parse({ id: d.id, uid, ...d.data() }));
    },
    async get(uid, id) {
      const snap = await getDoc(doc(db, "userData", uid, "history", id));
      return snap.exists() ? historyEntrySchema.parse({ id: snap.id, uid, ...snap.data() }) : null;
    },
    async add(record) {
      const p = historyEntrySchema.parse(record);
      await setDoc(doc(db, "userData", p.uid, "history", p.id), { storySlug: p.storySlug, viewedAt: p.viewedAt });
      return p;
    },
    async remove(uid, id) {
      await deleteDoc(doc(db, "userData", uid, "history", id));
    },
  };
}
