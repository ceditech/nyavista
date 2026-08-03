"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- vinext 0.0.50 next/link hydration can load a duplicate React runtime; static marketing anchors are the safe progressive-enhancement path. */

import { useState } from "react";
import type { MarketingPage } from "../../lib/marketing";
import { product } from "../../lib/product";
import { BrandLogo } from "../brand-logo";

export function MarketingInfoPage({ page }: { page: MarketingPage }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  return <div className="app info-app" data-theme={theme}>
    <a className="skip-link" href="#info-main">Skip to main content</a>
    <header className="marketing-header">
      <a className="marketing-brand" href="/" aria-label="NyaVista home"><BrandLogo priority /></a>
      <nav className="marketing-nav" aria-label="Marketing navigation"><a href="/product">Product</a><a href="/features">Features</a><a href="/global-coverage">Global coverage</a><a href="/about">About</a></nav>
      <div className="marketing-actions"><button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>{theme === "light" ? "Dark" : "Light"}</button><a className="button primary marketing-explore button-link" href="/">Home</a></div>
    </header>
    <main id="info-main" className="info-main">
      <section className="info-hero"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p>{page.description}</p>{page.legalReview && <div className="review-notice" role="note"><strong>Review required</strong><span>Development-stage content only. Not operative legal advice or an approved production policy.</span></div>}</section>
      <section className="info-sections" aria-label={`${page.title} details`}>{page.sections.map((section) => <article key={section.title}><span aria-hidden="true">N</span><div><h2>{section.title}</h2><p>{section.body}</p></div></article>)}</section>
      <section className="info-status" aria-label="Current implementation status"><div><p className="eyebrow">CURRENT STATUS</p><h2>Transparent by design</h2></div><p>This local build contains fictional planning content and no live reporting, accounts, providers, payments, submissions, or publishing workflows.</p></section>
    </main>
    <footer className="marketing-footer"><span>© {new Date().getUTCFullYear()} {product.owner}. Development preview.</span><nav aria-label="Trust and legal"><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/cookies">Cookies</a><a href="/accessibility">Accessibility</a></nav></footer>
  </div>;
}
