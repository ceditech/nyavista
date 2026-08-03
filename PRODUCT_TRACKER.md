# NyaVista Product Tracker

## Tracker rules

This file is the delivery source of truth. Update it after evidence exists, not before. Every item must reference the root STABLE framework and satisfy `CONSTRAINTS.md`.

### Status vocabulary

`NOT_STARTED` · `DISCOVERY` · `PLANNED` · `IN_PROGRESS` · `BLOCKED` · `IN_REVIEW` · `VALIDATING` · `DONE` · `DEFERRED`

### Priority and risk

- Priority: `P0` critical, `P1` high, `P2` normal, `P3` optional.
- Risk: `LOW`, `MEDIUM`, `HIGH`, `CRITICAL`.
- A blocked item records owner, reason, date, and unblock condition.
- `DONE` requires linked acceptance and verification evidence.

## Program summary

| Field | Value |
|---|---|
| Product | NyaVista |
| Owner | E-DEAL EXPRESS LLC |
| Current phase | Phase 6 persistence/security — F-030 in progress (Slices 1a RBAC + 1b server session/authorize); Phase 4 F-023 awaiting live QA |
| Overall status | IN_PROGRESS |
| Release target | TBD |
| Release owner | TBD |
| Last updated | 2026-08-02 |
| Updated by | Codex |
| STABLE framework path/version | `STABLE_FRAMEWORK.md` at repository root, reviewed at baseline commit `6265a47` |
| Approved visual reference | `docs/design/nyavista-ui-mockup-light-dark.png` |
| Visual baseline status | PASS — 72 Playwright baselines across 9 surface groups, 2 themes, and 4 breakpoints |
| Highest open risk | Server session verification and authorization primitives exist (F-030 1a/1b) but are not yet enforced on any route (Slice 3) or in Firebase Security Rules (Slice 1c) |
| Build | PASS — `vinext build` (2026-08-02) |
| Tests | PASS — 43/43 Node tests (2026-08-03) and 94/94 isolated Playwright visual/interaction tests (2026-08-02); Auth Emulator integration executed 2026-08-02 (`pnpm test:auth:emulator` → 1/1 Node test PASS) |
| Security review | NOT_STARTED |
| Accessibility review | IN_REVIEW — semantic DOM, keyboard focus, responsive navigation, reduced motion |
| Legal/editorial review | NOT_STARTED |

## Phase tracker

| ID | Phase | Status | Exit criteria | Evidence | Risks/blockers | Approved by/date |
|---|---|---|---|---|---|---|
| P0 | Audit and planning | NOT_STARTED | Architecture, routes, data, STABLE mapping, risks and backlog approved | — | — | — |
| P1 | Foundation/design system | DONE | Scaffold/build valid; brand, company, theme and shared states complete | F-010–F-013 and F-015–F-016 accepted; lint, types, tests, build, 24 baselines, and 26 browser cases pass | — | User, 2026-08-01 |
| P2 | Marketing website | DONE | Global responsive pages, legal shells and SEO verified | F-014 and F-017 complete; 24 routes, safe SEO policy, 40 baselines, 50 browser cases, 10 Node tests, and build pass | Qualified legal review remains required before launch | User, 2026-08-02 |
| P3 | Public demo product | DONE | Feeds, stories, geography, search and demo media verified | F-020–F-022 complete; 17 Node tests, 64 baselines, 82 browser cases, production build, and user review pass | No live news/provider data; all fixtures and media remain fictional | User, 2026-08-02 |
| P4 | Auth/personalization | IN_PROGRESS | Auth, onboarding, preferences and saves persist securely | F-023 fail-closed Firebase client foundation, account UI, config tests, and 8 visual baselines | Firebase project/emulator and F-030 server session/RBAC work remain required | User, 2026-08-02 |
| P5 | Admin/editorial | NOT_STARTED | RBAC and review/source/media workflows verified | — | — | — |
| P6 | Firebase persistence | IN_PROGRESS | Repositories, rules, indexes, emulator and permission tests pass | F-030 Slices 1a–1b: `lib/rbac.ts` model, `lib/server-session.ts` (Workers JWKS verify), `lib/authz.ts` (authorize + RoleProvider seam); 24 F-030 tests, full suite 43/43, tsc/lint PASS | Firebase Security Rules (1c) and route-level enforcement (Slice 3) pending; F-034 repositories not started | User approved phase gate, 2026-08-02 |
| P7 | Ingestion | NOT_STARTED | Authorized ingestion, normalization, dedupe, retries and logs pass | — | — | — |
| P8 | Clustering | NOT_STARTED | Matching, thresholds, merge/split and edge tests pass | — | — | — |
| P9 | AI intelligence | NOT_STARTED | Structured output, audit, review, costs and mock/live seams pass | — | — | — |
| P10 | Video/audio | NOT_STARTED | Script, media, caption/transcript, review and retry flows pass | — | — | — |
| P11 | Engagement/revenue | NOT_STARTED | Newsletter, alerts, plans and entitlements verified | — | — | — |
| P12 | Trust/localization | NOT_STARTED | Legal, corrections, accessibility and locale architecture approved | — | — | — |
| P13 | Quality/optimization | NOT_STARTED | Analytics, E2E, security, performance and cost gates pass | — | — | — |
| P14 | Launch readiness | NOT_STARTED | CI/CD, staging/prod, smoke, backup, rollback and checklist approved | — | — | — |

## Epic and feature register

Create one row per independently testable outcome. Split rows that require different acceptance evidence.

| ID | Phase | Epic/feature | Priority | Status | Owner | STABLE evidence | Acceptance criteria | Tests/evidence | Risk | Dependencies | Docs | Commit/PR |
|---|---:|---|---|---|---|---|---|---|---|---|---|---|
| F-015 | 1 | Living sprint tracker and agent handoff foundation | P0 | DONE | Codex | Root STABLE and approved mockup panels inspected; responsive light/dark comparison and user acceptance complete | Responsive application shell, truthful demo surfaces, synchronized tracker, accessible navigation, and cross-agent handoff are visible and documented | User approved 2026-08-01; mobile Menu issue corrected; lint, types, 6 Node tests, build, and 26 browser tests PASS | HIGH | F-000, F-001, F-011 | `CLAUDE_HANDOFF.md`, tracker UI | Working tree |
| F-002 | 0 | Repository ignore and branch-governance hardening | P1 | DONE | Codex | `STABLE_FRAMEWORK.md` reviewed; generated/local artifact audit performed on `feature/nyavista_cedi_app` at `f902b9d`; GitHub ruleset `20211916` verified active | Generated dependencies, build output, caches, logs, editor state, OS metadata, and secrets stay out of Git; sanitized environment templates remain committable; `main` accepts changes only through PRs | `git status --ignored`, tracked-artifact scan, `git check-ignore`; active GitHub ruleset applies to `main`, requires PRs, restricts deletion, blocks force pushes, and has an empty bypass list | MEDIUM | F-000, F-001, GitHub admin access | `.gitignore`, repository settings | Working tree; `https://github.com/ceditech/nyavista/settings/rules/20211916` |
| F-000 | 0 | Locate and map root STABLE framework | P0 | NOT_STARTED | — | — | Complete framework read; workflow mapped; no invented rules | Path/version and review note | CRITICAL | Repository access | Constraints/specs | — |
| F-001 | 0 | Repository audit | P0 | NOT_STARTED | — | — | Current architecture, changes, dependencies and gaps documented | Audit report | HIGH | F-000 | Architecture | — |
| F-010 | 1 | Central brand/company configuration | P0 | DONE | Codex | Root STABLE, product specification, constraints, and Next.js metadata guidance reviewed; complete STABLE record below | Ownership, global positioning, demo metadata, commercial markets, locale resolution, UTC storage guidance, and locale-aware formatters have one typed source | 6/6 Node tests, lint, types, build, rendered metadata, and 24/24 visual regressions PASS | MEDIUM | F-001 | Brand/ownership, metadata, locale helpers | Working tree |
| F-011 | 1 | Translate approved mockup into design tokens | P0 | DONE | Codex | Approved mockup and both themes reviewed; user accepted 2026-08-01 | Shared semantic colors, typography, spacing, radii, elevation, focus, reduced motion, and states remain coherent | 24 visual baselines, 26 browser tests, lint, types, and user review PASS | HIGH | F-000, F-001 | Components/design system | Working tree |
| F-012 | 1 | Build mockup-aligned shared components | P0 | DONE | Codex | Shared component patterns reviewed across all current surfaces and breakpoints; user accepted 2026-08-01 | Navigation, cards, metrics, badges, buttons, panels, progress, and responsive states are consistent and accessible | Mobile Menu discoverability corrected; 26 browser tests, lint, types, and build PASS | HIGH | F-011 | Components | Working tree |
| F-013 | 1 | Establish visual-regression workflow | P1 | DONE | Codex | Root STABLE and approved mockup reviewed; Playwright workflow exercises navigation, themes, error states, overflow, and screenshots | Stable screenshots cover all current surfaces, both themes, and four agreed breakpoints | 24/24 visual tests PASS; 24 committed PNG baselines; mobile tracker overflow found and corrected | HIGH | F-011, F-012 | `playwright.config.ts`, `tests/visual-regression.spec.ts`, baseline README | Working tree |
| F-014 | 2 | Marketing homepage visual implementation | P0 | DONE | Codex | Root STABLE at `6265a47`; full lifecycle, mockup comparison, and review evidence recorded below | Marketing panel hierarchy is reproduced responsively in light/dark themes | 8 marketing screenshots; 38/38 browser cases; semantic/a11y assertions; lint/types/tests/build PASS | HIGH | F-011, F-012 | Marketing | Working tree |
| F-017 | 2 | Marketing routes, legal shells, and SEO | P0 | DONE | Codex | Root STABLE reviewed at `d1f2405`; complete lifecycle and vinext compatibility evidence below | Required route shells, truthful metadata/canonical policy, and legal-review states are implemented | 24 route registry tests; 10/10 Node tests; 40 baselines; 50 browser cases; build PASS | HIGH | F-010, F-014 | Marketing/trust/SEO | Working tree |
| F-018 | 2 | Approved logo integration and cross-app visual refinement | P1 | IN_REVIEW | Codex | Root STABLE, constraints/specs, approved mockup, both repository logo assets, asset alpha/proportions, shared shell, and Next.js image guidance inspected | Detailed and simplified logos appear in appropriate responsive contexts; shared surfaces feel cohesive without behavior regression | Strict types, lint, build, 20/20 Node tests, and focused 4/4 brand/render tests PASS; user requested screenshot tests be deferred | HIGH | F-011, F-012, F-014 | Brand/UI | Working tree |
| F-020 | 3 | Global/country/region feed architecture | P0 | DONE | Codex | `STABLE_FRAMEWORK.md` at repository root reviewed; Phase 2 closure and F-020 continuation approved 2026-08-02; complete lifecycle recorded below | Typed, schema-validated feed scopes support global, country, and region discovery without commercial-market or special-country ranking logic | 4 focused geography/fairness tests and 14/14 full Node tests, lint, strict types, and production build PASS | HIGH | F-010 | Geographic coverage | Working tree |
| F-021 | 3 | News feed and story visual implementation | P0 | DONE | Codex | Root STABLE, approved feed/story mockup panels, current shell, F-020 contracts, Next.js App Router guidance, React quality review, and user acceptance completed | Responsive feed and story-detail demo expose geography, context, source transparency, uncertainty, and accessible interaction in both themes | 17/17 Node tests, lint, strict types, build, 48 baselines, 62/62 browser cases, and user review PASS | HIGH | F-012, F-020 | Public UX | Working tree |
| F-022 | 3 | Mobile feed and video visual implementation | P0 | DONE | Codex | Root STABLE, mobile feed/video panels, F-020/F-021 domain and UI, Next.js client/data/image guidance, React quality review, complete validation, and user acceptance recorded | Search, touch-first feed treatment, and rights-safe demo media provide accessible responsive flows with truthful failure/fallback states | 17/17 Node tests, lint, strict types, build, 64 baselines, 82/82 browser cases, and user review PASS | HIGH | F-012, F-020, F-021 | Public UX | Working tree |
| F-023 | 4 | Authentication and onboarding | P0 | IN_PROGRESS | Codex | Root STABLE, constraints/specs, shared mockup system, Next.js guidance, and official Firebase modular/emulator guidance reviewed; lifecycle record below | Fail-closed and live-configured Firebase client modes exist; completion still requires live flow acceptance, server sessions, emulator/security evidence, account deletion, and onboarding persistence | 3 focused auth tests, live configured-state browser verification, strict types, lint, build, 8 account baselines, and 94/94 isolated browser cases PASS; Auth Emulator integration executed 2026-08-02 (1/1 Node test PASS) | CRITICAL | F-010, Firebase Authentication enablement; F-030 consumes identity for authorization | Auth/security | Working tree |
| F-031 | 5 | Editorial dashboard visual implementation | P1 | NOT_STARTED | — | — | Admin panel guides metrics, queues, risks and coverage in both themes | Screenshots/E2E/a11y | HIGH | F-012, RBAC | Admin UX | — |
| F-030 | 6 | Server-side RBAC and Firebase rules | P0 | IN_PROGRESS | Claude | Root STABLE, CONSTRAINTS, spec §6/§13, and Cloudflare Workers runtime inspected; sliced 1a model / 1b Workers session verification / 1c Firebase rules | Unauthorized access denied in UI and backend | Slices 1a–1b: RBAC model + Workers JWKS session verification + authorize()/RoleProvider seam; 24 F-030 tests, full 43/43 Node, tsc + lint PASS | CRITICAL | Auth/data model | Security | Working tree |
| F-040 | 7 | Rights-aware ingestion | P0 | NOT_STARTED | — | — | Rights enforced; no paywall bypass/full-text default | Unit/integration logs | CRITICAL | Sources/providers | Content rights; `docs/architecture/news-ingestion-providers.md` | — |
| F-050 | 8 | Event clustering | P0 | NOT_STARTED | — | — | Related reports cluster; unrelated reports remain separate | Edge-case suite | HIGH | Ingestion/embeddings | AI pipeline | — |
| F-060 | 9 | Structured multi-source summary | P0 | NOT_STARTED | — | — | Schema-valid, attributed, neutral, auditable | Schema/red-team/editor tests | CRITICAL | Clusters/LLM | AI/editorial | — |
| F-070 | 10 | Rights-cleared media workflow | P1 | NOT_STARTED | — | — | Attribution, captions, transcript, review and retry work | Integration/E2E | HIGH | Editorial/storage | Media pipelines | — |
| F-080 | 12 | Corrections and AI disclosure | P0 | NOT_STARTED | — | — | Public correction history and disclosures visible | E2E/legal review | CRITICAL | Publishing | Trust/legal | — |
| F-090 | 14 | Production release gate | P0 | NOT_STARTED | — | — | All release checklist gates approved | Release report | CRITICAL | All P0/P1 work | Deployment | — |

## Delivery hierarchy

This is the canonical source for the Project Tracker UI. Sprints group phases for planning, but do not authorize skipping phase gates. Add or split feature rows as scope becomes clearer; never replace evidence-backed progress with estimates presented as fact.

### Sprint register

| ID | Sprint | Goal | Phases | Status |
|---|---|---|---|---|
| S0 | Readiness | Establish governance, architecture, risks, and a traceable delivery baseline | P0 | IN_PROGRESS |
| S1 | Experience foundation | Build the shared system, marketing surface, and public demo experience | P1, P2, P3 | IN_PROGRESS |
| S2 | Identity and editorial control | Add secure identity, personalization, editorial operations, and persistence | P4, P5, P6 | PLANNED |
| S3 | Intelligence pipeline | Build rights-aware ingestion, clustering, AI intelligence, and reviewed media | P7, P8, P9, P10 | PLANNED |
| S4 | Engagement and trust | Add engagement/revenue seams and complete trust/localization foundations | P11, P12 | PLANNED |
| S5 | Quality and launch | Prove quality, security, performance, operations, and launch readiness | P13, P14 | PLANNED |

### Feature progress register

| ID | Sprint | Phase | Feature | Priority | Status | Progress | Checkpoint | Owner | Acceptance / evidence | Risk | Dependencies |
|---|---|---|---|---|---|---:|---|---|---|---|---|
| F-000 | S0 | P0 | Locate and map root STABLE framework | P0 | DONE | 100% | DONE | Codex | Root framework and required references reviewed; workflow mapped | CRITICAL | Repository access |
| F-001 | S0 | P0 | Repository audit and architecture baseline | P0 | IN_PROGRESS | 55% | BUILD | Codex | Repository, branch, runtime, build, risks, and UI audit evidence | HIGH | F-000 |
| F-002 | S0 | P0 | Repository ignore and branch-governance hardening | P1 | DONE | 100% | DONE | Codex | Ignore audit and active GitHub ruleset 20211916 | MEDIUM | F-000, F-001 |
| F-010 | S1 | P1 | Central brand/company configuration | P0 | DONE | 100% | DONE | Codex | Typed identity, no-index demo metadata, commercial/editorial separation, locale fallback, UTC policy, Intl formatters, and all verification gates pass | MEDIUM | F-001 |
| F-011 | S1 | P1 | Translate approved mockup into design tokens | P0 | DONE | 100% | DONE | Codex | User approved; coherent light/dark tokens verified across 24 baselines and all breakpoints | HIGH | F-000, F-001 |
| F-012 | S1 | P1 | Build mockup-aligned shared components | P0 | DONE | 100% | DONE | Codex | User approved; shared patterns and explicit mobile/tablet Menu drawer pass 26 browser tests | HIGH | F-011 |
| F-013 | S1 | P1 | Establish visual-regression workflow | P1 | DONE | 100% | DONE | Codex | 24/24 Playwright baselines pass across briefing, tracker, and editorial; light/dark at mobile, tablet, desktop, and large desktop | HIGH | F-011, F-012 |
| F-015 | S1 | P1 | Living sprint tracker and agent handoff foundation | P0 | DONE | 100% | DONE | Codex | User approved; responsive shell, handoff, truthful demo states, and Menu drawer evidence complete | HIGH | F-000, F-001, F-011 |
| F-016 | S1 | P1 | Markdown-synchronized delivery hierarchy | P0 | DONE | 100% | DONE | Codex | User approved; parser, hierarchy UI, build gates, 24 baselines, and responsive interaction evidence complete | HIGH | F-001, F-015 |
| F-014 | S1 | P2 | Marketing homepage visual implementation | P0 | DONE | 100% | DONE | Codex | Approved and implemented 2026-08-01; 8 responsive light/dark baselines and 38 browser cases pass | HIGH | F-011, F-012 |
| F-017 | S1 | P2 | Marketing routes, legal shells, and SEO | P0 | DONE | 100% | DONE | Codex | 24 typed routes; review-labeled policy shells; fail-safe robots/canonical/sitemap; 40 baselines and 50 browser cases pass | HIGH | F-010, F-014 |
| F-018 | S1 | P2 | Approved logo integration and cross-app visual refinement | P1 | IN_REVIEW | 80% | VALIDATE | Codex | Central brand component, detailed hero treatment, compact header/sidebar wordmark, shared surface polish, responsive rules, strict types/lint/build/20 Node tests pass; manual visual acceptance pending and screenshot tests deferred by user | HIGH | F-011, F-012, F-014 |
| F-020 | S1 | P3 | Global/country/region feed architecture | P0 | DONE | 100% | DONE | Codex | Typed Zod contracts, bounded requests, deterministic matching, malformed-input rejection, and market-priority invariance pass 14/14 Node tests, lint, types, and build | HIGH | F-010 |
| F-021 | S1 | P3 | News feed and story experience | P0 | DONE | 100% | DONE | Codex | Typed fictional stories, F-020 geography controls, feed/detail interactions, source/uncertainty states, 48 baselines, 62 browser cases, and user review pass | HIGH | F-012, F-020 |
| F-022 | S1 | P3 | Search, mobile feed, and demo media | P0 | DONE | 100% | DONE | Codex | Local search/empty/clear states, mobile dock, simulated media controls/transcript/fallback, 64 baselines, 82 browser cases, and user review pass | HIGH | F-012, F-020, F-021 |
| F-023 | S2 | P4 | Authentication and onboarding | P0 | IN_PROGRESS | 70% | VALIDATE | Codex | Slice 1 manually accepted; live Firebase client configured locally and verified without creating users; Auth Emulator integration executed (1/1 PASS, 2026-08-02); live auth-flow QA pending (needs Email/Password enabled in console); server-session, deletion, and onboarding are out-of-scope P6 successors | CRITICAL | F-010, Firebase Authentication enablement |
| F-024 | S2 | P4 | Preferences, follows, bookmarks, and history | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Persistence, privacy, locale, and E2E tests required | HIGH | F-023, F-034 |
| F-031 | S2 | P5 | Editorial dashboard visual implementation | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Light/dark screenshots, E2E, and accessibility required | HIGH | F-012, F-030 |
| F-032 | S2 | P5 | Editorial review and publishing workflow | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | RBAC, review, correction, audit, and E2E tests required | CRITICAL | F-030, F-034 |
| F-033 | S2 | P5 | Source, coverage, user, and media administration | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Permission, validation, empty/error, and audit tests required | CRITICAL | F-030, F-034 |
| F-030 | S2 | P6 | Server-side RBAC and Firebase rules | P0 | IN_PROGRESS | 45% | BUILD | Claude | Slices 1a–1b done: RBAC model, Workers JWKS session verification, authorize()/RoleProvider seam; 24 F-030 tests. 1c Firebase Security Rules + Slice 3 route enforcement next | CRITICAL | F-023, data model |
| F-034 | S2 | P6 | Firebase repositories, indexes, and storage boundaries | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Emulator, schema, index, storage, and integration tests required | CRITICAL | F-030 |
| F-035 | S2 | P6 | Emulator fixtures, migrations, backup, and rollback | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Fictional fixtures and recovery evidence required | HIGH | F-034 |
| F-040 | S3 | P7 | Rights-aware ingestion adapters | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Rights, provider failure, and integration tests required | CRITICAL | F-034 |
| F-041 | S3 | P7 | Normalization, deduplication, and geography detection | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Schema, dedupe, locale, and fairness tests required | HIGH | F-040 |
| F-042 | S3 | P7 | Ingestion jobs, retries, observability, and cost controls | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Retry, dead-letter, timeout, load, and cost evidence required | HIGH | F-040, F-041 |
| F-050 | S3 | P8 | Event clustering and merge/split controls | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Edge, multilingual, follow-up, and regression tests required | HIGH | F-041, embeddings |
| F-060 | S3 | P9 | Structured multi-source summaries | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Schema, malformed-output, red-team, and editorial tests required | CRITICAL | F-050, LLM seam |
| F-061 | S3 | P9 | AI provider seams, prompts, review, and cost audit | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Provider fallback, audit, cost, and approval tests required | CRITICAL | F-060 |
| F-070 | S3 | P10 | Rights-cleared video and audio workflow | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Integration, accessibility, rights, review, and E2E tests required | HIGH | F-032, F-060 |
| F-071 | S4 | P11 | Newsletters, alerts, and notification preferences | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Consent, retry, preference, and integration tests required | HIGH | F-024, F-034 |
| F-072 | S4 | P11 | Plans, entitlements, and payment provider seam | P1 | NOT_STARTED | 0% | SCOPE | Unassigned | Webhook, authorization, failure, and billing tests required | CRITICAL | F-023, F-034 |
| F-080 | S4 | P12 | Corrections, disclosures, and public trust flows | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | E2E, audit, editorial, and legal review required | CRITICAL | F-032 |
| F-081 | S4 | P12 | Accessibility, localization, and geographic fairness | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | WCAG, locale, timezone, translation, and fairness tests required | CRITICAL | All user-facing phases |
| F-082 | S5 | P13 | Analytics, security, performance, reliability, and cost gates | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | E2E, security, performance, observability, and cost evidence required | CRITICAL | P0-P12 |
| F-090 | S5 | P14 | Production release gate | P0 | NOT_STARTED | 0% | SCOPE | Unassigned | Release report, environments, backup, rollback, smoke, and approvals required | CRITICAL | All P0/P1 work |

## Feature implementation card

### F-014 Marketing homepage visual implementation

- Phase / epic: Phase 2 marketing website
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: implement the approved marketing homepage panel as a responsive, accessible light/dark experience.
- User and business value: give prospective users a clear, trustworthy explanation of NyaVista and a direct path into the truthful demo experience.
- In scope: marketing header and navigation, approved hero hierarchy, product-principle cards, transparent demo disclosure, primary/secondary calls to action, theme interaction, and responsive visual evidence.
- Out of scope: F-017 marketing route expansion, legal pages, pricing, forms, newsletter delivery, production SEO/canonical URLs, authentication, persistence, live news, providers, and deployment.
- Dependencies: F-011 and F-012 complete and user-approved.
- Files/components/services affected: `app/page.tsx`, `app/globals.css`, visual and rendered-output tests, visual baselines, tracker, and handoff.
- Data/schema/migration impact: none; static fictional presentation only.
- Provider and environment impact: none; no external calls, credentials, or new packages.
- Rights/privacy/security impact: rights-safe CSS artwork only; no personal data, publisher assets, or privileged behavior.
- Accessibility/localization/geographic-fairness impact: semantic landmarks, visible focus, keyboard/touch controls, reduced motion, no overflow, English-only copy; global/country-neutral positioning preserved.
- Mockup panel(s) used: Marketing Homepage (Desktop), light and dark; shared colors, typography, chips, buttons, and cards strip.
- Visual baseline path/version/hash: `docs/design/nyavista-ui-mockup-light-dark.png`; repository baseline `6265a47`.
- Required themes/breakpoints: light/dark at 390×844, 768×1024, 1440×1000, and 1920×1080.

#### STABLE record

- Framework path and version/commit: `STABLE_FRAMEWORK.md` and directly required `STABLE_AI_CODING_SKILL.md`, baseline commit `6265a47`.
- Pre-coding steps completed: required repository documents read; clean feature-branch worktree and existing UI/tests inspected; Phase 1 closure and explicit Phase 2/F-014 approval confirmed; applicable mockup panels compared; scope, exclusions, risks, acceptance, verification, and rollback defined.
- Scope/Think: create the smallest visual-only marketing enhancement inside the existing demo shell and reuse semantic tokens/components; keep workspace and later routes intact.
- Assess Risk: protect truthfulness, responsive navigation, light/dark contrast, keyboard access, existing tracker/editorial surfaces, and the committed screenshot matrix.
- Build: added a dedicated marketing surface with semantic header/navigation/main/footer, specification-aligned headline, truthful demo disclosure, responsive hero, rights-safe abstract mosaic, reusable principle cards, product promise, theme control, and demo-workspace entry while preserving all Phase 1 surfaces.
- Validate: ESLint PASS; strict TypeScript PASS; production build PASS; 6/6 Node tests PASS; 32/32 light/dark screenshots and 38/38 Playwright visual/interaction cases PASS at all four breakpoints. Browser cases reject overlays, console errors, failed resources, and horizontal overflow.
- Evolve: desktop and mobile baselines were manually compared with the approved marketing panel. Calm editorial hierarchy, split hero, compact navigation, restrained borders/depth, principle cards, and theme identity align. CSS abstract art intentionally replaces generated photography for content-rights safety; the specification-mandated headline replaces incidental mockup copy; mobile collapses navigation and stacks content for usability.
- Acceptance criteria: approved hierarchy and design language; truthful demo labeling; functional CTA/navigation/theme controls; semantic landmarks and headings; no horizontal overflow or failed resources; visual evidence for both themes and all required breakpoints; all repository gates pass.
- Rollback: revert the focused F-014 UI/test/documentation changes and restore the prior marketing/briefing baselines; no migration or external state exists.
- Acceptance result: all criteria satisfied; F-014 is complete. F-017 and Phase 2 completion remain separately gated.

### F-017 Marketing routes, legal shells, and SEO

- Phase / epic: Phase 2 marketing website
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: provide the specified marketing information architecture, truthful legal/trust shells, and safe SEO/canonical infrastructure.
- In scope: 24 typed single-segment marketing/trust routes, shared responsive shell, per-route metadata, legal/editorial review warnings, internal navigation, `robots.txt`, conditional sitemap/canonical URLs, tests, responsive evidence, and setup documentation.
- Out of scope: finalized legal advice, invented contacts/domain/prices, forms or data collection, localized routes/`hreflang`, production indexing, analytics, authentication, providers, persistence, publishing, or deployment.
- Dependencies: F-010 and F-014 complete.
- Data/provider/migration impact: none; static configuration and presentation only; no provider, credential, database, or migration.
- Security/rights/privacy/editorial: no personal data or submissions; legal shells explicitly non-operative and review-required; rights, source, AI, correction, recommendation, and community principles remain truthful development drafts.
- Accessibility/i18n/fairness: semantic landmarks, headings, navigation, notices, visible focus, native controls, reduced motion, light/dark, responsive containment; English-only; consistent country-neutral language.
- Mockup panels: Marketing Homepage light/dark and shared typography/cards/buttons; trust routes extend that system because no separate legal-page panel exists.
- Baseline: `docs/design/nyavista-ui-mockup-light-dark.png`, implementation baseline `d1f2405`; required 390×844, 768×1024, 1440×1000, and 1920×1080 in both themes.

#### STABLE record

- Scope/Think: preserved F-014 and modeled all named marketing plus required trust routes through one typed registry and one shared shell rather than duplicated pages.
- Assess Risk: blocked fictional legal/domain/contact/pricing claims; required visible review notices; validated HTTPS origin before canonical/sitemap output; retained global `noindex`; planned unknown-route 404 and route/render checks.
- Build: added route registry, dynamic route metadata/rendering, responsive information shell, real marketing navigation, review-state legal content, fail-safe robots/sitemap behavior, configuration tests, server route tests, README setup guidance, and representative trust screenshots.
- Validate: ESLint PASS; strict TypeScript PASS; production build PASS; 10/10 Node tests PASS; `/robots.txt`, `/sitemap.xml`, `/product`, `/terms`, and `/recommendation-methodology` return 200; 40/40 baselines and 50/50 Playwright cases PASS with console/resource/overlay/overflow guards.
- Evolve/visual comparison: representative privacy shell reviewed in light desktop and dark mobile. It preserves F-014 typography, compact navigation, restrained borders/depth, cards, and theme identity. Legal copy uses wider reading proportions rather than the image-led homepage; mobile stacks notices/cards. Static anchors intentionally replace `next/link` because vinext 0.0.50 produced a duplicate-React hydration error; full-page navigation is the tested progressive-enhancement fallback.
- Canonical behavior: `NEXT_PUBLIC_SITE_URL` must be a clean HTTPS origin; without it, canonical URLs are omitted, sitemap is empty, and robots disallow all crawling. No domain is invented.
- Known limitations: qualified legal/editorial/privacy/accessibility review, verified public contacts, localized routes/`hreflang`, production origin, indexing approval, forms, analytics, and full Phase 12 trust workflows remain future gated work.
- Rollback: revert route/config/shell/SEO/test/docs files and eight trust baselines; no migration or external state.
- Acceptance result: required route shells and safe SEO infrastructure are implemented and verified; F-017 is complete.

### F-020 Global/country/region feed architecture

- Phase / epic: Phase 3 public demo product
- Status / owner: DONE / Codex
- Approved outcome: establish the provider-neutral geography and feed-selection domain required before building the public feed and story UI.
- In scope: global, country, and region feed scopes; ISO country identifiers; stable region identifiers; schema validation at trust boundaries; deterministic scope matching; explicit separation of commercial market priority from editorial eligibility; fictional test fixtures; focused documentation.
- Out of scope: live providers, ingestion, ranking/recommendation scoring, persistence, Firebase, user personalization, routes or new UI, story/source domain entities, automatic geography detection, translation, and F-021/F-022 work.
- Dependencies: F-010 typed product configuration; written geography-neutrality and ISO requirements.
- Acceptance criteria: valid global/country/region scopes parse consistently; malformed and mismatched inputs fail safely; country and region matching is deterministic; subject taxonomy remains separate; commercial priority cannot admit, reject, boost, or suppress feed candidates; Togo and other non-priority countries use the same model and behavior as priority markets.
- Risks / mitigations: geographic bias or hidden priority leakage — make the selection contract geography-only and prove invariance in tests; premature data modeling — keep this slice provider-neutral and free of persistence; unbounded feeds — expose a validated bounded page-size contract for later repositories.
- Verification plan: lint, strict TypeScript, focused Node unit tests including validation failures and market-priority invariance, existing Node regression suite, and production build. No visual comparison is applicable because this item changes no UI.
- Migration / rollback: no data migration or external state. Revert the focused domain module, tests, dependency/lock changes if required, and this evidence record.

#### STABLE record

- Scope/Think: root `STABLE_FRAMEWORK.md`, constraints, product specification, tracker, README, existing product configuration, and current tests inspected; Phase 2 closure and F-020 continuation approved 2026-08-02.
- Assess Risk: geography fairness, taxonomy coupling, malformed identifiers, commercial-priority leakage, pagination bounds, future provider coupling, and regression risk identified before coding.
- Build: added a provider-neutral geography domain in `lib/geography.ts` with Zod schemas for ISO country codes, stable region IDs, discriminated global/country/region scopes, bounded feed requests, validated candidates, deterministic scope matching, and order-preserving bounded selection. Added fictional tests in `tests/geography.test.ts`; no UI, route, persistence, or provider was introduced.
- Validate: 4/4 focused geography/fairness tests and 14/14 complete Node tests PASS; ESLint PASS; strict TypeScript PASS; vinext production build PASS on 2026-08-02. Visual comparison is not applicable because no UI changed; the existing 50-case visual suite was unaffected and not regenerated.
- Evolve: provider and repository layers can consume the validated `FeedRequest` contract later; ranking remains deliberately absent until a separately approved, explainable policy exists. Subject IDs remain an independent candidate dimension and do not affect geography matching.
- Acceptance result: all F-020 criteria satisfied. Togo (`TG`), Canada (`CA`), Japan (`JP`), and a global fixture use the same candidate contract; tests prove commercial-market configuration is not an input to selection. F-020 is complete.
- Files changed: `lib/geography.ts`, `tests/geography.test.ts`, `package.json`, `pnpm-lock.yaml`, `PRODUCT_TRACKER.md`, and `CLAUDE_HANDOFF.md`.
- Security/editorial/legal: strict validation rejects malformed or excessive boundary data; no credentials, personal data, publisher content, rights decisions, live reporting, ranking claims, or external calls.
- Accessibility/i18n/geographic fairness: no UI or screen-reader surface changed; ISO country codes and geography-neutral region slugs are locale-independent identifiers; non-priority countries receive identical matching behavior; translations and localized names remain out of scope.
- Migration/rollback: no migration or external state. Revert the focused module, tests, Zod dependency/lock update, and evidence records.
- Next approval required: review F-020. F-021 is the next dependency-ordered Phase 3 item and remains separately gated.

### F-021 News feed and story experience

- Phase / epic: Phase 3 public demo product
- Status / owner: DONE / Codex
- Approved outcome: turn the current briefing preview into a coherent, responsive public demo feed and story-detail experience aligned with the approved desktop feed/detail panels.
- In scope: typed fictional story fixtures validated at the domain boundary; global and country feed controls consuming F-020; feature and compact story cards; trending/context rail; story detail with why-it-matters, key points, source register, timeline, uncertainty/disclosure states; working back/open interactions; both themes and mobile/tablet/desktop/large-desktop verification.
- Out of scope: live news/providers, ingestion, real publisher links or media, search, video/audio playback, personalization, bookmarks/sharing persistence, authentication, ranking/recommendations, comments, production routes/SEO, and F-022.
- Mockup panels: “News Home Feed (Desktop)” and “Story Detail (Desktop)” in light/dark; mobile behavior adapts their hierarchy using the existing responsive shell because the dedicated mobile panel is reserved for F-022.
- Acceptance criteria: feed controls visibly and deterministically filter fictional stories by geography; opening a card renders the matching detail and returning preserves the shell; content is explicitly non-live and AI-assisted/demo; geography, category, time, source count, why/context, key points, source records, timeline, and uncertainty are visible; semantic controls and focus states work; no failed resources, overlays, console errors, or horizontal overflow; all repository gates pass.
- Risks / mitigations: accidental live/editorial claims — prominent demo disclosure and fictional source labels; geographic bias — consume F-020 only and avoid ranking; rights — CSS-generated art and no external publisher assets; dense detail on small screens — responsive stacking and overflow checks; regression — preserve tracker/editorial/marketing views and extend existing Playwright coverage.
- Verification plan: focused story-schema/domain tests, rendered-source checks, Playwright interactions and screenshots in both themes at four breakpoints, lint, strict TypeScript, complete Node suite, production build, and manual comparison against the two approved panels.
- Migration / rollback: no migration, provider, credential, or external state. Revert the focused story module, feed/detail UI and CSS, tests/baselines, and delivery records.

#### STABLE record

- Scope/Think: root framework and required repository documents reviewed; F-020 dependency complete; current feature-branch UI/tests inspected; Next.js App Router skill and relevant routing/RSC/data/metadata/error guidance read; approved feed/detail panels inspected; F-021 explicitly approved by “Next” on 2026-08-02.
- Assess Risk: truthfulness, source rights, geography fairness, responsive density, keyboard semantics, theme parity, schema failures, and regression to existing workspace surfaces assessed before coding.
- Build: added `lib/stories.ts` with strict Zod-validated fictional story/source/timeline records; generalized F-020 selection over validated domain extensions without weakening its strict base projection; replaced the briefing preview with geography controls, feature/compact cards, trending/transparency rail, and honest empty-state support; added an in-shell story detail with context, key points, uncertainty, timeline, and fictional source register.
- Validate: 3/3 story tests and 17/17 complete Node tests PASS; ESLint PASS; strict TypeScript PASS; vinext production build PASS; 48 committed light/dark baselines and 62/62 Playwright visual/interaction cases PASS across 390×844, 768×1024, 1440×1000, and 1920×1080. Browser cases cover Togo filtering, story open/back, disclosure/source states, console/resource/overlay failure guards, and horizontal overflow.
- Evolve/visual comparison: the desktop feed preserves the approved feature-story/compact-list/context-rail hierarchy; the story view preserves large editorial headline, section navigation, context/key-point panels, source rail, and restrained semantic color. Mobile stacks detail panels and keeps section navigation horizontally available. CSS-generated abstract art intentionally replaces publisher imagery; dedicated mobile feed/video behavior remains F-022.
- React/Next.js review: no async client component, data waterfall, non-serializable boundary, external fetch, inline component, unnecessary effect, or heavy dependency was introduced. Derived feed selection remains synchronous over four demo records and is not prematurely memoized.
- Acceptance status: automated and manual implementation evidence is complete; user completed the guided feed/filter/story/back/theme/responsive review and accepted F-021 on 2026-08-02.
- Files changed: `lib/stories.ts`, `lib/geography.ts`, `app/page.tsx`, `app/globals.css`, `tests/stories.test.ts`, `tests/rendered-html.test.mjs`, `tests/visual-regression.spec.ts`, briefing/story baselines, baseline README, `package.json`, `PRODUCT_TRACKER.md`, and `CLAUDE_HANDOFF.md`.
- Security/editorial/legal: strict story/source validation; no external links, publisher names/assets, live claims, credentials, personal data, ranking, provider calls, or publishing behavior. Demo and uncertainty disclosures are prominent.
- Accessibility/i18n/geographic fairness: semantic headings/articles/asides/navigation, native pressed-state filters, descriptive open/back controls, visible focus inheritance, touch-sized controls, reduced-motion inheritance, and responsive no-overflow evidence. English-only labels remain a documented limitation; Togo and priority markets use the identical F-020 selection path.
- Migration/rollback: no migration or external state. Revert the focused module, generic selector extension, UI/CSS/tests/baselines, package script, and evidence records.
- Next approval required: F-022 search, mobile feed, and demo media remains separately gated. Do not begin it without approval.

### F-022 Search, mobile feed, and demo media

- Phase / epic: Phase 3 public demo product
- Status / owner: DONE / Codex
- Approved outcome: complete the Phase 3 public-demo interaction layer with searchable fictional stories, touch-first mobile feed treatment, and a truthful rights-safe vertical media briefing.
- In scope: client-side keyword/category/country filtering over validated F-021 fixtures; query clearing and honest empty results; working search navigation; mobile-first feed navigation/treatment; one CSS-generated vertical demo briefing with play/pause state, progress, captions/transcript, mute state, disclosure, fallback/unsupported messaging, and open-story action; light/dark and four-breakpoint evidence.
- Out of scope: live search index/API, remote media, uploads, transcoding, streaming, autoplay, downloads, personalization, saved state, analytics, accounts, recommendations, publisher imagery, production routes/SEO, and later rights-cleared media pipeline F-070.
- Mockup panels: “Vertical Video (Mobile)” and “Personalized Feed (Mobile)” in light/dark, plus shared media controls. “Personalized” is adapted to a non-personal local demo because no account/preferences exist.
- Acceptance criteria: search opens from visible navigation, filters validated demo stories deterministically, clears, and shows honest empty state; mobile feed remains touch-friendly with no overflow; media preview controls expose accessible play/pause, mute, progress, captions/transcript, disclosure, fallback, and story-opening behavior without claiming playback/provider connectivity; both themes and required breakpoints pass visual/interaction checks.
- Risks / mitigations: fake functionality — label preview simulation and unsupported/live states; media rights — CSS art and no assets; inaccessible custom controls — native buttons, labels, state attributes, transcript; over-filtering or geography bias — search only fixture fields and reuse validated country codes; regression — extend existing matrix and preserve prior views.
- Verification plan: focused search/media source assertions; Playwright search, empty, media-control, open-story, theme, overflow, resource/console/overlay checks; new search/media screenshots across both themes and four breakpoints; lint, strict TypeScript, complete Node tests, build, and manual mockup comparison.
- Migration / rollback: no migration, provider, credential, storage, or external state. Revert the focused UI/CSS/tests/baselines and delivery records.

#### STABLE record

- Scope/Think: root framework and required sources previously active and rechecked for F-022; F-020/F-021 complete; current branch/UI/tests inspected; Next.js skill and RSC/data/image guidance read; approved mobile feed/video and shared-control panels inspected; “Next” explicitly approved F-022 on 2026-08-02.
- Assess Risk: truthfulness, media rights, accessibility, mobile overflow, touch targets, search determinism, empty/fallback states, and regression assessed before coding.
- Build: added a client-local Search view with keyword, category, and ISO-country filters over validated F-021 records; clear and honest empty-result states; working topbar and mobile navigation. Added a rights-safe vertical media simulation with CSS art, explicit no-stream/fallback disclosure, play/pause, mute, progress, captions/transcript, and related-story action. Added a mobile-only Feed/Search/Media dock.
- Validate: 17/17 Node tests PASS; ESLint PASS; strict TypeScript PASS; vinext production build PASS; 64 committed baselines and 82/82 Playwright visual/interaction cases PASS across light/dark at 390×844, 768×1024, 1440×1000, and 1920×1080. Tests cover search match/empty/clear, media navigation, play/pause, mute, captions, transcript, related-story opening, console/resource/overlay guards, and horizontal overflow.
- Evolve/visual comparison: search adapts the approved personalized-feed density without implying an account or personalization; the mobile media view follows the approved full-height vertical composition and shared media-control character. Manual review caught and corrected the fixed dock obscuring lower media controls; the final mobile composition keeps disclosure, headline, progress, controls, and dock visible. CSS art intentionally replaces video/publisher imagery.
- React/Next.js review: no async client component, external fetch, route handler, server action, remote image, `<img>`, `<video>`, autoplay, effect, listener, data waterfall, or new heavy dependency. Derived filtering over four validated fixtures remains simple and intentionally unmemoized.
- Acceptance status: automated and manual implementation evidence is complete; user completed the guided search/mobile/media review and accepted F-022 on 2026-08-02.
- Files changed: `app/page.tsx`, `app/globals.css`, `tests/rendered-html.test.mjs`, `tests/visual-regression.spec.ts`, search/media and affected tracker/feed baselines, baseline README, `PRODUCT_TRACKER.md`, and `CLAUDE_HANDOFF.md`.
- Security/editorial/legal: no query leaves the browser or persists; no real publisher/media/source asset, provider, credential, personal data, analytics, stream, download, or live claim. Fallback and AI-assisted/no-stream status are visible.
- Accessibility/i18n/geographic fairness: labeled search input/selects, native controls, live result count, status empty state, pressed/expanded media states, labeled progress, transcript, touch targets, keyboard focus inheritance, reduced motion, and no-overflow evidence. Search treats Togo and priority markets identically; English-only copy remains a limitation.
- Migration/rollback: no migration or external state. Revert the focused UI/CSS/tests/baselines and evidence records.
- Next approval required: Phase 3 is closed. Phase 4 authentication/personalization remains unapproved and must not begin without explicit authorization.

### F-018 Approved logo integration and cross-app visual refinement

- Phase / epic: Phase 2 shared brand refinement, explicitly approved before continuing Phase 4
- Status / owner: IN_REVIEW (80%) / Codex
- Approved outcome: make the current application screens feel more refined and brand-specific using the detailed and simplified logo assets already approved under `docs/design`, without reverting or changing feature behavior.
- In scope: centralized dimension-stable logo component; simplified transparent wordmark in marketing, trust, and workspace navigation; detailed logo as a luminous marketing-hero brand card; shared canvas depth, sidebar treatment, elevation, header typography, button/card motion, and mobile-first crop/stack rules.
- Out of scope: route redesign, content/data changes, Firebase behavior, tracker logic, new imagery, Analytics, deployment, component-library replacement, screenshot regeneration, and feature-scope changes.
- Assets: `docs/design/Detailed-Logo.png` (1254×1254, opaque white canvas) and `docs/design/NyaVista-Logo-simplified.png` (1536×1024, transparent canvas). The white detailed asset is intentionally contained in a light brand card; the transparent simplified asset uses a shared responsive crop.

#### STABLE record

- Scope/Think: user explicitly approved the pre-F-023 UI refinement; root STABLE, constraints/specs, working tree, mockup, shared shell, every logo callsite, both source assets, dimensions/alpha, and Next.js image/RSC guidance inspected before implementation. Existing-site design guidance confirmed preservation of the current architecture and package manager.
- Assess Risk: raster canvas/background behavior, dark-theme boxes, wordmark legibility, image distortion, LCP/layout shift, mobile clipping, duplicated branding, behavior regression, motion accessibility, and baseline cost assessed. Central component, `next/image`, fixed aspect containers, reduced-motion overrides, and shared breakpoints mitigate these risks.
- Build: added `BrandLogo` with detailed/wordmark variants; copied exact source assets into `public/brand` as runtime files; replaced provisional letter marks across marketing, trust, and workspace headers; layered the detailed asset over the existing rights-safe hero mosaic; refined semantic canvas depth, sidebar gradient, header hierarchy, surface elevation, interactions, and breakpoint-specific sizing without changing feature state or handlers.
- Validate: strict TypeScript PASS; ESLint PASS; vinext production build PASS; complete Node suite 20/20 PASS; focused render/brand regression 4/4 PASS. User review exposed vinext optimizer HTTP 500 responses for imported docs assets; the shared component now retains `next/image` dimensions/semantics with `unoptimized` direct public paths. Root and both logo URLs return 200 with correct byte lengths, no optimizer URL remains, and no framework overlay is present. `git diff --check` PASS. Per explicit user request, no Playwright screenshot test or baseline update was run.
- Evolve/visual deviation: the approved mockup did not contain these final raster logo files. The detailed opaque asset is treated as a deliberate luminous hero card rather than forced into dark navigation; the transparent simplified wordmark is cropped consistently for compact headers. Mobile-first rules at 800, 760, and 480px preserve navigation width and hero proportions; final visual/manual responsive acceptance remains the user gate.
- Security/rights/accessibility: repository-owned supplied assets only; no external requests or tracking. Logo links retain accessible “NyaVista home” names, redundant wordmark imagery is decorative, the detailed hero image has descriptive alt text, focus behavior remains unchanged, and hover motion is removed under reduced-motion preference.
- Migration/rollback: no data/provider migration. Revert `app/brand-logo.tsx`, `public/brand/*`, focused page/header markup, CSS refinement, tests, and delivery records. Original feature logic remains untouched.
- Next approval: user manually reviews marketing home, one trust route, workspace sidebar, account, tracker, and editorial screens in light/dark at mobile and desktop. Screenshot regression remains deferred until explicitly approved.

### F-023 Authentication and onboarding

- Phase / epic: Phase 4 authentication and personalization
- Status / owner: IN_PROGRESS (70%) / Codex
- Approved outcome: establish a truthful Firebase identity foundation and accessible account entry without unlocking protected or persisted capabilities prematurely.
- In scope: modular Firebase Web SDK seam; strict required public configuration; optional local Auth Emulator URL; email/password sign-in, registration, verification request, and enumeration-resistant recovery; account navigation; disabled setup state; onboarding/security boundaries; setup documentation; unit and visual evidence.
- Out of scope: Firebase project creation or console changes, Admin credentials, verified server cookies/sessions, RBAC, Security Rules, social providers, MFA, account deletion, persisted profiles/preferences, protected routes, production deployment, and F-024/F-030.
- Dependencies: F-010 and valid Firebase web configuration. The prior F-023→F-030 dependency was circular because F-030 already consumes F-023 identity; F-030 remains the authorization/security-rules successor.
- Acceptance status: Slice 1 fail-closed configuration, navigation, accessibility, and responsive UI were manually accepted by the user. Live Firebase client configuration is now loaded locally and the browser verifies the configured state and enabled sign-in action with no console errors. The Auth Emulator integration test is now executed and passing (2026-08-02). Live account operations remain incomplete pending manual QA; server authorization, account deletion, and onboarding persistence remain out-of-scope P6 successors.

#### STABLE record

- Scope/Think: root framework and required repository sources remained active and were rechecked; F-023 approval was explicit through “Next”; current UI, package manager, environment state, tracker dependencies, Next.js boundaries, official Firebase modular/Auth Emulator guidance, and approved shared design system were inspected before coding.
- Assess Risk: circular dependency, fake signed-in state, leaked Admin credentials, client-auth/authorization confusion, account enumeration, inaccessible forms, provider failure, responsive overflow, and regression were assessed. The feature fails closed when configuration is absent and never grants product authorization.
- Build: installed Firebase 12.17.0 through pnpm; added a Zod-validated client configuration and dynamically loaded modular Auth operations; added optional emulator routing, generic errors and recovery copy, email verification request, account/settings navigation, responsive sign-in/register/reset UI, explicit onboarding and F-030 security boundaries, `.env.example`, README guidance, and focused tests.
- Validate: 2/2 focused auth tests and production build PASS; strict TypeScript and ESLint PASS; 8 new account screenshots generated; 94/94 Playwright visual/interaction cases PASS across light/dark and 390×844, 768×1024, 1440×1000, and 1920×1080. Visual inspection confirms shared token/card/type hierarchy and no horizontal overflow.
- Evolve/deviations: no dedicated auth mockup panel exists, so the account surface intentionally reuses the approved shared shell, serif hierarchy, cards, semantic status color, themes, and breakpoints. Mobile stacks tabs/cards and remains vertically scrollable. Real login is intentionally unavailable until configuration is supplied.
- Slice 2 evidence: installed and documented Firebase CLI/Auth Emulator support using a reserved `demo-*` project, loopback-only ports, disposable fixtures, and registration/verification/denial/sign-in/recovery integration coverage. The user supplied live Firebase web configuration, which is stored only in ignored `.env.local`; Analytics remains excluded pending consent/measurement scope. The app was restarted and read-only browser verification confirmed “Firebase client configured,” enabled sign-in, and zero console errors without creating a live user. Playwright now runs on isolated port 3100 with Firebase variables blank so regression tests cannot contact the live project.
- Slice 3 evidence: executed `pnpm test:auth:emulator` on 2026-08-02 (Java 17, firebase-tools 15.25.1, Node 22.18). The disposable `demo-nyavista` Auth Emulator started on loopback 9099, ran `tests/auth-emulator.test.ts`, and shut down cleanly; 1/1 Node test PASS proving registration, email verification, duplicate `EMAIL_EXISTS` rejection, denied sign-in, valid sign-in, and password recovery. The test reads `FIREBASE_AUTH_EMULATOR_HOST` and calls the emulator REST endpoint with `demo-key`, so it never loads `.env.local` and cannot reach the live Firebase project. No source changed; prior lint/type/build/visual gates remain valid.
- Security/privacy/editorial/fairness: only Firebase public web identifiers are documented; Admin credentials are explicitly prohibited. Inputs are not persisted locally by this slice. Generic failure/recovery messages reduce enumeration disclosure. Identity grants no editorial privilege. Locale/country interests are named but not collected, ranked, or persisted.
- Migration/rollback: dependency and lockfile only; no database or external migration. Revert `lib/auth.ts`, account UI/CSS/tests/baselines, `.env.example`, README/package changes, and delivery records.
- Next approval/unblock: the Auth Emulator integration test is executed and passing (2026-08-02), closing that gap. The one remaining in-scope item is manual live QA — exercise live registration, email verification, sign-in, recovery, and denial states after enabling Email/Password in Firebase Authentication (a console action the agent cannot perform). After that, F-023 is ready to mark DONE. Do not begin F-024 or treat client identity as authorization; server session/RBAC is the F-030 (Phase 6) successor and needs separate phase-gate approval.

### F-030 Server-side RBAC and Firebase rules

- Phase / epic: Phase 6 persistence and security
- Status / owner: IN_PROGRESS (45%) / Claude
- Approved outcome: enforce authorization on the server so unauthorized access is denied in both UI and backend; deliver in slices — 1a RBAC domain model, 1b Cloudflare Workers session verification + `authorize()`, 1c Firebase Security Rules.
- In scope (Slice 1a, delivered): typed RBAC vocabulary in `lib/rbac.ts` — the seven spec §6 roles, a composed permission matrix, `hasPermission`/`permissionsForRole`/`isRole`, and focused unit tests. Pure and side-effect-free.
- In scope (Slice 1b, delivered): server-only Firebase ID-token verification in `lib/server-session.ts` (RS256 JWT validated against Google JWKS via Web Crypto; fail-closed; injectable key resolver + cache-aware production resolver + bearer-token reader) and authorization in `lib/authz.ts` (`authorize`/`requirePermission`/`authorizeSession`, `RoleProvider` seam with a least-privilege default and a verified-custom-claims provider).
- Out of scope (still): route/handler wiring and protected routes (Slice 3), Firebase Admin SDK (unsuitable on Workers), Firestore/Storage Rules (Slice 1c), and role persistence/assignment (F-034 / F-033).
- Dependencies: F-023 identity; F-034 will later back the role store. Authorization stays decoupled from F-034 via a RoleProvider seam (D-005).
- Acceptance status: Slices 1a–1b complete and verified — `pnpm exec tsc --noEmit`, `pnpm lint`, 24 F-030 tests (`tests/rbac.test.ts` 9, `tests/server-session.test.ts` 10, `tests/authz.test.ts` 5), and full `pnpm test` (build + 43/43 Node) PASS. Verification uses a locally generated RSA keypair, so it needs no network or emulator. Route-level enforcement remains unproven until Slice 3.

#### STABLE record

- Scope/Think: root STABLE, CONSTRAINTS, spec §6 (roles) and §13 (security), the working tree, and the runtime were inspected. The decisive finding is that the app runs on Cloudflare Workers, so the Node-oriented Firebase Admin SDK is unsuitable; the feature was sliced to isolate the pure model (1a) from runtime-bound verification (1b) and Rules (1c). Phase gate approved by the user (D-004).
- Assess Risk: primary risks are privilege escalation, conflating billing tier with staff authority, and hidden-UI-as-authorization. Mitigations: least-privilege defaults deferred to the 1b seam; premium modeled as a separate axis (D-006); explicit note that this matrix is never the sole UI gate; permission-based (not role-rank) checks so the two role axes never need a false linear ordering.
- Build: Slice 1a added `lib/rbac.ts` (seven roles, composed permission sets, `hasPermission`/`permissionsForRole`/`isRole`) and `tests/rbac.test.ts`. Slice 1b added `lib/server-session.ts` (JWT parse, RS256/`alg`/`kid` checks, Web-Crypto signature verify, and `iss`/`aud`/`exp`/`iat`/`auth_time`/`sub` claim validation; injected key resolver; Google JWKS resolver with `max-age` caching and rotation refresh; `readBearerToken`) and `lib/authz.ts` (`RoleProvider` seam, least-privilege and verified-custom-claims providers, `authorize`/`requirePermission`/`authorizeSession`, `AuthorizationError`), plus `tests/server-session.test.ts` and `tests/authz.test.ts`. Tests registered in the `test` script. No enums/namespaces (Node type-stripping); no new dependencies.
- Validate: tsc (strict) and ESLint PASS; 24 F-030 tests assert the RBAC matrix and axes, cryptographic accept/reject paths (expired, future-issued, wrong audience/issuer, missing subject, wrong signing key, unknown kid, `alg:none` downgrade, malformed), bearer parsing, the least-privilege and custom-claims providers, and `AuthorizationError`; full suite 43/43 with production build PASS. Two type-only fixes were needed for the new typed-array generics and `JsonWebKey.kid`.
- Evolve/deviations: premium modeled as a consumer entitlement axis (D-006); server verification uses JWKS + Web Crypto rather than the Firebase Admin SDK, which is unsuitable on Cloudflare Workers (D-005). Both recorded as intentional. Firebase Rules follow in 1c.
- Security/privacy/editorial/fairness: verification is fail-closed and refuses `alg:none`/HS256 downgrades and wrong-key signatures; modules are server-only and introduce no secrets or persistence. The custom-claims provider trusts a role only from an already signature-verified token and otherwise falls back to least privilege. Roles are country-neutral and grant no geographic or editorial privilege by default.
- Migration/rollback: additive only — delete `lib/rbac.ts`, `lib/server-session.ts`, `lib/authz.ts`, and their tests, revert the `package.json` test entries and tracker records. No data or schema migration.
- Next approval/unblock: proceed to Slice 1c — `firestore.rules` and `storage.rules` encoding the same role model, with `@firebase/rules-unit-testing` adversarial tests via the Firestore/Storage emulator (the "emulator when needed" case per D-003). Route-level enforcement of `authorize()` on `/admin/*` and `/settings/*` is Slice 3.

Copy this section for each feature.

```markdown
### [FEATURE-ID] Feature name

- Phase / epic:
- Owner:
- Priority / risk:
- Status:
- Requested outcome:
- User and business value:
- In scope:
- Out of scope:
- Dependencies:
- Files/components/services affected:
- Data/schema/migration impact:
- Provider and environment impact:
- Rights/privacy/security impact:
- Accessibility/localization/geographic-fairness impact:
- Mockup panel(s) used:
- Visual baseline path/version/hash:
- Required themes/breakpoints:

#### STABLE record
- Framework path and version/commit:
- Pre-coding steps completed:
- Implementation checkpoints completed:
- Review steps completed:
- Evidence links/commands/results:
- Deviations and approval:

#### Acceptance criteria
- [ ] Given/when/then criterion 1
- [ ] Failure and empty states
- [ ] Authorization and validation
- [ ] Accessibility and responsive behavior
- [ ] Localization/timezone/geography behavior
- [ ] Analytics/observability where applicable
- [ ] Documentation updated

#### Verification
- [ ] Lint
- [ ] Type check
- [ ] Unit tests
- [ ] Component tests
- [ ] Integration tests
- [ ] E2E tests
- [ ] Security/permission tests
- [ ] Accessibility checks
- [ ] Production build
- [ ] Manual flow verification
- [ ] Applicable mockup panels reviewed
- [ ] Light-theme visual comparison captured
- [ ] Dark-theme visual comparison captured
- [ ] Mobile/desktop breakpoint comparison captured
- [ ] Intentional deviations documented and approved

#### Delivery evidence
- Test/build results:
- Screenshots/logs/reports:
- Known limitations:
- Rollback plan:
- Docs changed:
- Commit/PR:
- Reviewer/approval/date:
```

### F-010 Central brand, metadata, and locale configuration

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P0 / MEDIUM
- Status: DONE
- Requested outcome: finish the central product configuration so identity, demo metadata, initial commercial markets, locale defaults, timezone policy, and locale-aware formatting do not drift across future features.
- In scope: typed immutable product configuration; Next.js root metadata derived from it; truthful no-index demo metadata; ISO initial-market and locale identifiers; supported-locale resolution; locale-aware date/time, number, and currency helpers; UTC canonical-storage guidance; focused unit/render/visual regression tests.
- Out of scope: localized routes, translations, geolocation, user locale persistence, `hreflang`, production canonical URL, sitemap, legal contact values, social handles, runtime market ranking, and Phase 2 marketing implementation.
- Dependencies: F-001; existing `lib/product.ts` and server `app/layout.tsx` boundary.
- Data/schema/migration impact: none.
- Provider/environment impact: none; no production origin is invented.
- Rights/privacy/security impact: no personal information or external assets; demo remains non-indexable.
- Accessibility/localization/geographic-fairness impact: helpers use `Intl`; unsupported locales fall back deterministically; commercial market order remains explicitly separate from editorial importance.
- Mockup panel(s) used: shared design-system/global shell only; no visual redesign planned.
- Visual baseline: existing 24-image F-013 matrix; update only if rendered metadata/configuration changes pixels.
- Required themes/breakpoints: regression replay across both themes and all four established breakpoints.

#### STABLE record

- Framework path and version/commit: `STABLE_FRAMEWORK.md`, repository baseline commit `f902b9d`.
- Pre-coding: required repository instructions, product specification, constraints, tracker, README, current configuration/layout/tests, Next.js skill, and metadata reference reviewed; scope, exclusions, risks, acceptance, test plan, and rollback recorded here before implementation.
- Risks/tests: prevent invented production URLs/contact details; prevent commercial priorities from becoming editorial weights; preserve existing title/description and visuals; test supported/unsupported locale resolution, UTC and explicit timezone formatting, locale-specific numbers/currency, rendered metadata, lint, types, build, and F-013 replay.
- Rollback: revert the focused product/configuration, layout metadata, tests, tracker, and handoff changes; no migration.

#### Acceptance criteria

- [x] Product identity, ownership, positioning, demo disclosure, metadata, commercial markets, locales, and timezone policy are centralized and typed.
- [x] Root metadata is derived from configuration and truthfully prevents indexing of the demo.
- [x] Locale helpers validate/fallback safely and format dates, numbers, and currencies with standard `Intl` behavior.
- [x] Initial market configuration cannot be mistaken for editorial weighting.
- [x] No production origin, contact, social handle, translation, or provider capability is invented.
- [x] Unit/render/static/build/visual gates pass and both delivery records are synchronized.

#### Delivery evidence

- Implementation: immutable typed configuration in `lib/product.ts`; server-only Next.js metadata/viewport export in `app/layout.tsx`; isolated locale/config unit tests in `tests/product-config.test.ts`.
- Rendered metadata: `lang=en-US`, truthful description, E-DEAL EXPRESS LLC publisher, `noindex, nofollow`, `og:locale=en_US`, and light/dark theme colors verified in server HTML.
- Test/build results: ESLint PASS; strict TypeScript PASS; 6/6 Node tests PASS; vinext/Vite production build PASS; 24/24 non-mutating Playwright visual regressions PASS.
- Known limitations: English variants only; user locale/timezone persistence, translation, localized routes, `hreflang`, canonical production origin, sitemap, social/contact values, and cross-browser locale rendering remain future approved work.
- Visual comparison/deviations: no intended pixel changes; all existing approved F-013 baselines pass unchanged before tracker completion data is applied.
- Security/rights/editorial: demo is explicitly non-indexable; no invented URLs, contacts, accounts, providers, personal data, or external assets; commercial markets cannot affect editorial importance through this configuration.
- Accessibility/i18n/geographic fairness: BCP 47 locale identifiers, deterministic fallback, UTC default, explicit timezone override, standard `Intl` behavior, country-neutral policy, and no special-case geography ranking.
- Migration/rollback: no migration; revert `lib/product.ts`, `app/layout.tsx`, the focused tests/config flag, and delivery-record updates.
- Next approval required: review eligible Phase 1 items using F-013 evidence; do not begin F-014 without explicit Phase 2 approval.

### F-011 Approved mockup design tokens

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: translate the approved mockup into one reusable semantic light/dark visual system.
- Scope/evidence: centralized colors, typography, spacing, radii, elevation, focus, reduced motion, and status treatments in `app/globals.css`; shared across briefing, tracker, and editorial surfaces.
- STABLE/mockup review: marketing, public-news, mobile, editorial-dashboard, and shared design-system panels compared in both themes at all four F-013 breakpoints.
- Acceptance: 24 committed baselines and 26 browser tests pass; lint, types, six Node tests, and production build pass; user approved 2026-08-01.
- Intentional deviations: CSS abstract artwork avoids unauthorized photography; real responsive layouts replace presentation-board proportions; WCAG and legibility override incidental sampled values.
- Security/rights/editorial: no external assets or operational claims; demo labels remain explicit.
- Accessibility/i18n/geographic fairness: visible focus, reduced motion, responsive containment, semantic theme contrast; no geography logic changed.
- Migration/rollback: no migration; revert focused token rules and affected baselines.

### F-012 Shared accessible components

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: establish consistent reusable navigation, card, badge, button, metric, panel, progress, and responsive interaction patterns.
- Scope/evidence: current surfaces reuse shared CSS/component patterns; native controls, selected/pressed states, focus visibility, truthful demo states, touch sizing, mobile containment, and light/dark behavior verified.
- Review finding/fix: user reported that mobile/tablet sidebar access was not visible. The ambiguous `N` opener was replaced by an explicit `☰ Menu` control with `aria-controls`/`aria-expanded`, an off-canvas drawer, close control, and dismissible backdrop.
- Encoding correction, 2026-08-02: user evidence showed the NyaVista Home item rendering the mojibake literal `âŒ‚`. Replaced only that glyph with an inline, decorative SVG house using `currentColor`; preserved the label, native button, spacing, theme behavior, and navigation action. Focused source and drawer assertions reject the malformed literal and require one SVG icon.
- Acceptance: user approved 2026-08-01 after the responsive issue; focused drawer tests pass at 390×844 and 768×1024; the full 26-case browser suite, lint, types, Node tests, and build pass.
- Mockup/deviations: compact mobile header follows the mockup’s mobile navigation character while exposing a clearer labeled control for accessibility and discoverability.
- Security/rights/editorial: no privileged behavior or live provider action introduced.
- Accessibility/i18n/geographic fairness: explicit accessible names and relationships; keyboard/touch-operable drawer; English Menu label remains a documented Phase 12 localization concern; no geography logic changed.
- Migration/rollback: no migration; revert the mobile Menu/backdrop rules and associated interaction tests/baselines.

### F-013 Visual-regression workflow

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P1 / HIGH
- Status: DONE
- Requested outcome: establish durable visual evidence for current Phase 1 surfaces in both themes and every required responsive breakpoint.
- In scope: Playwright configuration, deterministic Chrome execution, real navigation/theme interactions, 24 committed PNG baselines, framework-overlay detection, failed-resource detection, console-error detection, horizontal-overflow assertions, reduced-motion emulation, and baseline documentation.
- Out of scope: approving future Phase 2+ interfaces, screen-reader certification, cross-browser baselines, hosted screenshot storage, and automatic PR artifact publication.

#### STABLE record

- Framework path and version/commit: `STABLE_FRAMEWORK.md`, repository baseline commit `f902b9d`.
- Scope/Think: reviewed the Phase 1 tracker gate, current briefing/tracker/editorial surfaces, and applicable marketing, mobile, editorial-dashboard, and design-system mockup panels.
- Assess Risk: rejected command-line Chrome captures after proving Windows used an inaccurate wider CSS viewport; adopted Playwright device emulation and isolated server/browser state instead.
- Build: added Playwright configuration, interaction-driven capture tests, committed baseline matrix, reproducible update/verification commands, artifact ignores, and a narrow mobile tracker containment correction discovered by the first baseline review.
- Validate: 24/24 baseline updates and 24/24 non-mutating regression replays pass. Each case checks expected content/theme, error overlays, failed resources, console errors, and horizontal overflow.
- Evolve: baseline updates require deliberate `pnpm visual:baseline` execution and human comparison with the approved mockup; ordinary verification uses `pnpm visual:test` and cannot rewrite evidence.

#### Acceptance and verification

- [x] Three surfaces: briefing, Project Tracker, and editorial overview.
- [x] Light and dark themes.
- [x] Mobile 390×844, tablet 768×1024, desktop 1440×1000, and large desktop 1920×1080.
- [x] 24 committed PNG baselines under `tests/visual-baselines/`.
- [x] Real navigation and theme controls exercised in every applicable case.
- [x] No framework overlays, failed page resources, actionable console errors, or horizontal document overflow.
- [x] Visual regression: PASS — 24/24, 2026-08-01.
- [x] Lint: PASS — ESLint, 2026-08-01.
- [x] Type check: PASS — strict TypeScript `--noEmit`, 2026-08-01.
- [x] Tests/build: PASS — 3/3 Node tests and vinext/Vite production build, 2026-08-01.

- Visual comparison/deviations: baselines retain the mockup's calm editorial hierarchy, serif/sans pairing, compact dashboard density, light/dark semantic surfaces, and restrained accent system. CSS-generated abstract art remains the documented rights-safe replacement for mockup photography. Presentation-board layouts remain adapted to real responsive viewports.
- Security/rights/editorial: fictional/non-live content only; baseline images contain no credentials, personal data, licensed publisher assets, or publishing controls.
- Accessibility/i18n/geographic fairness: reduced motion, keyboard-driven semantic controls, responsive containment, and both themes covered; English-only and Chrome-only baselines remain documented limitations; no ranking/geographic logic changed.
- Migration/rollback: no data migration. Remove the Playwright files, scripts, baseline directory, and containment rules to revert.
- Next approval required: review and close eligible Phase 1 items; the next unblocked implementation is F-010 metadata and locale helpers. Do not begin F-014 without Phase 2 approval.

### F-015 Living sprint tracker and agent handoff foundation

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: first-pass app shell, MVP-important demo surfaces, organic sprint tracker UI, and living cross-agent handoff.
- In scope: semantic product configuration, shared design tokens, light/dark responsive shell, demo briefing, editorial overview, Markdown-synchronized delivery hierarchy, explicit mobile/tablet Menu drawer, and living handoff documentation.
- Out of scope: database persistence, authentication, ingestion, AI providers, real news, publishing, deployment, and progression into another delivery phase.

#### STABLE record

- Framework path and version/commit: `STABLE_FRAMEWORK.md`, repository commit `f8ab99e`.
- Pre-coding: required documents and approved mockup read; clean documentation-only baseline confirmed; scope, mock/live boundary, visual risks, acceptance criteria, tests, and rollback recorded before app implementation.
- Build: centralized product identity in `lib/product.ts`; semantic tokens and reusable visual patterns; truthful demo labels; keyboard focus; reduced-motion support; responsive mobile navigation.
- Review: marketing, feed/story hierarchy, mobile character, editorial dashboard, and design-system panels compared in light and dark at desktop and 390×844 mobile viewport.
- Visual comparison: calm editorial hierarchy, serif/sans pairing, 12–18px card language, restrained indigo/violet/gold accents, compact dashboard density, source/AI status treatments, and theme-specific surfaces align with the approved direction.
- Intentional deviations: abstract CSS artwork replaces generated mockup photography to avoid unlicensed media; multiple product panels are consolidated into one first-pass workspace; real viewport layouts replace presentation-board proportions; charts and counts are explicitly fictional planning data.

#### Acceptance and verification

- [x] Responsive app shell and three navigable first-pass surfaces.
- [x] Tracker organised by sprint, phase, feature, progress, evidence, dependencies, risks, and STABLE checkpoint.
- [x] Living `CLAUDE_HANDOFF.md` created with ownership, evidence, risks, rollback, queue, and update template.
- [x] Light/dark theme interaction, desktop and mobile responsive review, semantic DOM snapshot, and browser console review (no warnings/errors).
- [x] Lint: PASS — ESLint, 2026-08-01.
- [x] Type check: PASS — strict TypeScript `--noEmit`, 2026-08-01.
- [x] Tests: PASS — 2/2 Node rendered-shell/documentation tests, 2026-08-01.
- [x] Production build: PASS — vinext/Vite, 2026-08-01.
- [x] Automated responsive interaction and visual regression — 26 browser tests, including explicit mobile/tablet drawer behavior.
- [ ] Screen-reader manual certification — deferred to the later accessibility quality gate; semantic and keyboard-focused review completed.

- Security/rights/editorial: no credentials, external calls, publisher marks, real reports, or publishing capabilities. All demo content and operational metrics are visibly fictional/non-live.
- Accessibility/i18n/geographic fairness: WCAG-oriented semantics, focus, reduced motion, touch-sized controls, responsive layout; English copy only; geography visual explicitly separates commercial priority from editorial importance.
- Migration/rollback: no data migration. Roll back by removing the generated application scaffold and reverting this tracker/handoff entry.
- User acceptance: approved 2026-08-01 after the mobile Menu discoverability issue was corrected and verified.
- Next approval required: formal Phase 1 closure decision; do not automatically advance to Phase 2, 3, or 5.

### F-016 Markdown-synchronized delivery hierarchy

- Phase / epic: Phase 1 foundation
- Owner: Codex
- Priority / risk: P0 / HIGH
- Status: DONE
- Requested outcome: make the complete delivery plan visible as Sprint → Phase → Feature → implementation progress and keep the UI synchronized with this file.
- In scope: canonical sprint and feature registers, strict build-time parsing, derived roll-up progress, responsive hierarchy navigation, feature evidence/dependency/risk detail, and STABLE checkpoints.
- Out of scope: editing Markdown from the browser, database persistence, multi-user collaboration, notifications, and progression into another delivery phase.

#### STABLE record

- Framework path and version/commit: `STABLE_FRAMEWORK.md`, repository commit `f902b9d` baseline.
- Scope/Think: audited the 15-phase Markdown roadmap and six-phase hard-coded UI; selected this file as the sole editable delivery source and the approved dashboard/design-system mockup panels as visual direction.
- Assess Risk: fail builds on malformed tables, invalid statuses/progress/checkpoints, duplicate feature IDs, and unknown sprint/phase mappings; keep derived progress distinguishable from live operational data.
- Build: added a watched Vite virtual module, strict parser/types, six sprint groups, all 15 phases, comprehensive feature rows, roll-up metrics, keyboard-operable selectors, semantic progress, light/dark tokens, and responsive layouts.
- Validate/Review: ESLint, strict TypeScript, six Node tests, production build, 24 visual baselines, and 26 browser cases pass. User approved 2026-08-01 after mobile navigation discoverability was corrected.

#### Acceptance and verification

- [x] `PRODUCT_TRACKER.md` contains canonical sprint and feature progress registers.
- [x] UI renders Sprint → Phase → Feature → progress without a duplicated hard-coded roadmap.
- [x] Sprint, phase, and overall percentages derive from child feature progress.
- [x] Invalid hierarchy/status/progress/checkpoint data fails validation during build.
- [x] Feature detail exposes owner, dependency, risk, acceptance/evidence, and current STABLE checkpoint.
- [x] Lint: PASS — ESLint, 2026-08-01.
- [x] Type check: PASS — strict TypeScript `--noEmit`, 2026-08-01.
- [x] Tests: PASS — 2/2 Node rendered-shell/documentation tests, 2026-08-01.
- [x] Production build: PASS — vinext/Vite, 2026-08-01.
- [x] Automated light/dark mobile/tablet/desktop screenshots — 24/24 baselines and non-mutating regression replay pass.

- Security/rights/editorial: local Markdown only; no credentials, providers, publishing, external content, or authorization behavior added.
- Accessibility/i18n/geographic fairness: native buttons, pressed states, labeled progress, visible focus inheritance, reduced-motion inheritance, responsive stacking; English-only tracker labels; no geographic ranking logic.
- Migration/rollback: no data migration. Revert the parser/plugin/UI/register additions to restore the prior static tracker.
- User acceptance: approved 2026-08-01.
- Next approval required: formal Phase 1 closure decision; do not advance beyond the approved Phase 1 foundation.

## Phase 1 closure record

- Phase completed: P1 Foundation/design system, user-approved 2026-08-01 before F-014 authorization.
- STABLE evidence: F-010–F-013 and F-015–F-016 each contain complete scope/build/validate/evolve records, acceptance results, limitations, and rollback notes.
- Acceptance: typed product identity, semantic light/dark tokens, accessible shared components, visual-regression workflow, responsive app shell, living handoff, and Markdown-synchronized tracker are complete and user-accepted.
- Verification at closure: ESLint, strict TypeScript, six Node tests, production build, 24 Phase 1 visual baselines, and 26 Phase 1 browser cases passed; the mobile sidebar discoverability correction is included.
- Security/editorial/rights/accessibility/i18n/fairness: demo-only with no providers, secrets, persistence, or publishing; rights-safe abstract visuals; semantic/focus/reduced-motion/responsive evidence complete; full screen-reader certification and localization remain later gates.
- Migration/rollback: none; focused source and baseline reverts only.
- Approval/next phase: user explicitly approved Phase 1 closure and Phase 2/F-014 on 2026-08-01; no other Phase 2 item was authorized.

## Risk register

| ID | Risk | Area | Likelihood | Impact | Severity | Mitigation | Trigger/indicator | Owner | Status |
|---|---|---|---|---|---|---|---|---|---|
| R-001 | STABLE framework missing/unread | Process | Medium | Critical | CRITICAL | Block coding; locate/read complete framework | No root framework path | — | OPEN |
| R-002 | Unauthorized publisher use | Legal | Medium | Critical | CRITICAL | Rights registry, minimal storage, attribution, review | Unknown rights/full text/media | — | OPEN |
| R-003 | AI hallucination/misattribution | Editorial/AI | High | Critical | CRITICAL | Structured inputs, validation, citations, review, audit | Unsupported claim/quote/source | — | OPEN |
| R-004 | Geographic ranking bias | Product/editorial | Medium | High | HIGH | Separate market priority from importance; coverage analytics | Non-priority suppression | — | OPEN |
| R-005 | Client-only authorization | Security | Medium | Critical | CRITICAL | Server RBAC and Rules tests | Direct API access succeeds | — | OPEN |
| R-006 | Mock presented as live | Trust | Medium | High | HIGH | Visible labels, provider status, truthful docs | UI claims live integration | — | OPEN |
| R-007 | Media cost escalation | Operations | Medium | High | HIGH | Mocks, queues, quotas, cost telemetry | Spend exceeds budget | — | OPEN |
| R-008 | Mockup treated as literal functional specification | UX/product | Medium | High | HIGH | Written requirements and accessibility override incidental image details | Generated placeholder copied as truth | — | OPEN |
| R-009 | Light/dark visual drift | UX | Medium | Medium | MEDIUM | Shared semantic tokens and visual regression | Theme-specific components diverge | — | OPEN |
| R-010 | Responsive divergence from reference | UX/accessibility | Medium | High | HIGH | Breakpoint QA and documented adaptations | Overflow, clipping, unreadable density | — | OPEN |
| R-011 | Orphaned ChatGPT header-auth scaffolding (`app/chatgpt-auth.ts`) retained in tree | Security/maintainability | Low | Low | LOW | Confirmed unreferenced (no import, route, or middleware consumes it) as of 2026-08-02; leave untouched and delete during P14 launch-readiness cleanup. `lib/auth.ts` remains the sole authoritative auth seam | File is imported or wired into a route/middleware, reintroducing a second auth path | — | OPEN |

## Decision log

| ID | Date | Decision | Context/options | Consequences | Approver | Related items |
|---|---|---|---|---|---|---|
| D-001 | YYYY-MM-DD | Example | — | — | — | — |
| D-002 | 2026-08-02 | Adopt GDELT 2.0 and The Guardian Open Platform as the reference live-news ingestion providers | Needed free, rights-compatible sources to demonstrate live data across feeds without drift. Options weighed: GDELT (keyless, global, ~15-min cadence, metadata-only), Guardian (free key, first-party, attribution-licensed full text), plus NYT/Hacker News/aggregators. Chose GDELT for global breadth + streaming/clustering and Guardian for licensed text display; others catalogued as secondary | GDELT emits `metadata-only` (link-out, no stored body); Guardian is the sole `full-text-licensed` source (attribution required). Both implement the `NewsIngestionProvider` seam behind a fail-closed config. Remains a design reference only — build is Phase 7 (F-040/F-041/F-042), gated behind F-034; diverging from these providers or their rights rules requires a new decision entry | User, 2026-08-02 | F-040, F-041, F-042; `docs/architecture/news-ingestion-providers.md` |
| D-004 | 2026-08-02 | Approve the Phase 6 gate to start F-030 (server-side RBAC and Firebase rules) while Phase 4 F-023 awaits live QA | User approved advancing past the P4→P6 gate that AGENTS.md requires. F-030 is the security spine that unblocks F-023 server sessions, F-024, and admin/editorial | F-030 proceeds in slices (1a RBAC model, 1b Workers session verification, 1c Firebase rules); F-034 persistence remains a separate P6 item and is not pulled forward | User, 2026-08-02 | F-030, P6; F-023, F-024, F-034 |
| D-005 | 2026-08-02 | Verify Firebase identity on Cloudflare Workers via JWKS + Web Crypto, behind a fail-closed RoleProvider seam | Runtime is Cloudflare Workers (`nodejs_compat`, RSC in `rsc` env); the Node-oriented Firebase Admin SDK does not run cleanly there. Options: Admin SDK / session cookies (needs a Node service) vs. verifying the RS256 ID token against Google JWKS with `crypto.subtle`. Chose the runtime-native JWKS path | Server session verification uses no Admin SDK and no new heavy deps; roles resolve through a `RoleProvider` interface defaulting to least-privilege (signed-in ⇒ `user`, else `guest`), with the real store deferred to F-034 (Firestore) or Firebase custom claims. Governs F-030 Slice 1b | User, 2026-08-02 | F-030 (Slice 1b); F-034; `lib/auth.ts` |
| D-006 | 2026-08-02 | Model `premium` as a consumer entitlement axis separate from the cumulative editorial/admin staff chain; authorize by permission, not role rank | Spec §6 lists roles as a ladder, but conflating the premium billing tier with staff authority would entangle RBAC with billing (F-072). Options: single linear inheritance vs. two axes | `lib/rbac.ts` composes a staff chain (user → contributor → editor → senior_editor → administrator) and a separate premium branch off `user`; `hasPermission` is permission-based so the axes need no single ordering. Staff access to premium content and billing entitlements stay additive concerns for F-072/F-034 | User, 2026-08-02 | F-030 (`lib/rbac.ts`); F-072 |
| D-003 | 2026-08-02 | Use live Firebase Authentication as the primary auth path; retain the Auth Emulator as a fallback only | Live Firebase web config is wired into ignored `.env.local`. Options: emulator-first vs. live-first. Chose live-first so F-023 completes via real registration/verification/sign-in/recovery QA | The Auth Emulator is no longer the required validation gate; it is retained for local development, offline work, CI without live credentials, and when live Firebase is unavailable. `lib/auth.ts` remains fail-closed and provider-agnostic, so switching between live and emulator is env-only (`NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL`). The 2026-08-02 emulator pass stays valid regression evidence; F-023 DONE now depends on live-flow QA after Email/Password is enabled in the console | User, 2026-08-02 | F-023; `lib/auth.ts`; README Firebase Authentication setup |

## Test and quality dashboard

| Gate | Required command/tool | Last result | Date | Evidence | Blocking issues |
|---|---|---|---|---|---|
| Lint | `pnpm lint` | PASS | 2026-08-01 | ESLint | — |
| Type check | `pnpm exec tsc --noEmit` | PASS | 2026-08-01 | Strict TypeScript | — |
| Unit/component | `pnpm test` | PASS | 2026-08-03 | 43/43 Node tests (config/render/route/geography/stories/auth/rbac/server-session/authz) | — |
| Integration/E2E | `pnpm test:auth:emulator` (auth) | PASS | 2026-08-02 | 1/1 Node test via Firebase Auth Emulator: registration, verification, EMAIL_EXISTS, denied sign-in, sign-in, recovery | Broader E2E still repository-defined/NOT_RUN |
| Firebase Rules | Emulator/test suite | NOT_RUN | — | — | — |
| Accessibility | Automated + manual | NOT_RUN | — | — | — |
| Security | Review/tests | NOT_RUN | — | — | — |
| Production build | `pnpm build` / `pnpm test` | PASS | 2026-08-01 | vinext/Vite production build | — |
| Light-theme visual regression | `pnpm visual:test` | PASS | 2026-08-01 | 20 screenshot states plus interactions | — |
| Dark-theme visual regression | `pnpm visual:test` | PASS | 2026-08-01 | 20 screenshot states plus interactions | — |
| Responsive mockup comparison | Mobile/tablet/desktop/large desktop | PASS | 2026-08-01 | 40 baselines; 50 browser cases | — |

## Documentation tracker

| Document | Status | Owner | Last updated | Review required | Notes |
|---|---|---|---|---|---|
| README.md | NOT_STARTED | — | — | Engineering | — |
| NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md | DRAFT | — | — | Product/engineering | — |
| CONSTRAINTS.md | DRAFT | — | — | All disciplines | — |
| Architecture/data/routes | DRAFT | — | 2026-08-02 | Engineering/security | `docs/architecture/news-ingestion-providers.md` — design reference for Phase 7 ingestion (NewsIngestionProvider seam, GDELT/Guardian adapters, streaming/aggregation/DLQ, rights, free source catalog); not-yet-implemented, gated behind F-034 |
| AI/editorial/content rights | NOT_STARTED | — | — | Editorial/legal | — |
| Accessibility/i18n/geography | NOT_STARTED | — | — | Product/QA | — |
| Testing/deployment/limitations | NOT_STARTED | — | — | Engineering/operations | — |

## Phase completion report

```text
PHASE COMPLETED:
DATE / OWNER:
STABLE FRAMEWORK REFERENCE:
STABLE EVIDENCE:
FILES CREATED:
FILES MODIFIED:
FEATURES IMPLEMENTED:
ACCEPTANCE CRITERIA:
TESTS RUN AND RESULTS:
BUILD STATUS:
KNOWN ISSUES:
RISKS / MITIGATIONS:
SECURITY NOTES:
EDITORIAL / LEGAL NOTES:
ACCESSIBILITY NOTES:
INTERNATIONALIZATION / GEOGRAPHIC-FAIRNESS NOTES:
DOCUMENTATION UPDATED:
MIGRATION / ROLLBACK:
RECOMMENDED BRANCH:
RECOMMENDED COMMIT:
APPROVAL:
NEXT PHASE:
```

## Release-readiness checklist

### Product and content

- [ ] All P0/P1 scope is `DONE` or explicitly deferred with approval.
- [ ] All applicable screens are compared with `docs/design/nyavista-ui-mockup-light-dark.png`.
- [ ] Light and dark visual baselines are approved with documented deviations.
- [ ] Global positioning and E-DEAL EXPRESS LLC ownership are accurate.
- [ ] Demo/mock/live content and providers are unmistakably labeled.
- [ ] Source links, AI disclosures, correction and reporting processes work.
- [ ] Market priority is not conflated with editorial importance.

### Engineering and operations

- [ ] Every shipped feature has complete STABLE evidence.
- [ ] Lint, types, tests, Rules tests, and production build pass.
- [ ] Migrations, indexes, environment variables, backups, and rollback are verified.
- [ ] Monitoring, alerts, quotas, cost controls, and incident ownership exist.
- [ ] No secrets, debug bypasses, or unauthorized data are committed.
- [ ] Orphaned ChatGPT header-auth scaffolding (`app/chatgpt-auth.ts`) is removed (see R-011).

### Security, legal, and quality

- [ ] RBAC and privileged workflows pass adversarial tests.
- [ ] Rights, privacy, consent, retention, and removal processes are reviewed.
- [ ] WCAG 2.2 AA review has no unresolved critical issue.
- [ ] Locale, timezone, language, and geographic-fairness cases pass.
- [ ] Legal/editorial/security owners approve launch.

### Release record

- Release version/tag:
- Commit SHA:
- Staging URL/result:
- Production URL/result:
- Smoke-test report:
- Rollback target/procedure:
- Approval names/dates:
