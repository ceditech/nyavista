# NyaVista

NyaVista is a United States-founded, global AI-powered news intelligence and multimedia platform owned by E-DEAL EXPRESS LLC. Its Eʋe-inspired name is brand heritage, not regional positioning.

This repository currently contains a first-pass demo application and the product's governing specifications. The interface uses fictional planning data and does not connect to live news, AI, ingestion, authentication, persistence, or publishing providers.

## Local development

Use Node.js 22.13 or newer.

```bash
pnpm install
pnpm dev
```

Quality checks:

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
pnpm build
```

## Firebase Authentication setup

F-023 fails closed until a Firebase web app is configured. Copy `.env.example` to `.env.local`, fill the four required `NEXT_PUBLIC_FIREBASE_*` web identifiers, and enable Email/Password authentication in the Firebase console. For local testing, set `NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_URL=http://127.0.0.1:9099` and run the Firebase Authentication Emulator separately.

Firebase web configuration contains public client identifiers. Never place Firebase Admin service-account credentials in a `NEXT_PUBLIC_*` variable or commit them. Client authentication does not authorize protected server operations; verified server sessions, role checks, and Firebase Security Rules remain F-030.

## Delivery records

- `PRODUCT_TRACKER.md` is the delivery source of truth.
- `CLAUDE_HANDOFF.md` is the living cross-agent implementation ledger.
- `STABLE_FRAMEWORK.md` governs every implementation lifecycle.
- `docs/design/nyavista-ui-mockup-light-dark.png` is the approved UI reference.

## Marketing and trust routes

Phase 2 currently exposes typed, shared route shells for product, feature, audience, format, company, and required trust/legal information. The legal, editorial, privacy, copyright, corrections, community, recommendation, and accessibility text is development-stage content requiring qualified review before launch; it is not operative legal advice or a finalized production policy.

The local demo remains `noindex`. Canonical URLs and sitemap entries are emitted only when `NEXT_PUBLIC_SITE_URL` is a clean HTTPS origin with no path, credentials, query, or fragment, for example `https://www.nyavista.example`. Do not configure a placeholder as a production domain. Without this value, `/robots.txt` disallows crawling and `/sitemap.xml` is intentionally empty.
