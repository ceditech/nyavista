/**
 * F-024 Slice 1a — personalization operations (pure) + per-user repository access.
 *
 * Encodes the F-024 domain rules on top of the F-034 repositories: bookmarks,
 * follows, and history are keyed by their target, so re-adding the same target
 * updates the record rather than creating a duplicate (idempotent). These
 * factories are pure and validated by the domain schemas.
 *
 * `createUserPersonalization` binds a signed-in user's Firestore instance to the
 * full set of F-034 repositories — the single access point the personalization
 * UI (later F-024 slices) consumes, so components never re-wire persistence or
 * hand-roll ids/timestamps. Access is owner-scoped by `uid` and enforced by the
 * deployed Firestore rules (F-030).
 */

import { type Firestore } from "firebase/firestore";
import { type Bookmark, type Follow, type HistoryEntry } from "./domain.ts";
import {
  createFirestoreBookmarkRepository,
  createFirestoreFollowRepository,
  createFirestoreHistoryRepository,
  createFirestorePreferencesRepository,
  createFirestoreUserProfileRepository,
} from "./firestore-repositories.ts";
import {
  type BookmarkRepository,
  type FollowRepository,
  type HistoryRepository,
  type PreferencesRepository,
  type UserProfileRepository,
} from "./repositories.ts";

export type FollowKind = Follow["target"]["kind"];

export const bookmarkId = (storySlug: string): string => storySlug;
export const followId = (kind: FollowKind, targetId: string): string => `${kind}:${targetId}`;
export const historyId = (storySlug: string): string => storySlug;

export function makeBookmark(uid: string, storySlug: string, createdAt: string): Bookmark {
  return { id: bookmarkId(storySlug), uid, storySlug, createdAt };
}

export function makeFollow(uid: string, kind: FollowKind, targetId: string, createdAt: string): Follow {
  return { id: followId(kind, targetId), uid, target: { kind, id: targetId }, createdAt };
}

export function makeHistoryEntry(uid: string, storySlug: string, viewedAt: string): HistoryEntry {
  return { id: historyId(storySlug), uid, storySlug, viewedAt };
}

export interface UserPersonalization {
  uid: string;
  profile: UserProfileRepository;
  preferences: PreferencesRepository;
  bookmarks: BookmarkRepository;
  follows: FollowRepository;
  history: HistoryRepository;
}

/** Bind a signed-in user's Firestore instance to the full F-034 repository set. */
export function createUserPersonalization(db: Firestore, uid: string): UserPersonalization {
  return {
    uid,
    profile: createFirestoreUserProfileRepository(db),
    preferences: createFirestorePreferencesRepository(db),
    bookmarks: createFirestoreBookmarkRepository(db),
    follows: createFirestoreFollowRepository(db),
    history: createFirestoreHistoryRepository(db),
  };
}
