# NyaVista Product Specifications and Implementation Instructions

## 1. Document authority

This document is the implementation specification for **NyaVista**, a proprietary product of **E-DEAL EXPRESS LLC**, a United States company. It is written for Antigravity, Codex, Cursor, Claude Code, and other coding agents.

Agents must use this document together with:

- `CONSTRAINTS.md` — mandatory, non-negotiable constraints.
- `PRODUCT_TRACKER.md` — source of truth for delivery status and phase gates.
- the **STABLE framework located at the repository root** — mandatory workflow for every feature and functionality.
- repository-level `AGENTS.md`, README files, architecture decisions, and local instructions.

## 1.1 Approved visual reference

The approved cross-product visual baseline is:

```text
docs/design/nyavista-ui-mockup-light-dark.png
```

It guides implementation of the public marketing site, public news application, mobile experiences, editorial administration dashboard, and shared light/dark design system. It depicts:

- marketing homepage;
- desktop news home feed;
- desktop story detail;
- vertical mobile video experience;
- personalized mobile feed;
- editorial administration dashboard;
- color, typography, chip, button, badge, card, and media-control patterns.

Agents and designers must inspect this image before implementing or reviewing user-interface work. The mockup is a visual direction and consistency baseline, not a substitute for functional requirements, content rights, accessibility, responsive behavior, localization, or tested interaction specifications. Where the image and written requirements appear to conflict, preserve the written requirements and record the visual adaptation in `PRODUCT_TRACKER.md`.

If instructions conflict, follow the most specific higher-authority instruction and record the conflict. Never invent missing STABLE rules. If the STABLE framework cannot be found or read completely, stop before implementation and report the blocker.

## 2. Agent operating protocol

Build one approved phase at a time. Before every feature:

1. Inspect the repository and working tree.
2. Locate and read the complete root STABLE framework and all directly required references.
3. Apply the STABLE pre-implementation steps.
4. Review `CONSTRAINTS.md` and the applicable tracker item.
5. Identify existing behavior, dependencies, files, risks, tests, data migrations, and acceptance criteria.
6. State whether the task is analysis, implementation, review, fix, or rollback.

During implementation:

- Follow STABLE checkpoints and preserve their evidence.
- Make the smallest coherent change.
- Preserve working behavior and unrelated user changes.
- Validate all trust boundaries and enforce authorization server-side.
- Keep mocks visibly distinct from live integrations.
- Update tests and documentation with the implementation.

At completion:

1. Apply the STABLE review and validation steps.
2. Run lint, type checking, relevant tests, and a production build.
3. Verify responsive, accessibility, security, localization, and failure states.
4. Update `PRODUCT_TRACKER.md` with evidence, not estimates presented as facts.
5. Report files changed, validation results, risks, limitations, migrations, and a recommended commit.
6. Stop at the phase gate and wait for approval.

For UI work, completion also requires a visual comparison against `docs/design/nyavista-ui-mockup-light-dark.png` in both themes at the applicable desktop and mobile breakpoints. Record screenshots, deviations, and accessibility-driven adaptations in the tracker.

Accepted control commands:

- `NEXT` — begin the next approved phase.
- `CHANGE:` — revise the current deliverable.
- `QUESTION:` — answer without advancing.
- `REVIEW:` — inspect and report without modification.
- `FIX:` — correct the specified defect.
- `ROLLBACK:` — propose and safely perform the requested rollback.

## 3. Product identity

- **Name:** NyaVista
- **Tagline:** Every story. A clearer view.
- **Owner:** E-DEAL EXPRESS LLC
- **Founding country:** United States
- **Product type:** Global AI news intelligence and multimedia platform

Positioning:

> NyaVista brings reporting from multiple sources together and transforms complex stories into clear summaries, contextual insights, source comparisons, audio, video, and visual explainers.

The name draws linguistic inspiration from Eʋe—through “Nya,” associated with a story, matter, subject, message, or issue—and combines it with “Vista,” meaning a broad or clearer view. Some co-founders are originally from Togo. This is brand heritage, not regional product positioning.

Never describe NyaVista as African-born, Africa-first, Togo-focused, diaspora-focused, or restricted to a country or continent. The product is United States-founded and global.

Centralize product identity, legal ownership, contacts, metadata, market priorities, colors, typography, locales, social handles, and copyright notices in configuration rather than duplicating them in components.

## 4. Global market and coverage strategy

Initial English-language commercial priorities are:

1. United States
2. Canada
3. United Kingdom
4. New Zealand
5. Australia

Commercial priority must remain separate from editorial importance. Qualifying stories and sources from every country must be evaluated consistently. A globally important story must not be suppressed because it originates outside a priority market.

Required behavior:

- Global, country, and regional discovery.
- Configurable and personalized market sections; no permanent geography hardcoded into every feed.
- Country-neutral source admission and ranking standards.
- Transparent recommendation criteria.
- Source-diversity and geographic-coverage monitoring.
- Local relevance without hiding major global developments.
- Africa and Togo supported through the same extensible geography model as all other locations.

Initial locales: `en-US`, `en-CA`, `en-GB`, `en-NZ`, and `en-AU`. Prepare for French, Spanish, Portuguese, German, Italian, Arabic, Swahili, Eʋe, Hausa, Yoruba, Chinese, Japanese, Korean, and Hindi without claiming unsupported translations.

## 5. Product goals and MVP scope

The MVP must:

1. Ingest authorized news metadata and permitted excerpts.
2. Normalize multilingual and multi-market source records.
3. Detect duplicates and cluster reports about the same event.
4. Generate structured, neutral, multi-source summaries.
5. Separate confirmed facts, disputed claims, analysis, opinion, and uncertainty.
6. Explain why a story matters, its context, and what to watch next.
7. Compare source framing descriptively.
8. Present text, audio, short video, timelines, maps, charts, and visual explainers.
9. Let users personalize countries, regions, sources, categories, topics, language, depth, and format.
10. Provide prominent source attribution, AI disclosure, correction history, and human editorial review.

Core subjects: Politics, Public Policy, Economy, Business, Technology, Healthcare, Culture, and Global Affairs. The taxonomy must also accommodate education, climate, science, security, law, trade, energy, finance, sports, AI, transportation, travel, agriculture, and humanitarian affairs.

Out of initial scope unless an approved phase adds them: native mobile applications, uncontrolled automatic publishing, unlicensed full-text storage, paywall bypassing, expensive mandatory live video generation, and unsupported live provider claims.

## 6. Users and roles

Target users include professionals, policy-aware citizens, entrepreneurs, students, international-news readers, researchers, educators, journalists, creators, businesses, civil society, and institutions.

Roles:

| Role | Core permissions |
|---|---|
| Guest | Browse, search, view sources, limited media, newsletter signup |
| User | Personalize, follow, bookmark, save media, manage alerts and history |
| Premium user | Deeper context, advanced filters, premium media, expanded tracking |
| Contributor | Submit drafts, sources, and scripts; cannot publish |
| Editor | Review and approve standard-risk content |
| Senior editor | Approve sensitive content, corrections, overrides, and schedules |
| Administrator | Manage users, roles, sources, markets, providers, settings, audit, and costs |

Every permission must be enforced on the server. Hidden UI is not authorization.

## 7. Application areas and routes

### Marketing

Home, Product, Features, How It Works, Global Coverage, Video Explainers, Audio Briefings, For Professionals, For Organizations, Pricing, About, Newsletter, Contact, FAQ, Editorial Standards, Source Methodology, AI Disclosure, Corrections, Copyright/DMCA, Privacy, Terms, Cookies, and Accessibility.

Primary headline: **Understand the news in minutes, not hours.**

### Public product

Recommended routes:

```text
/news                         /news/[storySlug]
/global                       /countries/[countrySlug]
/regions/[regionSlug]         /categories/[categorySlug]
/topics/[topicSlug]           /sources/[sourceSlug]
/videos/[videoSlug]           /audio/[briefingSlug]
/search                       /trending
/bookmarks                    /following
/notifications               /profile
/settings/*                   /onboarding
```

### Editorial administration

```text
/admin
/admin/sources               /admin/coverage
/admin/countries             /admin/regions
/admin/languages             /admin/ingestion
/admin/articles              /admin/clusters
/admin/editorial             /admin/videos
/admin/audio                 /admin/media
/admin/publishing            /admin/categories
/admin/topics                /admin/newsletters
/admin/users                 /admin/roles
/admin/corrections           /admin/flags
/admin/audit                 /admin/ai-usage
/admin/analytics             /admin/settings
```

## 8. UX requirements

Use `docs/design/nyavista-ui-mockup-light-dark.png` as the primary visual reference for layout hierarchy, density, spacing, component character, theme treatment, and the relationship between marketing, public product, mobile, and administration experiences.

Home must provide a personalized mix of top stories, latest coverage, selected countries/regions, subjects, most watched, and editorial context picks. Story cards show geography where relevant, category, headline, short summary, why-it-matters preview, source count, time, reading time, media indicators, bookmark/share actions, and AI-assisted disclosure.

Story pages include Overview, Sources, Timeline, Video, and Audio views; publication/update dates; affected geographies; key points; context; next developments; source comparisons; original links; corrections; and related coverage.

Search supports keyword, category, topic, country, region, source, language, date, and format filters. Personalization settings must always be reversible.

Build an original interface. Do not clone another news or social product. Support light/dark themes, responsive layouts, loading/error/empty/offline states, reduced motion, and resilient media fallbacks.

### Visual implementation rules

- Implement design tokens rather than sampling and duplicating values throughout components.
- Preserve the mockup's calm editorial hierarchy, restrained depth, 12px-style card language, minimal borders, strong content grouping, and controlled indigo/violet/gold accents.
- Provide true theme-specific styling; dark mode must not be a mechanical color inversion.
- Use the mockup's serif/sans editorial pairing as direction while ensuring font licensing, performance, language coverage, and fallbacks.
- Preserve visible source counts, AI-assisted disclosures, correction/status treatments, captions, media controls, and operational risk labels.
- Adapt layouts cleanly at unsupported dimensions instead of forcing the presentation-board proportions.
- Do not copy incidental generated placeholder text, fictional numbers, imagery, or data from the mockup into production as factual content.
- Any intentional visual deviation must state its reason: accessibility, responsiveness, localization, browser behavior, implementation feasibility, or an approved product decision.

### Required visual QA

- [ ] Marketing, news feed, story detail, mobile feed/video, and admin implementations are compared with the applicable mockup panel.
- [ ] Light and dark themes are reviewed independently.
- [ ] Mobile, tablet, desktop, and large-desktop layouts have no overflow or clipped controls.
- [ ] Typography, spacing, radii, borders, elevation, iconography, and states use shared tokens/components.
- [ ] Keyboard focus, contrast, reduced motion, captions, touch targets, and no-color-only states remain compliant.
- [ ] Screenshots or browser-test artifacts and approved deviations are recorded in `PRODUCT_TRACKER.md`.

## 9. Recommended architecture

Default stack:

- Next.js App Router, React, strict TypeScript.
- Tailwind CSS, shadcn/ui, Lucide icons.
- React Hook Form and Zod.
- Firebase Authentication, Firestore, Storage, Admin SDK, App Check where practical, Cloud Functions or Cloud Run, and Emulator Suite.
- Stripe-compatible subscription boundaries.

Do not mix Firebase and Supabase without a recorded architectural decision.

Keep UI, domain logic, persistence, background jobs, validation, and provider integrations separate. Prefer Server Components; use Client Components only for required interactivity.

Required provider seams:

```ts
interface NewsIngestionProvider {}
interface LLMProvider {}
interface EmbeddingProvider {}
interface TTSProvider {}
interface ImageGenerationProvider {}
interface VideoRenderer {}
interface ModerationProvider {}
interface TranslationProvider {}
interface SearchProvider {}
interface RecommendationProvider {}
```

Each external service needs an interface, mock, validated configuration, explicit failure state, and setup documentation.

The approved reference design for the `NewsIngestionProvider` seam — its normalized record contract, the GDELT and Guardian adapters, and the streaming, aggregation, and dead-letter-queue behavior — is `docs/architecture/news-ingestion-providers.md`. It is a design reference, not implemented code: live ingestion is Phase 7 (F-040/F-041/F-042), gated behind Phase 6 persistence (F-034). Ingestion implementations must conform to that seam and its rights rules, or record an architecture decision before diverging.

## 10. Core domain model

Implement typed entities and Zod schemas for:

- News sources: identity, geography, languages, source type, coverage, credibility tier, rights policy, attribution rules, status.
- Raw articles: canonical URL, timestamps, permitted text, language, geographies, entities, hash, rights, and processing status.
- Story clusters: headlines, summaries, facts, disputes, subjects, sources, geography, relevance, media, confidence, risk, review, publication, and corrections.
- Source perspectives: framing, unique facts, disputes, emphasis, and content type.
- Video explainers and scenes: locale, duration, aspect ratio, narration, on-screen text, media type, attribution, generation and editorial status.
- Audio briefings and transcripts.
- Users, roles, locale/timezone, preferences, subscriptions, bookmarks, and history.
- Prompt templates and AI generation metadata.
- Editorial audit logs with before/after state and reviewer justification.

Use ISO country and locale identifiers. Store timestamps in UTC and render them locale-aware.

## 11. Content pipelines

### Ingestion

```text
schedule/manual trigger -> authorized provider -> validate -> normalize
-> canonicalize -> detect language/geography -> enforce rights -> hash
-> deduplicate -> classify/extract entities -> persist -> cluster queue
```

No paywall bypass, unauthorized full-text scraping, or unlicensed publisher media. Provide retries, backoff, dead-letter/failed states, observability, and idempotency.

This pipeline's concrete adapter design — scheduled-poll "streaming" with watermark cursors, multi-provider aggregation and cross-provider deduplication, and retry-then-dead-letter handling — is specified in `docs/architecture/news-ingestion-providers.md`, together with the free source catalog (GDELT, Guardian, and others) selected by licensing fit.

### Clustering

Combine canonical URLs, normalized titles, hashes, entities, time, location, keyword overlap, and embeddings. Never merge solely because records mention the same person, country, institution, or broad topic. Thresholds must be configurable and tested across follow-ups, multilingual reports, resurfaced stories, and different local impacts.

### AI summarization

Return schema-validated structured output containing headline, short and full summaries, key points, why it matters, context, what comes next, confirmed facts, uncertain/disputed claims, source differences, affected geographies, relevance, and confidence.

Never invent facts, quotes, or sources; reproduce long passages; flatten geographic nuance; stereotype nationalities; or present one national viewpoint as universal. Store provider, model, prompt version, request ID, cost/usage, and reviewer metadata.

### Editorial workflow

```text
ingested -> normalized -> clustered -> AI draft -> awaiting review
-> changes requested -> approved -> scheduled -> published -> updated/archived
```

Mandatory elevated review must be configurable for elections, allegations, health advice, outbreaks, violence, casualty figures, legal accusations, market-moving claims, security, identity-based tensions, borders, unrest, conflicts, emergencies, and inconsistent translations.

### Multimedia

Approved story -> script -> scenes -> rights-cleared assets -> voice/captions -> preview -> review -> render -> publish. Support 30/60-second vertical formats first, with 16:9 and square seams. Use owned, licensed, public-domain, or appropriately labeled generated media only. Audio requires transcript, playback speed, language/voice disclosure, and attribution.

## 12. Trust, legal, privacy, and editorial safeguards

Required public documents: Terms, Privacy, Cookies, Copyright/DMCA, Content and AI Disclosure, Editorial Standards, Corrections, Source Methodology, Recommendation Methodology, Community Guidelines, and Accessibility.

Required disclosure:

> NyaVista uses automated systems to assist with news clustering, summarization, translation, audio, and multimedia generation. Sensitive content may be reviewed by human editors. Readers should consult original publisher sources for complete reporting and context.

Provide reporting, correction, and removal workflows; visible attribution; rights rules per source; update history; consent architecture; and regional legal configuration. Do not encode unsupported fair-use assumptions.

## 13. Accessibility, internationalization, performance, and security

- Target WCAG 2.2 AA: semantics, keyboard use, visible focus, labels, alt text, captions/transcripts, contrast, screen-reader announcements, reduced motion, accessible media, sufficient touch targets, and no color-only meaning.
- Use locale-aware text, spelling, dates, numbers, currency, timezone, metadata, and `hreflang`. Label machine translation where appropriate.
- Optimize globally for variable bandwidth: responsive media, lazy loading, caching, pagination, small client bundles, optimized fonts, code splitting, placeholders, and CDN-ready delivery.
- Validate environment variables; enforce RBAC and Firebase rules; validate inputs/outputs; rate-limit; prevent unsafe redirects; isolate secrets; verify webhooks; restrict uploads; apply secure headers/CSP; log privileged actions.

## 14. Analytics and quality monitoring

Track views, media starts/completion, saves, shares, source clicks, searches, follows, signup/onboarding, newsletters, upgrades, and retention with privacy/consent controls.

Track source and geographic health: sources per country, source concentration, story distribution, undercoverage, cluster diversity, local/international balance, translation usage, and recommendation distribution.

Monitor ingestion, AI, translation, media, authentication, publishing, latency, tokens, and estimated costs.

## 15. Required tests

Use unit, component, integration, end-to-end, schema, permission, and Firebase Rules tests. Critical flows include browsing and source links; registration and onboarding; follows and bookmarks; editorial approvals; administrator source management; access denial; malformed AI rejection; deduplication; safe clustering; media retry; visible corrections; locale and geography pages; geographic ranking fairness; and production build success.

## 16. Demo data

Use clearly fictional and geographically diverse sources and stories. Cover the five initial markets plus Europe, Africa/Togo, Asia, and Latin America without making one noncommercial region the defining majority. Every cluster needs 3–5 sources, summaries, key points, context, source differences, multimedia scripts/transcripts, related stories, and geography metadata.

Display: **Demo content — not live reporting.** Never use real publisher marks or fabricate live reporting.

## 17. Delivery phases

| Phase | Scope | Gate outcome |
|---:|---|---|
| 0 | Repository audit and planning | Approved architecture, risks, backlog, acceptance criteria |
| 1 | Foundation and design system | Validated scaffold, brand/company config, accessible components |
| 2 | Marketing | Responsive global site, legal shells, SEO |
| 3 | Public demo experience | Global/country feeds, stories, search, demo media |
| 4 | Authentication/personalization | Auth, onboarding, preferences, persisted saves |
| 5 | Admin/editorial | RBAC, review, source and media management |
| 6 | Firebase persistence | Repositories, rules, indexes, emulator and tests |
| 7 | Ingestion | Authorized adapters, normalization, dedupe, retries |
| 8 | Clustering | Heuristics, embedding seam, controls, tests |
| 9 | AI intelligence | Structured summaries, comparisons, audit/cost tracking |
| 10 | Video/audio | Scripts, mocks/live seam, captions, transcripts, review |
| 11 | Engagement/revenue | Newsletters, alerts, entitlements, payment seam |
| 12 | Trust/localization | Legal completion, corrections, accessibility, locales |
| 13 | Quality/optimization | Analytics, E2E, security, performance, cost reviews |
| 14 | Launch | CI/CD, environments, smoke tests, backup and rollback |

The Phase 1 design system must translate the approved mockup into reusable tokens and components. Phases 2, 3, and 5 must include panel-by-panel visual comparison for marketing, public news, and administration surfaces. Phase 13 must include automated and manual visual-regression coverage for both themes.

## 18. Required documentation

Maintain README plus product requirements, brand/ownership, global strategy, architecture, routes, components, data model, AI/ingestion/editorial/video/audio pipelines, content rights, security, accessibility, internationalization, geographic coverage, recommendations, analytics, testing, environment variables, deployment, roadmap, limitations, and changelog documents.

## 19. Definition of done

A feature is done only when its STABLE lifecycle is complete; acceptance criteria pass; lint, types, tests, and build pass; authorization, validation, failure states, accessibility, responsiveness, localization, analytics, documentation, and tracker evidence are complete; mock/live status is truthful; secrets are absent; and no known critical issue remains.

For any user-interface feature, “done” additionally requires comparison with `docs/design/nyavista-ui-mockup-light-dark.png`, verification in both light and dark themes, and documentation of all intentional deviations.

The MVP is complete only when it runs locally and in a documented deployment environment; ownership and global positioning are correct; global and country discovery work; auth, onboarding, saved content, protected administration, editorial review, ingestion/deduplication/clustering, validated AI output, media workflows, legal/trust pages, accessibility basics, internationalization, tested rules, deployment, rollback, and limitations are all documented and verified.
