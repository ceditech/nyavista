# News Ingestion Providers — Design Reference

> **Status: DESIGN REFERENCE — NOT IMPLEMENTED.**
> This document is the fixed design target for live news ingestion. **No code in this
> document is shipped.** It maps to **Phase 7** features **F-040** (rights-aware
> ingestion adapters), **F-041** (normalization/dedupe/geography), and **F-042**
> (jobs, retries, observability, cost), and it is **gated behind Phase 6** — it must not
> be built before **F-034** (Firebase repositories/indexes/storage) exists to persist
> records. Building any of this early advances a phase without approval, which
> [`AGENTS.md`](../../AGENTS.md) and [`PRODUCT_TRACKER.md`](../../PRODUCT_TRACKER.md)
> forbid.
>
> **Why this file exists:** to stop drift. When ingestion is approved, adapters must
> match this seam, these rights rules, and this streaming/aggregation/dead-letter model.
> Until then the app continues to use the fictional fixtures in
> [`lib/stories.ts`](../../lib/stories.ts), labeled **Demo content — not live reporting.**

## 1. Authority and constraints

This design is subordinate to, and must not contradict:

- [`CONSTRAINTS.md`](../../CONSTRAINTS.md) and [`AGENTS.md`](../../AGENTS.md) engineering/editorial rules.
- [`NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md`](../../NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md) §9 (provider seams), §10 (domain model), §11 (ingestion pipeline).
- The STABLE framework at the repository root (`STABLE_FRAMEWORK.md`).

Non-negotiable rules this design encodes:

- **No paywall bypass, no unauthorized full-text scraping, no unlicensed publisher media.** A provider may only surface what its license permits: metadata, a permitted excerpt, or licensed full text — never more.
- **Rights travel with every record.** Each normalized article carries a rights envelope; downstream display and storage obey it.
- **Mock stays visibly distinct from live.** Every provider declares `mode: "mock" | "live"`, and live records must be labeled in the UI.
- **Validate at the trust boundary.** Every external payload is Zod-parsed into the normalized shape before it enters the system; anything that fails goes to the dead-letter queue, never into a feed.
- **Provider-neutral.** No app section imports GDELT or Guardian directly. Everything consumes the `NewsIngestionProvider` seam.

## 2. Seam overview

```text
scheduled trigger (F-042)
  -> NewsIngestionProvider.poll(cursor)         // one provider, one watermark
  -> Zod validate + normalize -> RawArticle      // F-041, trust boundary
  -> enforce rights + content hash               // §11
  -> AggregatingIngestionSource (fan-in + dedupe) // multi-provider merge
  -> persist (F-034 repositories)                // Phase 6, required first
  -> cluster queue (F-050)                        // Phase 8
failures at any step -> retry w/ backoff -> DeadLetterSink (F-042)
```

The seam has exactly four contracts: the normalized record (`RawArticle`), the provider (`NewsIngestionProvider`), the aggregator (`AggregatingIngestionSource`), and the dead-letter sink (`DeadLetterSink`). GDELT and Guardian are two implementations of the provider contract.

## 3. Normalized domain contract

Every provider MUST emit this shape (a subset of spec §10). Providers never leak their native payloads into the app; the original is retained only in `raw` for audit.

```ts
// The single shape every app section consumes. Providers translate INTO this.
export interface RawArticle {
  providerId: string;          // "gdelt" | "guardian" | ...
  externalId: string;          // provider-native id — used for idempotency
  canonicalUrl: string;        // original publisher URL (link-out target)
  title: string;
  excerpt: string | null;      // permitted excerpt ONLY — never scraped full text
  body: string | null;         // populated ONLY when rights.policy === "full-text-licensed"
  language: string;            // BCP-47 (e.g., "en-GB"); ISO where only 2-letter is known
  geographies: string[];       // ISO 3166-1 alpha-2 country codes, may be empty
  publishedAt: string;         // ISO 8601, UTC
  fetchedAt: string;           // ISO 8601, UTC
  sourceName: string;          // human-readable publisher/source
  rights: ArticleRights;       // licensing envelope — obeyed by storage + UI
  contentHash: string;         // stable hash for dedupe/idempotency
  raw: unknown;                // original payload, audit only — never displayed
}

export interface ArticleRights {
  policy: "metadata-only" | "excerpt-permitted" | "full-text-licensed";
  attributionRequired: boolean;
  attributionText: string;     // e.g., "The Guardian" — rendered with every item
  licenseNote: string;         // short human note, e.g., "Guardian Open Platform"
}
```

The corresponding Zod schema (`rawArticleSchema`) is the trust-boundary validator. `body` MUST be `null` unless `rights.policy === "full-text-licensed"`; the schema enforces this with a refinement so a misconfigured adapter cannot smuggle unlicensed full text into the pipeline.

## 4. Provider contract

```ts
export interface IngestionCursor {
  since: string;      // ISO 8601 UTC watermark — last successfully ingested instant
  token?: string;     // provider-native continuation (e.g., GDELT lastupdate hash)
}

export interface IngestionBatch {
  provider: string;
  items: RawArticle[];
  nextCursor: IngestionCursor;   // persisted by the job runner for the next poll
  rejected: DeadLetterRecord[];  // items that failed validation/rights, for the DLQ
}

export interface ProviderDescriptor {
  id: string;
  displayName: string;
  mode: "mock" | "live";
  rightsDefault: ArticleRights["policy"];
  pollIntervalSeconds: number;   // provider-recommended cadence (rate-limit aware)
  configured: boolean;           // fail-closed: false when required config is absent
  missing: readonly string[];    // names of missing required env vars, if any
}

export interface NewsIngestionProvider {
  readonly id: string;
  readonly displayName: string;
  readonly mode: "mock" | "live";

  /** Fail-closed config/health snapshot. Never throws. */
  describe(): ProviderDescriptor;

  /**
   * Scheduled pull. Given the last cursor (or null for a cold start), return new
   * items plus the next cursor. MUST be idempotent w.r.t. externalId/contentHash,
   * honor `signal` for timeouts, and never throw for expected provider errors —
   * it returns an empty batch and lets the job runner apply retry/backoff.
   */
  poll(cursor: IngestionCursor | null, signal: AbortSignal): Promise<IngestionBatch>;
}
```

**Config follows the fail-closed pattern already used in [`lib/auth.ts`](../../lib/auth.ts):** validate required env vars up front; when absent, `describe()` reports `configured: false` and `poll()` returns an empty batch. Missing credentials never crash a job and never silently fabricate data.

## 5. GDELT adapter (global coverage, no key)

GDELT DOC 2.0 is keyless, global, and updates roughly every 15 minutes — ideal for demonstrating **global/country feeds, clustering, and geographic fairness**. It returns **metadata only** (URL, title, source country, language, domain), so its rights policy is `metadata-only`: NyaVista displays the card and links out, and stores no article body.

```ts
// Endpoint: https://api.gdeltproject.org/api/v2/doc/doc
//   ?query=<q>&mode=ArtList&format=json&timespan=<n>min&sort=DateDesc
// Keyless. Rate-limit friendly: poll no more often than ~pollIntervalSeconds.

const GDELT_RIGHTS: ArticleRights = {
  policy: "metadata-only",
  attributionRequired: true,
  attributionText: "Source publisher (via GDELT)",
  licenseNote: "GDELT 2.0 — metadata and link-out only",
};

export function createGdeltProvider(config: GdeltConfig): NewsIngestionProvider {
  const id = "gdelt";
  return {
    id,
    displayName: "GDELT 2.0",
    mode: "live",
    describe: () => ({
      id, displayName: "GDELT 2.0", mode: "live",
      rightsDefault: "metadata-only",
      pollIntervalSeconds: 900,           // ~15 min; respect GDELT cadence
      configured: true, missing: [],      // keyless: always configured
    }),
    async poll(cursor, signal) {
      const since = cursor?.since ?? isoMinutesAgo(15);
      const url = buildGdeltUrl(config.query, since);       // timespan derived from `since`
      const rejected: DeadLetterRecord[] = [];
      let items: RawArticle[] = [];
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) return emptyBatch(id, cursor);          // let runner retry/backoff
        const payload = gdeltResponseSchema.safeParse(await res.json());
        if (!payload.success) return emptyBatch(id, cursor); // whole-response corruption
        for (const a of payload.data.articles) {
          const normalized = normalizeGdelt(a, GDELT_RIGHTS); // -> RawArticle candidate
          const parsed = rawArticleSchema.safeParse(normalized);
          if (parsed.success) items.push(parsed.data);
          else rejected.push(toDeadLetter(id, a, parsed.error)); // -> DLQ, not the feed
        }
      } catch {
        return emptyBatch(id, cursor);                        // timeout/abort/network
      }
      items = dedupeByHash(items);
      return { provider: id, items, rejected, nextCursor: { since: nowIso() } };
    },
  };
}
```

Key points: GDELT emits `metadata-only`, so `normalizeGdelt` sets `body: null` and `excerpt: null`; per-article validation failures are diverted to the DLQ rather than dropping the whole batch; the cursor advances only on a successful poll.

## 6. Guardian adapter (licensed text, first-party)

The Guardian Open Platform requires a free key and, under its terms, permits displaying article text **with attribution** — so its rights policy is `full-text-licensed` (the one provider allowed to populate `body`). It is on-demand (not a firehose), so its "stream" is a scheduled search sorted newest-first, watermarked by `publishedAt`.

```ts
// Endpoint: https://content.guardianapis.com/search
//   ?api-key=<key>&order-by=newest&show-fields=trailText,bodyText,byline
//   &from-date=<ISO date>&page-size=<n>
// Requires GUARDIAN_API_KEY. Fail closed when absent.

const GUARDIAN_RIGHTS: ArticleRights = {
  policy: "full-text-licensed",
  attributionRequired: true,
  attributionText: "The Guardian",
  licenseNote: "Guardian Open Platform — attribution required",
};

export function createGuardianProvider(config: GuardianConfig): NewsIngestionProvider {
  const id = "guardian";
  const configured = Boolean(config.apiKey?.trim());
  const missing = configured ? [] : ["GUARDIAN_API_KEY"];
  return {
    id,
    displayName: "The Guardian",
    mode: "live",
    describe: () => ({
      id, displayName: "The Guardian", mode: "live",
      rightsDefault: "full-text-licensed",
      pollIntervalSeconds: 300,            // on-demand; 5 min is comfortable
      configured, missing,
    }),
    async poll(cursor, signal) {
      if (!configured) return emptyBatch(id, cursor);         // fail closed
      const fromDate = (cursor?.since ?? isoDaysAgo(1)).slice(0, 10);
      const url = buildGuardianUrl(config, fromDate);
      const rejected: DeadLetterRecord[] = [];
      let items: RawArticle[] = [];
      try {
        const res = await fetch(url, { signal });
        if (!res.ok) return emptyBatch(id, cursor);           // 429/5xx -> runner retries
        const payload = guardianResponseSchema.safeParse(await res.json());
        if (!payload.success) return emptyBatch(id, cursor);
        for (const r of payload.data.response.results) {
          const normalized = normalizeGuardian(r, GUARDIAN_RIGHTS);
          const parsed = rawArticleSchema.safeParse(normalized);
          if (parsed.success) items.push(parsed.data);
          else rejected.push(toDeadLetter(id, r, parsed.error));
        }
      } catch {
        return emptyBatch(id, cursor);
      }
      items = dedupeByHash(items);
      const newest = items[0]?.publishedAt ?? cursor?.since ?? nowIso();
      return { provider: id, items, rejected, nextCursor: { since: newest } };
    },
  };
}
```

## 7. Streaming (scheduled polling with watermarks)

Free news sources are **poll-based, not push-based**, so "streaming" here means **frequent scheduled refresh**, not websockets:

- GDELT publishes new data ~every 15 min → poll at `pollIntervalSeconds: 900`.
- Guardian is on-demand → poll at `pollIntervalSeconds: 300`, sorted newest-first.

The **job runner (F-042)** owns the loop: it calls `poll(cursor)`, persists `nextCursor`, and sleeps for the provider's interval. The cursor (`since` + optional provider `token`) is the watermark that makes each poll incremental and idempotent — a restart resumes from the last durable cursor, never re-ingesting or skipping. An optional `AsyncIterable<IngestionBatch>` wrapper can present this as a stream to consumers, but the underlying mechanism stays scheduled polling. **Do not claim real-time streaming** in UI or docs; label it "updated every N minutes."

## 8. Aggregation (multi-provider fan-in)

The aggregator fans out to every configured provider, normalizes into the shared `RawArticle` shape, and **cross-provider dedupes** (a Reuters story surfaced by both GDELT and an aggregator must appear once).

```ts
export interface AggregatingIngestionSource {
  /** Poll all configured providers, merge, cross-dedupe, split out rejects. */
  pollAll(cursors: Record<string, IngestionCursor | null>, signal: AbortSignal):
    Promise<{
      items: RawArticle[];                       // merged, deduped, rights-tagged
      nextCursors: Record<string, IngestionCursor>;
      rejected: DeadLetterRecord[];              // union of all providers' rejects
      providerHealth: ProviderDescriptor[];      // for /admin/ingestion + telemetry
    }>;
}
```

Dedupe precedence when the same story arrives from multiple providers: prefer the record with the **most permissive rights** and richest fields (e.g., Guardian `full-text-licensed` over a GDELT `metadata-only` duplicate), keeping the union of `geographies`. Cross-provider identity is `canonicalUrl` first, then `contentHash`. Merging solely because two records mention the same person/country/topic is forbidden (spec §11) — that is clustering (F-050), not deduplication, and lives downstream.

## 9. Dead-letter queue (DLQ)

Anything that cannot be safely ingested is diverted, never dropped silently and never allowed into a feed:

```ts
export interface DeadLetterRecord {
  provider: string;
  reason: "schema-invalid" | "rights-unknown" | "provider-error" | "duplicate-conflict";
  externalId: string | null;
  payload: unknown;            // original item for audit/replay
  error: string;               // short diagnostic
  attempts: number;            // how many times it was tried before dead-lettering
  deadLetteredAt: string;      // ISO 8601 UTC
}

export interface DeadLetterSink {
  capture(record: DeadLetterRecord): Promise<void>;
  // Operators can inspect and replay from /admin/ingestion (F-033/F-042).
}
```

Flow: transient failures (HTTP 429/5xx, timeout, network) are retried by the job runner with **exponential backoff + jitter** up to a configured ceiling; only after the ceiling, or on a **non-retryable** failure (schema-invalid, rights-unknown), does the record enter the DLQ with its reason and attempt count. The DLQ is observable in `/admin/ingestion`, supports replay after a fix, and its depth is a monitored health signal (spec §14).

## 10. Configuration (fail-closed)

Mirror [`lib/auth.ts`](../../lib/auth.ts): Zod-validate config, disable cleanly when absent.

| Provider | Env var(s) | Required | Absent behavior |
|---|---|---|---|
| GDELT | _(none)_ | — | Always `configured: true` (keyless) |
| Guardian | `GUARDIAN_API_KEY` | Yes | `describe().configured=false`, `poll()` returns empty batch |
| Runner | `INGESTION_POLL_ENABLED`, `INGESTION_MAX_RETRIES`, `INGESTION_BACKOFF_MS` | Yes for live jobs | Jobs stay off; app keeps demo fixtures |

Server-only secrets (API keys) must **never** use the `NEXT_PUBLIC_` prefix and never reach the client bundle — ingestion runs server-side (Phase 6/7), behind the F-030 authorization boundary.

## 11. Source catalog (free / freemium)

Chosen for **licensing fit first**, then coverage. Verify each provider's current free-tier terms before integrating — terms drift.

| Source | Key | Cadence → role | Rights policy | Best-fit app sections |
|---|---|---|---|---|
| **GDELT 2.0** | none | ~15 min → **streaming + global breadth** | `metadata-only` | `/global`, `/countries/*`, `/regions/*`, clustering fairness |
| **The Guardian Open Platform** | free | on-demand → **licensed text** | `full-text-licensed` | story detail, `/categories/*`, source comparison |
| **New York Times (Article Search / Top Stories)** | free | on-demand → metadata | `metadata-only` | feed cards, `/trending` |
| **Hacker News (Firebase) API** | none | frequent → tech vertical | `metadata-only` | a Technology section proof; Firebase-native |
| **NewsData.io / GNews / Mediastack / Currents** | free tier | poll → **aggregation breadth** | `excerpt-permitted` (store excerpt + link only) | `/search`, market breadth across priority locales |

**Aggregation** = GDELT + NYT + one aggregator for breadth. **Licensed display** = Guardian. **Dead-letter/back-pressure** applies uniformly: aggregator free tiers have hard rate limits, so 429s must retry-then-dead-letter, and the DLQ depth per provider is a first-class health metric.

## 12. Compliance checklist for the implementing agent (Phase 7)

Before writing any adapter, confirm:

- [ ] **F-034 persistence exists** — do not build ingestion before Phase 6 lands.
- [ ] Adapter implements `NewsIngestionProvider` exactly; no app section imports a vendor SDK directly.
- [ ] Every record is Zod-validated at the boundary; `body` is `null` unless `full-text-licensed`.
- [ ] Rights envelope + attribution render with every live item; live items are labeled live, not demo.
- [ ] Retry/backoff precedes the DLQ; the DLQ captures reason + attempts and is replayable.
- [ ] Secrets are server-only (no `NEXT_PUBLIC_`), and ingestion runs behind F-030 authorization.
- [ ] Cost/rate telemetry and provider health surface to `/admin/ingestion` (spec §14).
- [ ] Tracker (F-040/F-041/F-042) updated with mock-vs-live status and STABLE evidence.

## 13. Cross-references

- Provider seams and pipeline: [`NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md`](../../NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md) §9–§11, §14.
- Phase gates and features: [`PRODUCT_TRACKER.md`](../../PRODUCT_TRACKER.md) P6 (F-034), P7 (F-040/F-041/F-042), P8 (F-050).
- Fail-closed config pattern to mirror: [`lib/auth.ts`](../../lib/auth.ts).
- Current demo fixtures this eventually augments (never silently replaces): [`lib/stories.ts`](../../lib/stories.ts).
