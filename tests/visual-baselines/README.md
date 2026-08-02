# Visual regression baselines

These PNG files are deterministic viewport captures of the approved Phase 1 demo surfaces. They are evidence, not production content.

Generate or intentionally update baselines with:

```powershell
pnpm visual:baseline
```

Verify the current UI against committed baselines without changing them:

```powershell
pnpm visual:test
```

The capture matrix covers `briefing`, `tracker`, and `editorial` in light and dark themes at 390×844, 768×1024, 1440×1000, and 1920×1080. Playwright reaches each state through the visible navigation and theme controls, so the baselines also exercise those interactions without changing or persisting product data.

Playwright starts an isolated development server and uses its isolated Chromium runtime with true CSS viewport emulation. Install that runtime with `pnpm exec playwright install chromium` after a fresh dependency installation. Each test also rejects framework error overlays, browser console errors, and horizontal page overflow. Review every changed image against `docs/design/nyavista-ui-mockup-light-dark.png` before accepting a baseline update.
