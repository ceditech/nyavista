/**
 * F-034 Slice 1a — persisted domain model (schemas + types).
 *
 * Zod schemas and inferred types for the user-scoped entities that F-024
 * (preferences, follows, bookmarks, history) will persist. Pure and
 * side-effect-free: these validate at the trust boundary before anything is
 * written. Timestamps are ISO 8601 UTC (spec §10). The Firestore-backed
 * repositories, indexes, and storage boundaries are later F-034 slices; this
 * layer stays provider-agnostic.
 */

import { z } from "zod";

const uid = z.string().trim().min(1).max(128);
const slug = z.string().trim().min(1).max(200);
const alpha2 = z.string().length(2).regex(/^[A-Za-z]{2}$/);
const isoUtc = z
  .string()
  .refine((value) => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z$/.test(value), "ISO 8601 UTC timestamp required");

export const contentFormat = z.enum(["text", "audio", "video"]);
export const readingDepth = z.enum(["brief", "standard", "deep"]);
export const followTargetKind = z.enum(["country", "region", "category", "topic", "source"]);

export const userProfileSchema = z
  .object({
    uid,
    displayName: z.string().trim().min(1).max(120),
    email: z.string().trim().min(3).max(320).nullable(),
    locale: z.string().trim().min(2).max(35),
    createdAt: isoUtc,
    updatedAt: isoUtc,
  })
  .strict();
export type UserProfile = z.infer<typeof userProfileSchema>;

export const userPreferencesSchema = z
  .object({
    uid,
    countries: z.array(alpha2).max(100),
    regions: z.array(slug).max(100),
    categories: z.array(slug).max(100),
    topics: z.array(slug).max(200),
    sources: z.array(slug).max(200),
    language: z.string().trim().min(2).max(35),
    depth: readingDepth,
    formats: z.array(contentFormat).max(3),
    updatedAt: isoUtc,
  })
  .strict();
export type UserPreferences = z.infer<typeof userPreferencesSchema>;

export const bookmarkSchema = z
  .object({ id: slug, uid, storySlug: slug, createdAt: isoUtc })
  .strict();
export type Bookmark = z.infer<typeof bookmarkSchema>;

export const followSchema = z
  .object({
    id: slug,
    uid,
    target: z.object({ kind: followTargetKind, id: slug }).strict(),
    createdAt: isoUtc,
  })
  .strict();
export type Follow = z.infer<typeof followSchema>;

export const historyEntrySchema = z
  .object({ id: slug, uid, storySlug: slug, viewedAt: isoUtc })
  .strict();
export type HistoryEntry = z.infer<typeof historyEntrySchema>;
