# AGENTS.md — NyaVista Repository Instructions

## Scope

These instructions apply to the entire NyaVista repository and to every coding agent, including Codex, Antigravity, Cursor, Claude Code, and automated implementation or review agents.

NyaVista is a proprietary product of **E-DEAL EXPRESS LLC**, a United States company. It is a global AI-powered news intelligence and multimedia platform. Its Eʋe-inspired name is brand heritage, not regional product positioning.

## Required instruction sources

Before planning or changing implementation files, read completely:

1. the **STABLE framework located at the repository root**, including directly required references;
2. `CONSTRAINTS.md`;
3. `NYAVISTA_PRODUCT_SPECS_INSTRUCTIONS.md`;
4. `PRODUCT_TRACKER.md`;
5. the README and any instructions or architecture decisions applicable to the files being changed.

For any user-interface task, also inspect:

```text
docs/design/nyavista-ui-mockup-light-dark.png
```

This is the approved visual reference for the marketing site, public application, mobile feed/video, editorial dashboard, and shared light/dark design system.

If the root STABLE framework cannot be located or read, implementation is blocked. Do not guess its rules. Read-only inspection and a blocker report are allowed.

## Mandatory STABLE lifecycle

Every feature and functionality must follow STABLE:

- **Before coding:** locate and read STABLE, record its path/version in the tracker, define scope and acceptance criteria, identify risks and tests, and inspect existing behavior.
- **During implementation:** follow all STABLE checkpoints, preserve evidence, remain within scope, implement validation/failure states/tests/docs, and stop for approval before deviating.
- **During review:** complete STABLE review steps, trace acceptance criteria to evidence, run required verification, update documentation and the tracker, and report limitations truthfully.

Mentioning STABLE without performing and recording its required actions is not compliance.

For UI work, the STABLE lifecycle must include the applicable mockup panels in Scope/Think, visual and responsive risks in Assess Risk, token/component reuse in Build, light/dark and breakpoint comparison in Validate, and documented deviations in Evolve.

## Operating rules

- Work one approved phase or tracker item at a time.
- Inspect the working tree before editing and preserve unrelated user changes.
- Make the smallest coherent change that fully satisfies the approved outcome.
- Do not advance to another phase without explicit approval.
- Do not claim an integration is live unless it is implemented and verified.
- When credentials are unavailable, create a provider interface, validated configuration, mock/fallback, failure state, and setup documentation.
- Do not deploy, publish, purchase services, change external systems, or perform destructive operations without the required authority.
- Use `apply_patch` for manual repository edits where supported.
- Treat the approved mockup as visual direction, not as verified production data or a replacement for written behavior.

## Product and editorial rules

- Describe NyaVista as United States-founded, owned by E-DEAL EXPRESS LLC, global, nonpartisan, and country-neutral.
- Do not describe it as African-born, Africa-first, Togo-focused, diaspora-focused, or regionally exclusive.
- Keep commercial market priority separate from editorial importance.
- Apply consistent standards to qualifying sources and stories from every geography.
- Preserve source transparency, rights rules, attribution, AI disclosure, uncertainty, corrections, and audit history.
- Do not bypass paywalls, store unauthorized full articles, or use unlicensed publisher media.
- Do not invent facts, quotations, sources, citations, or live data.
- Require configured human review for sensitive or high-risk content.

## Engineering rules

- Use strict TypeScript and schema validation at trust boundaries.
- Enforce authentication and authorization server-side and in Firebase Security Rules where applicable.
- Keep UI, domain, persistence, providers, jobs, validation, and permissions separated.
- Keep external AI, ingestion, media, search, translation, and recommendation services provider-neutral.
- Before any news-ingestion, provider-adapter, or "live data" work, read `docs/architecture/news-ingestion-providers.md`. It is the approved design target for the `NewsIngestionProvider` seam, the GDELT/Guardian adapters, streaming/aggregation/dead-letter behavior, rights policies, and the free source catalog. It is a design reference, not shipped code: live ingestion is Phase 7 (F-040/F-041/F-042) and gated behind Phase 6 (F-034). Do not build it early, and do not diverge from its seam or rights rules without a recorded architecture decision.
- Never expose server credentials or commit secrets, private data, unauthorized content, build outputs, or dependency directories.
- Preserve locale, timezone, country, region, accessibility, responsive, loading, error, empty, retry, and degraded-provider behavior.
- Implement the mockup through semantic design tokens and reusable components. Do not scatter sampled values or build isolated theme-specific copies.
- Compare applicable UI in light and dark themes and at relevant mobile, tablet, desktop, and large-desktop breakpoints.
- Document accessibility-, localization-, responsiveness-, browser-, or feasibility-driven visual deviations in the tracker.
- Do not mix Firebase and Supabase without an approved architecture decision.

## Verification requirements

Run the repository-defined versions of:

- lint;
- TypeScript validation;
- relevant unit, component, integration, and end-to-end tests;
- permission and Firebase Rules tests where applicable;
- accessibility checks appropriate to the change;
- production build.

UI changes also require visual-regression or screenshot evidence against `docs/design/nyavista-ui-mockup-light-dark.png`. The mockup never overrides WCAG requirements, source transparency, content rights, security, or truthful data.

Do not delete, weaken, hide, or skip a required failing test simply to make validation pass.

## Tracking and completion

Update `PRODUCT_TRACKER.md` with:

- tracker ID and status;
- STABLE framework path/version and evidence;
- acceptance criteria and results;
- files changed;
- tests and build results;
- security, editorial, legal, accessibility, localization, and geographic-fairness notes;
- mock versus live status;
- mockup panels used, visual comparison evidence, themes/breakpoints checked, and intentional deviations;
- risks, limitations, migration, and rollback;
- recommended commit or PR.

A feature is not `DONE` until the STABLE lifecycle, acceptance criteria, verification, documentation, and tracker evidence are complete.

## Completion report

Use this structure:

```text
OUTCOME:
TRACKER ID / PHASE:
STABLE FRAMEWORK REFERENCE:
STABLE EVIDENCE:
APPROVED MOCKUP PANEL(S):
VISUAL COMPARISON / DEVIATIONS:
FILES CREATED / MODIFIED:
FEATURES IMPLEMENTED:
ACCEPTANCE RESULTS:
TEST / LINT / TYPE / BUILD RESULTS:
SECURITY / RIGHTS / EDITORIAL NOTES:
ACCESSIBILITY / I18N / GEOGRAPHIC-FAIRNESS NOTES:
MOCK VS LIVE STATUS:
KNOWN LIMITATIONS:
DOCUMENTATION / TRACKER UPDATES:
MIGRATION / ROLLBACK:
RECOMMENDED COMMIT:
NEXT APPROVAL REQUIRED:
```
