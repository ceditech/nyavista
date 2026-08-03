# NyaVista Cross-Agent Implementation Handoff

This is the living implementation ledger for Claude Code, Codex, Antigravity, Cursor, CI agents, reviewers, and future automation. Update it in the same change as `PRODUCT_TRACKER.md`; neither file replaces the other. The tracker is the delivery source of truth, while this file preserves concise cross-agent context, ownership, decisions, and the next safe action.

## Update contract

Every agent must append or revise the relevant entry before handing work off. Record only verified facts. Never mark mocks as live, advance phases without approval, or overwrite another agent's active ownership.

Required fields for every implementation entry:

- Date/time in UTC, agent, tracker ID, and approved phase.
- Requested outcome, exact scope, and excluded scope.
- Root `STABLE_FRAMEWORK.md` commit reference and completed checkpoints.
- Applicable mockup panel(s), themes, and breakpoints.
- Files touched, decisions, acceptance evidence, and verification results.
- Mock/live state, risks, limitations, rollback, and one next safe action.

## Current program pulse

| Field | Current value |
|---|---|
| Approved work | Phase 4 — F-023 authentication foundation |
| Active tracker IDs | F-023 IN_PROGRESS (60%); F-024 and F-030 not started |
| Active agent | Codex |
| STABLE reference | `STABLE_FRAMEWORK.md` at commit `f8ab99e` |
| UI reference | `docs/design/nyavista-ui-mockup-light-dark.png` |
| State | Live Firebase web client configured locally; no verified server session, authorization, persistence, Analytics, or production claim |
| Next gate | User manually verifies live Email/Password registration, verification, sign-in, recovery, and denial states; then approve the remaining F-023 security/session slice |

## Implementation ledger

### 2026-08-02 — Codex — F-018 cross-app brand refinement

- Outcome: integrated both approved repository logos and refined the shared visual system without changing feature behavior; F-018 is `IN_REVIEW` at 80% pending manual visual acceptance.
- Scope: centralized `next/image` logo variants; simplified transparent wordmark in marketing/trust/workspace navigation; detailed opaque logo in a deliberate hero brand card; shared canvas, sidebar, header, surface, elevation, interaction, reduced-motion, and responsive crop polish. Excluded route/data/auth/tracker behavior changes, new assets, Analytics, deployment, and screenshot regeneration.
- STABLE/mockup: root framework and required sources applied; approved mockup and both source logos inspected; pixel dimensions, alpha/background behavior, callsites, image-loading rules, themes, and breakpoints assessed before editing.
- Verification: strict TypeScript, ESLint, production build, and 20/20 Node tests PASS; focused brand/render assertions 4/4 PASS. User review found vinext image-optimizer HTTP 500 responses; exact runtime copies now live under `public/brand`, `next/image` uses direct `unoptimized` local URLs, root and both assets return 200, no optimizer URL remains, and no framework overlay is present. Playwright screenshots and baseline changes were explicitly deferred by the user to conserve credits.
- Accessibility/responsiveness: retained accessible home-link names, decorative duplicate wordmark semantics, descriptive detailed-logo alt, focus behavior, touch targets, reduced-motion override, and mobile-first logo/hero sizing at 800/760/480px. Manual mobile/light/dark acceptance remains required.
- Files: `app/brand-logo.tsx`, `public/brand/*` exact runtime copies, root and trust header markup, shared CSS, focused test, tracker, and handoff. Supplied source assets remain unchanged at their original `docs/design` paths.
- Risks/rollback: raster assets are larger than ideal future SVG/WebP derivatives; the detailed file has an opaque white canvas and is intentionally contained. Revert the focused brand component/markup/styles/tests/docs; no migration.
- Next safe action: user manually reviews representative surfaces; do not run screenshot baselines until the user explicitly approves them. F-023 remains paused during this review.

### 2026-08-02 — Codex — F-023 foundation

- Outcome: Slice 1 was manually accepted; live Firebase web configuration and an optional Auth Emulator harness advance F-023 to 60%. Client configuration is verified, but no live account operation or server authorization is claimed.
- Scope: Firebase 12.17 modular client seam, Zod-validated required web configuration, optional Auth Emulator endpoint, sign-in/register/email-verification/reset operations, generic failure/recovery messages, account navigation and responsive UI, explicit unconfigured/onboarding/security boundaries, `.env.example`, setup docs, unit/browser/visual evidence. Excluded external Firebase setup, Admin secrets, server sessions, RBAC/Rules, social/MFA/deletion, persistence, F-024, and F-030 implementation.
- Dependency decision: removed the circular F-023→F-030 gate. F-023 establishes identity; F-030 consumes that identity for server authorization and Firebase Rules. Valid Firebase web configuration remains an F-023 completion dependency.
- STABLE/mockup: framework and required sources applied; official Firebase modular/Auth Emulator guidance and Next.js client boundaries reviewed. No auth-specific mockup exists, so approved shared shell, typography, cards, semantic colors, light/dark themes, and four breakpoints were reused.
- Verification: 3/3 focused auth configuration tests and 20/20 full Node tests PASS; strict TypeScript, ESLint, and production build PASS; 8 account baselines and 94/94 isolated Playwright cases PASS. Read-only live-config browser verification confirms configured provider state, enabled sign-in, and no console errors. Auth Emulator integration test is implemented but not executed.
- Security/privacy/accessibility/fairness: fails closed with missing config; no fake user, Admin credential, persisted input, privilege, or analytics; generic errors limit enumeration; native labeled inputs/buttons and status region; keyboard/focus/theme/responsive support; country/locale preferences are described but not collected.
- Files: `lib/auth.ts`, `.env.example`, account UI/CSS, focused tests and eight baselines, `package.json`, `pnpm-lock.yaml`, README, tracker, and handoff.
- Limitations/rollback: live registration/sign-in/recovery, emulator integration, verified server sessions, Security Rules, account deletion, and onboarding persistence remain unverified/unimplemented. Live identifiers reside only in ignored `.env.local`; remove it to fail closed. Revert the focused files/dependency/docs; no database migration.
- Next safe action: confirm Email/Password is enabled in Firebase Authentication, then manually verify the live account flows using a user-controlled test address. Do not begin F-024.

### 2026-08-02 — Codex — F-022

- Outcome: implemented and received user acceptance for search, touch-first mobile navigation, and a truthful rights-safe demo media briefing; F-022 and Phase 3 are `DONE`.
- Scope: local keyword/category/country filtering, clear/empty states, topbar/mobile navigation, CSS-generated vertical media, simulated play/pause/mute/progress/captions/transcript, fallback/no-stream disclosure, and related-story action. Excluded live search/media, uploads, streaming, persistence, personalization, analytics, accounts, recommendations, production routes, and F-070.
- STABLE/skills/mockup: root framework and required sources applied; F-020/F-021 dependencies complete; “Vertical Video (Mobile),” “Personalized Feed (Mobile),” and shared media-control panels reviewed in both themes; Next.js and React guidance confirmed the local client-state approach without fetch/API/image/player dependencies.
- Verification: 17/17 Node tests, ESLint, strict TypeScript, and production build PASS; 64 baselines and 82/82 Playwright cases PASS at four breakpoints in both themes with search/empty/clear, media controls/transcript/open-story, resource/console/overlay, and overflow checks.
- Visual/accessibility: search preserves compact feed density without claiming personalization; the media composition keeps disclosure, headline, progress, controls, and dock visible on mobile after manual overlap correction. Native labeled controls, live/status text, expanded/pressed states, progress semantics, transcript, touch sizing, focus inheritance, and reduced motion are preserved.
- Truth/fairness/rights: queries remain in memory only; no `<video>`, remote/publisher asset, autoplay, stream, provider, storage, analytics, or live claim. Togo and priority-market filters use equivalent ISO-based behavior.
- Files: root client UI/CSS, focused rendered/browser tests, 16 new search/media baselines plus affected synchronized baselines, baseline README, tracker, and handoff.
- Limitations/rollback: simulation only, English-only, four fictional stories, no real search index/media/personalization. Revert focused UI/test/baseline/docs changes; no migration.
- User acceptance/next safe action: user completed the guided review on 2026-08-02. Phase 3 is closed; do not begin Phase 4 without explicit approval and dependency review.

### 2026-08-02 — Codex — F-021

- Outcome: implemented and received user acceptance for the responsive public demo feed and story-detail experience; item is `DONE`.
- Scope: strict fictional story registry; F-020 global/country filters; feature and compact feed cards; context/transparency rail; detail context, key points, uncertainty, timeline, and fictional source register; responsive interactions and visual evidence. Excluded live providers, real sources/media, persistence, ranking, search, personalization, production routes, and F-022.
- STABLE/skills/mockup: root framework and required sources reviewed; “News Home Feed (Desktop)” and “Story Detail (Desktop)” light/dark panels inspected; Next.js App Router guidance shaped the existing client-shell boundary; React best-practices review found no waterfall, effect, serialization, inline-component, or bundle concern.
- Verification: 3/3 focused story tests and 17/17 complete Node tests PASS; ESLint PASS; strict TypeScript PASS; production build PASS; 48 baselines and 62/62 Playwright cases PASS at four breakpoints in both themes with geography filter, open/back, disclosure, console/resource/overlay, and overflow checks.
- Visual/accessibility: desktop feed/detail hierarchy aligns with the approved panels; mobile stacks content and retains scrollable section navigation; native controls, pressed state, semantic landmarks/headings, visible focus inheritance, touch targets, reduced motion, and no horizontal overflow.
- Truth/fairness/rights: all stories and sources are explicitly fictional; uncertainty and AI-assisted/no-human-review states are visible; no publisher assets or external links; Togo and commercial-priority markets use the same F-020 contract with no ranking input.
- Files: `lib/stories.ts`, `lib/geography.ts`, `app/page.tsx`, `app/globals.css`, focused tests, 16 refreshed/new feed/story baselines plus two tracker mobile evidence updates, baseline README, package script, tracker, and handoff.
- Limitations/rollback: demo-only English content, no live sources, real routes, persistence, media, search, or personalization. Revert the focused domain/UI/test/baseline/docs changes; no migration.
- User acceptance/next safe action: user completed the guided review on 2026-08-02. Do not start F-022 without explicit approval.

### 2026-08-02 — Codex — F-020

- Outcome: closed the approved Phase 2 review and completed the provider-neutral global/country/region feed architecture required before public feed UI work.
- Scope: Zod-validated ISO country codes, stable region IDs, discriminated feed scopes, bounded request/candidate contracts, deterministic geography matching, order-preserving selection, fictional fixtures, and geographic-fairness evidence. Excluded UI/routes, live providers, persistence, ingestion, ranking, personalization, and F-021/F-022.
- STABLE: root framework and required repository sources reviewed at feature-branch baseline `d99dc76`; scope, acceptance, risks, tests, and rollback recorded before coding; implementation stayed within the domain layer.
- Verification: 4/4 focused geography/fairness tests and 14/14 complete Node tests PASS; ESLint PASS; strict TypeScript PASS; vinext production build PASS. No visual baseline changed because this item has no UI output.
- Fairness/editorial: commercial market priority is not accepted by the selection API; Togo, Canada, Japan, and global fixtures use the same contract and deterministic behavior; subjects remain separate from geography; no ranking or editorial-importance claim was introduced.
- Security/live state: malformed identifiers, duplicates, unknown fields, oversized pages, and invalid candidates fail validation; no secrets, personal data, licensed content, network calls, live reporting, provider, or external state.
- Files: `lib/geography.ts`, `tests/geography.test.ts`, `package.json`, `pnpm-lock.yaml`, `PRODUCT_TRACKER.md`, and `CLAUDE_HANDOFF.md`.
- Rollback/next action: revert the focused module, tests, dependency/lock, and evidence records; no migration. User reviews F-020, then explicitly approves F-021 before public feed/story UI work.

### 2026-08-02 — Codex — F-012 navigation icon correction

- Outcome: corrected the user-reported mojibake before “NyaVista home” with a stable inline SVG house icon.
- Scope: one sidebar icon component, its 16px SVG sizing rule, focused source/browser assertions, affected baselines, and delivery records only.
- STABLE: root framework and UI constraints already active; clean feature-branch baseline `d99dc76` inspected; screenshot confirmed literal `âŒ‚` source corruption; smallest architecture-aligned correction selected.
- Accessibility/visual: SVG is decorative through the existing `aria-hidden` icon wrapper; accessible name remains “NyaVista home”; `currentColor` preserves hover/active/theme contrast and existing alignment.
- Risk/rollback: no data, route, provider, permission, or migration impact. Revert the focused icon/CSS/test/evidence changes to roll back.
- Next safe action: user verifies the corrected sidebar icon; Phase 2 closure remains the active gate.

### 2026-08-01 — Codex — F-017

- Outcome: completed 24 typed marketing/trust route shells, safe metadata/canonical policy, and fail-safe robots/sitemap behavior.
- Scope: shared responsive information shell; product, feature, format, audience, company, FAQ, and required policy routes; per-route metadata; visible review labels; internal navigation; HTTPS-origin validation; route/config/render/visual tests; README setup guidance.
- Excluded: finalized legal advice, verified contacts/domain/pricing, forms/data collection, localized routes/`hreflang`, production indexing, analytics, auth, providers, persistence, publishing, and deployment.
- STABLE/mockup: root framework and required documents reviewed at baseline `d1f2405`; explicit F-017 approval inferred from “Next”; F-014 marketing/shared-system panels guided both themes and four breakpoints; scope/risks/tests/rollback recorded before implementation.
- Verification: ESLint PASS; strict TypeScript PASS; production build PASS; 10/10 Node tests PASS; representative endpoints return 200; 40/40 baselines and 50/50 Playwright cases PASS with console/resource/overlay/overflow guards.
- SEO truthfulness: without a clean HTTPS `NEXT_PUBLIC_SITE_URL`, canonical URLs are omitted, sitemap is empty, and robots disallow all. No production domain was invented.
- Legal/editorial/privacy: every relevant shell is visibly a development-stage draft requiring qualified review; no operative legal claim, contact address, personal-data collection, or live workflow was invented.
- Compatibility decision: static semantic anchors replace `next/link` because vinext 0.0.50 produced a duplicate-React hydration failure in browser validation; ordinary navigation is accessible, tested, and progressively enhanced.
- Files: `lib/marketing.ts`, `app/[slug]/page.tsx`, `app/[slug]/marketing-info-page.tsx`, `app/robots.ts`, `app/sitemap.ts`, root marketing navigation/styles, tests/baselines, README, tracker, and handoff.
- Rollback: revert the focused F-017 route/config/UI/SEO/test/doc changes and eight trust screenshots; no migration or external state.
- Next safe action: user reviews F-017 and Phase 2 closure. Do not begin Phase 3 without explicit approval.

### 2026-08-01 — Codex — F-014

- Outcome: completed the approved Phase 2 marketing homepage visual implementation and kept Phase 1 workspace surfaces intact.
- Scope: dedicated marketing header/navigation, specification headline, truthful demo disclosure, responsive split hero, rights-safe abstract coverage mosaic, four product-principle cards, product promise, light/dark switch, and demo-workspace entry.
- Excluded: F-017 routes, legal shells, pricing/forms, production SEO, authentication, persistence, live news/providers, and deployment.
- STABLE: root `STABLE_FRAMEWORK.md` and required sources read at baseline `6265a47`; explicit Phase 2/F-014 approval confirmed; marketing and shared-system mockup panels inspected; scope/risks/acceptance recorded before implementation; focused build, validation, visual comparison, deviations, and rollback documented.
- Mockup/evidence: marketing panel hierarchy compared in light/dark at 390×844, 768×1024, 1440×1000, and 1920×1080. Eight new marketing baselines expand the matrix to 32 images across four surfaces.
- Verification: ESLint PASS; strict TypeScript PASS; production build PASS; 6/6 Node tests PASS; 38/38 Playwright visual and interaction cases PASS with overflow, failed-resource, console-error, and framework-overlay guards.
- Files: `app/page.tsx`, `app/globals.css`, `playwright.config.ts`, `tests/visual-regression.spec.ts`, `tests/rendered-html.test.mjs`, eight marketing baseline PNGs, baseline README, `PRODUCT_TRACKER.md`, and `CLAUDE_HANDOFF.md`.
- Deviations: the product-specification headline replaces incidental mockup copy; original CSS abstract art avoids unlicensed/generated photography; responsive stacking and collapsed compact navigation preserve usability on narrow screens.
- Truthfulness/rights/security: fictional planning/demo state is visible; no providers, publisher media, credentials, personal data, persistence, or privileged behavior added.
- Accessibility/i18n/fairness: semantic landmarks/headings/navigation, native keyboard/touch controls, visible focus, reduced motion, contrast-aware themes, and no horizontal overflow; English-only remains deferred; country-neutral global positioning preserved.
- Rollback: revert the focused F-014 UI/tests/docs and remove the eight marketing baselines; no migration or external state.
- Next safe action: user reviews F-014. Do not begin F-017 or any later feature without explicit approval.

### 2026-08-01 — Codex — F-010/F-011/F-012/F-015

- Outcome: first-pass responsive app shell, public intelligence preview, editorial overview, living sprint tracker, and cross-agent handoff foundation.
- Scope: centralized product identity; semantic light/dark tokens; reusable cards, buttons, badges, navigation, progress, timeline, and coverage visualizations; keyboard focus; reduced motion; responsive layouts.
- Excluded: authentication, persistence, Firebase, ingestion, real sources, live AI, publishing, markdown parser/watch service, and production deployment.
- STABLE: root framework and required repository documents read; clean documentation-only baseline inspected; scope and risks recorded in `PRODUCT_TRACKER.md` before implementation; lint, strict TypeScript, 2/2 tests, production build, and responsive browser review passed.
- Mockup panels: marketing homepage, desktop feed, story-detail hierarchy, mobile feed/video character, editorial dashboard, and shared token/component strip. Light and dark directions applied; presentation-board proportions intentionally adapted to real responsive layouts.
- Truthfulness: every story, metric, source count, coverage split, editorial queue item, and polling state is fictional planning/demo data.
- Files: `app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `lib/product.ts`, `CLAUDE_HANDOFF.md`, `PRODUCT_TRACKER.md`, project scaffold/configuration.
- Risks: tracker UI is currently a typed snapshot rather than a runtime markdown parser; admin controls are visual only and provide no authorization; public content is not live reporting.
- Rollback: remove the generated app scaffold and restore the documentation-only tree; no data migration exists.
- Visual review: light marketing/public shell and dark tracker reviewed on desktop; dark tracker reviewed at 390×844; no browser warnings or errors; functional mobile navigation added after the first responsive pass.
- Next safe action: review Phase 1 evidence and request approval for one named next tracker item. Do not advance phases automatically.

## Handoff queue

| Priority | Tracker ID | Next action | Required evidence | Owner |
|---|---|---|---|---|
| P0 | Phase 2 review | Review F-017 routes, trust/legal labeling, and safe SEO behavior | User acceptance/closure decision | User |

### 2026-08-01 — Codex — F-013

- Outcome: completed a repeatable Playwright visual-regression workflow with 24 committed baselines and a non-mutating verification command.
- Scope: briefing, tracker, and editorial surfaces; light/dark; 390×844, 768×1024, 1440×1000, and 1920×1080; real navigation/theme interactions; overlay, resource, console, and horizontal-overflow assertions.
- Excluded: Phase 2+ UI approval, Firefox/WebKit baselines, hosted artifact publication, and screen-reader certification.
- STABLE: root framework at baseline `f902b9d`; applicable approved mockup panels reviewed; visual/responsive risks assessed; inaccurate command-line Chrome viewport evidence rejected; Playwright evidence built, validated, replayed, and documented.
- Files: `playwright.config.ts`, `tests/visual-regression.spec.ts`, `tests/visual-baselines/`, `package.json`, `pnpm-lock.yaml`, `.gitignore`, `app/globals.css`, `tests/rendered-html.test.mjs`, `PRODUCT_TRACKER.md`, `CLAUDE_HANDOFF.md`.
- Verification: visual baseline generation PASS 24/24; non-mutating visual replay PASS 24/24; ESLint PASS; strict TypeScript PASS; Node tests PASS 3/3; production build PASS.
- Finding/fix: the first true mobile capture detected horizontal tracker overflow; min-width containment, safe wrapping, zero-minimum metric columns, and explicit mobile viewport constraints corrected it before baseline acceptance.
- Mockup/deviations: editorial typography, dashboard density, semantic light/dark surfaces, and restrained accent system align with the approved reference. Rights-safe CSS abstract artwork and responsive real-page proportions remain intentional deviations.
- Truthfulness/security/rights: demo-only fictional content; no providers, publishing, credentials, personal information, or publisher assets introduced.
- Rollback: remove Playwright configuration/tests/baselines and revert the narrow tracker containment rules; no migration exists.
- Next safe action: review F-011/F-012/F-015/F-016 against F-013 evidence, then complete F-010 metadata/locale helpers. Do not start F-014 without explicit Phase 2 approval.

### 2026-08-01 — Codex — F-010

- Outcome: completed the typed central product configuration, truthful root metadata, initial-market/editorial separation, locale resolution, UTC policy, and locale-aware formatting helpers.
- Scope: identity/ownership/positioning; demo disclosure and no-index metadata; Open Graph/Twitter metadata without invented origin or imagery; responsive theme-color metadata; five initial BCP 47 English locales and ISO country codes; safe locale fallback; `Intl` date/time, number, and currency helpers.
- Excluded: production canonical URL, `hreflang`, localized routes, translations, geolocation, user preference persistence, social handles, contacts, sitemap, and Phase 2 marketing work.
- STABLE: root framework baseline `f902b9d`; product specification, constraints, tracker, README, current boundaries, Next.js skill, and metadata guidance reviewed; scope/acceptance/risks recorded before implementation; server metadata and pure configuration responsibilities kept separate.
- Files: `lib/product.ts`, `app/layout.tsx`, `tests/product-config.test.ts`, `tests/rendered-html.test.mjs`, `package.json`, `tsconfig.json`, `PRODUCT_TRACKER.md`, `CLAUDE_HANDOFF.md`.
- Verification: ESLint PASS; strict TypeScript PASS; 6/6 Node tests PASS; production build PASS; rendered HTML metadata verified; 24/24 Playwright visual regressions PASS.
- Truthfulness/security/rights: the demo is `noindex, nofollow`; no production domain, contact, social account, translation, provider, personal data, or external media was invented.
- Accessibility/i18n/geographic fairness: `lang=en-US`, BCP 47 supported locales, UTC canonical default, explicit timezone override, `Intl` formatting, deterministic unsupported-locale fallback, and a typed rule that commercial priority does not affect editorial importance.
- Rollback: revert the focused configuration/layout/tests/compiler-option and delivery-record changes; no migration exists.
- Next safe action: acceptance review for F-010 and the remaining Phase 1 review items. Do not start F-014 without explicit Phase 2 approval.

### 2026-08-01 — Codex — F-011/F-012/F-015/F-016 acceptance and responsive sidebar correction

- Outcome: user approved F-011, F-012, F-015, and F-016, reporting one remaining issue: the dashboard sidebar was not discoverable in mobile/responsive views. The issue was corrected and all four items are now `DONE`.
- Root cause: the responsive sidebar already functioned as an off-canvas drawer, but its opener appeared only as an `N` brand mark, so it did not communicate navigation availability.
- Fix: replaced the ambiguous opener with a visible `☰ Menu` control; linked it to the primary navigation with `aria-controls` and `aria-expanded`; retained the sidebar close control; added a dismissible backdrop; preserved the persistent desktop sidebar.
- STABLE/mockup: approved mobile and editorial-dashboard mockup panels reviewed; smallest accessible correction applied without redesigning the shell or advancing scope.
- Verification: focused sidebar tests PASS at 390×844 and 768×1024; drawer opens into the viewport and dismisses through the backdrop; 24 screenshot baselines and 26 total browser cases PASS; ESLint and strict TypeScript PASS; root extension-induced hydration noise suppressed only at `html`/`body` while deeper mismatches remain visible.
- Files: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`, `playwright.config.ts`, `tests/visual-regression.spec.ts`, responsive baseline PNGs, baseline README, `PRODUCT_TRACKER.md`, `CLAUDE_HANDOFF.md`.
- Mock/live and rights: demo-only; no providers, publishing, credentials, personal data, or external assets added.
- Accessibility/i18n: explicit Menu label, native buttons, accessible relationships/state, touch-friendly target, backdrop dismissal, focus styles, and reduced motion. English Menu text remains a later localization concern.
- Rollback: revert the Menu/backdrop markup/styles/tests/baselines and acceptance record; no migration.
- Next safe action: formal Phase 1 closure review. Phase 2 and F-014 remain unauthorized until explicitly approved.

### 2026-08-01 — Codex — F-016

- Outcome: replaced the duplicated six-phase tracker snapshot with a validated UI generated from `PRODUCT_TRACKER.md`.
- Scope: canonical sprint and feature registers; build-time watched Markdown module; strict parser; six sprints, 15 phases, full feature inventory, derived progress, feature acceptance/evidence, dependency/risk, and STABLE checkpoint views.
- Excluded: browser-side Markdown editing, persistence, collaboration, providers, deployment, and any phase advancement.
- STABLE: root framework at baseline commit `f902b9d`; existing behavior audited before edits; dashboard/design-system mockup panels informed hierarchy, density, tokens, theme, and responsive decisions; validation results recorded in both delivery documents.
- Files: `PRODUCT_TRACKER.md`, `app/page.tsx`, `app/globals.css`, `lib/tracker.ts`, `build/tracker-vite-plugin.ts`, `virtual-product-tracker.d.ts`, `vite.config.ts`, `tests/rendered-html.test.mjs`, `CLAUDE_HANDOFF.md`.
- Verification: ESLint PASS; strict TypeScript PASS; 2/2 tests PASS; production build PASS. Automated browser screenshots remain pending because browser-control tooling was unavailable in this session.
- Truthfulness: tracker values are documented implementation records loaded from the repository, not live operational telemetry; no external provider or production data was added.
- Rollback: revert the F-016 files and delivery-register additions; no data migration exists.
- Next safe action: review F-016 and capture F-013 light/dark baselines at mobile, tablet, desktop, and large desktop. Do not advance phases automatically.

## Agent completion template

```text
DATE / AGENT:
TRACKER ID / APPROVED PHASE:
REQUESTED OUTCOME:
IN SCOPE / OUT OF SCOPE:
STABLE FRAMEWORK COMMIT + EVIDENCE:
MOCKUP PANELS / THEMES / BREAKPOINTS:
FILES CHANGED:
ACCEPTANCE RESULTS:
TEST / LINT / TYPE / BUILD RESULTS:
MOCK VS LIVE STATUS:
RISKS / LIMITATIONS:
MIGRATION / ROLLBACK:
NEXT SAFE ACTION / APPROVAL REQUIRED:
```
