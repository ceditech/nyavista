import { z } from "zod";

const normalizedString = (value: unknown) => typeof value === "string" ? value.trim() : value;

export const countryCodeSchema = z.preprocess(
  (value) => typeof value === "string" ? value.trim().toUpperCase() : value,
  z.string().regex(/^[A-Z]{2}$/, "Country code must be an ISO 3166-1 alpha-2 identifier"),
);

export const regionIdSchema = z.preprocess(
  normalizedString,
  z.string().min(1).max(64).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Region ID must be a lowercase slug"),
);

const globalFeedScopeSchema = z.object({ kind: z.literal("global") }).strict();
const countryFeedScopeSchema = z.object({ kind: z.literal("country"), countryCode: countryCodeSchema }).strict();
const regionFeedScopeSchema = z.object({
  kind: z.literal("region"),
  regionId: regionIdSchema,
  countryCodes: z.array(countryCodeSchema).min(1).max(250),
}).strict().superRefine(({ countryCodes }, context) => {
  if (new Set(countryCodes).size !== countryCodes.length) {
    context.addIssue({ code: "custom", message: "Region country codes must be unique", path: ["countryCodes"] });
  }
});

export const feedScopeSchema = z.discriminatedUnion("kind", [
  globalFeedScopeSchema,
  countryFeedScopeSchema,
  regionFeedScopeSchema,
]);

export const feedRequestSchema = z.object({
  scope: feedScopeSchema,
  pageSize: z.number().int().min(1).max(50).default(20),
  cursor: z.string().trim().min(1).max(256).optional(),
}).strict();

export const feedCandidateSchema = z.object({
  id: z.string().trim().min(1).max(128),
  countryCodes: z.array(countryCodeSchema).max(250),
  regionIds: z.array(regionIdSchema).max(32),
  subjectIds: z.array(z.string().trim().min(1).max(64)).max(32),
}).strict();

export type FeedScope = z.infer<typeof feedScopeSchema>;
export type FeedRequest = z.infer<typeof feedRequestSchema>;
export type FeedCandidate = z.infer<typeof feedCandidateSchema>;

export function parseFeedRequest(value: unknown): FeedRequest {
  return feedRequestSchema.parse(value);
}

export function candidateMatchesScope(candidate: FeedCandidate, scope: FeedScope): boolean {
  if (scope.kind === "global") return true;
  if (scope.kind === "country") return candidate.countryCodes.includes(scope.countryCode);
  return candidate.regionIds.includes(scope.regionId)
    || candidate.countryCodes.some((countryCode) => scope.countryCodes.includes(countryCode));
}

export function selectFeedCandidates<T extends FeedCandidate>(candidates: readonly T[], requestValue: unknown): T[] {
  const request = parseFeedRequest(requestValue);
  return candidates
    .map((candidate) => {
      feedCandidateSchema.parse({
        id: candidate.id,
        countryCodes: candidate.countryCodes,
        regionIds: candidate.regionIds,
        subjectIds: candidate.subjectIds,
      });
      return candidate;
    })
    .filter((candidate) => candidateMatchesScope(candidate, request.scope))
    .slice(0, request.pageSize);
}
