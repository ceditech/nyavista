"use client";
/* eslint-disable @next/next/no-html-link-for-pages -- vinext 0.0.50 next/link hydration can load a duplicate React runtime; static marketing anchors are the safe progressive-enhancement path. */

import { useState } from "react";
import trackerMarkdown from "virtual:product-tracker";
import { product } from "../lib/product";
import { parseProductTracker, trackerCheckpoints, type TrackerFeature, type TrackerStatus } from "../lib/tracker";

type View = "marketing" | "briefing" | "tracker" | "editorial";
const tracker = parseProductTracker(trackerMarkdown);

const stories = [
  { tag: "GLOBAL · ECONOMY", title: "How cities are preparing public services for longer heat seasons", summary: "A multi-source demo briefing comparing adaptation plans, funding questions, and local trade-offs.", sources: 5, time: "6 min", accent: "gold" },
  { tag: "TECHNOLOGY", title: "Small-language AI tools gain new investment and research attention", summary: "What new models could mean for access, preservation, and responsible deployment.", sources: 4, time: "4 min", accent: "violet" },
  { tag: "HEALTH", title: "Regional care networks test shared capacity planning", summary: "A fictional overview of the operational questions being evaluated across several markets.", sources: 3, time: "3 min", accent: "green" },
];

function Icon({ children }: { children: React.ReactNode }) {
  return <span className="icon" aria-hidden="true">{children}</span>;
}

export default function Home() {
  const [view, setView] = useState<View>("marketing");
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="app" data-theme={theme}>
      <a className="skip-link" href="#main">Skip to main content</a>
      {view === "marketing" ? <Marketing theme={theme} onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")} onExplore={() => setView("briefing")} /> : <>
      <aside id="primary-navigation" className={navOpen ? "sidebar open" : "sidebar"} aria-label="Primary navigation">
        <div className="brand"><span className="brand-mark">N</span><span>{product.name}</span><button className="nav-close" onClick={() => setNavOpen(false)} aria-label="Close navigation">×</button></div>
        <nav>
          <p className="nav-label">Workspace</p>
          <button className="nav-item" onClick={() => { setView("marketing"); setNavOpen(false); }}><Icon>âŒ‚</Icon>NyaVista home</button>
          <button className={view === "briefing" ? "nav-item active" : "nav-item"} onClick={() => { setView("briefing"); setNavOpen(false); }}><Icon>⌂</Icon>News intelligence</button>
          <button className={view === "tracker" ? "nav-item active" : "nav-item"} onClick={() => { setView("tracker"); setNavOpen(false); }}><Icon>◫</Icon>Project tracker<span className="nav-count">{tracker.features.length}</span></button>
          <button className={view === "editorial" ? "nav-item active" : "nav-item"} onClick={() => { setView("editorial"); setNavOpen(false); }}><Icon>✓</Icon>Editorial overview</button>
          <p className="nav-label">Explore</p>
          <button className="nav-item"><Icon>◎</Icon>Global coverage</button>
          <button className="nav-item"><Icon>◇</Icon>Saved stories</button>
          <button className="nav-item"><Icon>◌</Icon>Media briefings</button>
        </nav>
        <div className="sidebar-note"><span className="status-dot" /> Demo environment<p>No live reporting or providers</p></div>
        <button className="nav-item settings"><Icon>⚙</Icon>Settings</button>
      </aside>
      {navOpen && <button className="sidebar-backdrop" onClick={() => setNavOpen(false)} aria-label="Close navigation"/>}

      <div className="workspace">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setNavOpen(true)} aria-label="Open navigation" aria-expanded={navOpen} aria-controls="primary-navigation"><span aria-hidden="true">☰</span><strong>Menu</strong></button>
          <div><p className="eyebrow">{product.owner} · {product.foundingCountry}</p><strong>{view === "tracker" ? "Delivery workspace" : view === "editorial" ? "Editorial command centre" : "Global intelligence briefing"}</strong></div>
          <div className="top-actions">
            <button className="icon-button" aria-label="Search">⌕</button>
            <button className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span>{theme === "light" ? "☾" : "☀"}</span>{theme === "light" ? "Dark" : "Light"}</button>
            <button className="avatar" aria-label="Account menu">NV</button>
          </div>
        </header>

        <main id="main">
          {view === "briefing" && <Briefing onOpenTracker={() => setView("tracker")} />}
          {view === "tracker" && <Tracker />}
          {view === "editorial" && <Editorial />}
        </main>
      </div>
      </>}
    </div>
  );
}

function Marketing({ theme, onToggleTheme, onExplore }: { theme: "light" | "dark"; onToggleTheme: () => void; onExplore: () => void }) {
  const principles = [
    { icon: "◎", title: "Multi-source clarity", copy: "Compare perspectives and understand how a story is being framed." },
    { icon: "◌", title: "Audio & video explainers", copy: "Choose concise, accessible formats built for different moments." },
    { icon: "◈", title: "Global coverage", copy: "Connect local context with worldwide developments—country-neutral by design." },
    { icon: "▣", title: "Source transparent", copy: "See source counts, disclosure states, and original reporting paths." },
  ];

  return <div className="marketing-shell">
    <header className="marketing-header">
      <a className="marketing-brand" href="#marketing-main" aria-label="NyaVista home"><span className="brand-mark">N</span>{product.name}</a>
      <nav className="marketing-nav" aria-label="Marketing navigation">
        <a href="/product">Product</a><a href="/features">Features</a><a href="/how-it-works">How it works</a><a href="/global-coverage">Global coverage</a>
      </nav>
      <div className="marketing-actions"><button className="theme-toggle" onClick={onToggleTheme} aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}><span aria-hidden="true">{theme === "light" ? "☾" : "☀"}</span>{theme === "light" ? "Dark" : "Light"}</button><button className="button primary marketing-explore" onClick={onExplore}>Explore demo</button></div>
    </header>
    <main id="marketing-main" className="marketing-main">
      <section className="marketing-hero" aria-labelledby="marketing-title">
        <div className="marketing-copy"><span className="pill pill-indigo">DEMO EXPERIENCE · NO LIVE REPORTING</span><p className="marketing-kicker">Every story. A clearer view.</p><h1 id="marketing-title">Understand the news in minutes, not hours.</h1><p>Build a clearer picture through transparent, multi-source context and accessible explainers—designed for a global audience.</p><div className="button-row"><button className="button primary" onClick={onExplore}>Explore NyaVista <span aria-hidden="true">→</span></button><a className="button secondary button-link" href="#principles">See how it works <span aria-hidden="true">↓</span></a></div><small className="marketing-disclosure">Fictional planning content. No live sources, recommendations, or AI providers are connected.</small></div>
        <div className="marketing-mosaic" aria-label="Abstract, rights-safe illustration of global news coverage">
          <div className="mosaic-tile city"><span>Local context</span></div><div className="mosaic-tile globe"><span>Global view</span></div><div className="mosaic-tile network"><span>Source connections</span></div><div className="mosaic-tile people"><span>Human perspective</span></div>
        </div>
      </section>
      <section id="principles" className="marketing-principles" aria-labelledby="principles-title"><div className="sr-only"><h2 id="principles-title">How NyaVista is designed to help</h2></div>{principles.map((principle) => <article key={principle.title}><Icon>{principle.icon}</Icon><h3>{principle.title}</h3><p>{principle.copy}</p></article>)}</section>
      <section id="features" className="marketing-promise" aria-label="Product promise"><p><strong>AI-assisted.</strong> Human-reviewed. Source-transparent.</p><span className="pill pill-violet">Planning preview</span></section>
    </main>
    <footer className="marketing-footer"><span>{product.name} is a proprietary product of {product.owner}, a United States company.</span><nav aria-label="Trust and legal"><a href="/editorial-standards">Editorial standards</a><a href="/privacy">Privacy</a><a href="/accessibility">Accessibility</a></nav><button onClick={onExplore}>Enter demo workspace →</button></footer>
  </div>;
}

function Briefing({ onOpenTracker }: { onOpenTracker: () => void }) {
  return <div className="page briefing-page">
    <section className="hero">
      <div className="hero-copy"><span className="pill pill-indigo">DEMO CONTENT · NOT LIVE REPORTING</span><h1>Every story.<br /><em>A clearer view.</em></h1><p>Understand complex developments through transparent, multi-source context—designed for a global audience.</p><div className="button-row"><button className="button primary">Explore the briefing <span>→</span></button><button className="button secondary" onClick={onOpenTracker}>View build progress</button></div></div>
      <div className="hero-visual" aria-label="Abstract global coverage visual"><div className="orb orb-one"/><div className="orb orb-two"/><div className="grid-lines"/><div className="visual-card"><span>Global coverage</span><strong>Country-neutral by design</strong><small>Fictional planning preview</small></div></div>
    </section>
    <section className="trust-strip" aria-label="Product principles"><div><Icon>◎</Icon><span><strong>Multi-source clarity</strong>Compare perspectives</span></div><div><Icon>◌</Icon><span><strong>Audio & video</strong>Accessible explainers</span></div><div><Icon>◈</Icon><span><strong>Global coverage</strong>Local context, global impact</span></div><div><Icon>▣</Icon><span><strong>Source transparent</strong>Attribution first</span></div></section>
    <div className="section-heading"><div><p className="eyebrow">TODAY’S DEMO BRIEFING</p><h2>Stories worth understanding</h2></div><button className="text-button">View global feed →</button></div>
    <section className="story-grid">{stories.map((story) => <article className="story-card" key={story.title}><div className={`story-art ${story.accent}`}><span>{story.tag.split(" · ")[0]}</span></div><div className="story-content"><span className="story-tag">{story.tag}</span><h3>{story.title}</h3><p>{story.summary}</p><div className="story-meta"><span>Based on {story.sources} fictional sources</span><span>{story.time}</span></div></div></article>)}</section>
  </div>;
}

/* Previous hard-coded tracker retained temporarily for history.
function Tracker({ overall, activePhase, selectedPhase, setSelectedPhase, polling, lastSync, refresh }: { overall: number; activePhase: typeof phases[number]; selectedPhase: string; setSelectedPhase: (id: string) => void; polling: boolean; lastSync: string; refresh: () => void }) {
  return <div className="page tracker-page">
    <section className="page-intro"><div><span className="pill pill-violet">LIVING DELIVERY VIEW</span><h1>From specification to shipped product.</h1><p>A visual first pass of the sprint phases in <code>PRODUCT_TRACKER.md</code>. Values are planning snapshots until markdown synchronisation is implemented.</p></div><div className="sync-card"><div className="sync-status"><span className={polling ? "pulse" : "pulse paused"}/><span><strong>{polling ? "Polling enabled" : "Refreshing…"}</strong><small>Last snapshot: {lastSync}</small></span></div><button className="button secondary compact" onClick={refresh}>Refresh snapshot</button></div></section>
    <section className="metric-grid"><Metric label="Overall completion" value={`${overall}%`} change="Across visible phases" tone="indigo"/><Metric label="Active sprint" value="Phase 1" change="Foundation & design system" tone="violet"/><Metric label="Open risks" value="7" change="2 critical gates" tone="gold"/><Metric label="Verification" value="Pending" change="Build and checks in progress" tone="green"/></section>
    <section className="tracker-layout"><div className="panel phase-panel"><div className="panel-heading"><div><p className="eyebrow">SPRINT ROADMAP</p><h2>Delivery phases</h2></div><span className="legend"><i/> Completion</span></div><div className="phase-list">{phases.map((phase) => <button key={phase.id} className={selectedPhase === phase.id ? "phase-row selected" : "phase-row"} onClick={() => setSelectedPhase(phase.id)}><span className="phase-id">{phase.id}</span><span className="phase-name"><strong>{phase.title}</strong><small>{phase.status}</small></span><span className="progress-track"><i style={{width: `${phase.progress}%`}}/></span><b>{phase.progress}%</b></button>)}</div></div>
      <aside className="panel sprint-panel"><p className="eyebrow">SELECTED SPRINT</p><div className="sprint-title"><div><span>{activePhase.id}</span><h2>{activePhase.title}</h2></div><strong>{activePhase.progress}%</strong></div><div className="ring" style={{"--progress": `${activePhase.progress * 3.6}deg`} as React.CSSProperties}><span>{activePhase.progress}<small>%</small></span></div><h3>Implementation steps</h3><ol className="step-list">{activePhase.steps.map((step, index) => <li key={step} className={index < Math.ceil(activePhase.steps.length * activePhase.progress / 100) ? "done" : ""}><span>{index < Math.ceil(activePhase.steps.length * activePhase.progress / 100) ? "✓" : index + 1}</span><p>{step}<small>{index < Math.ceil(activePhase.steps.length * activePhase.progress / 100) ? "Evidence recorded" : "Awaiting implementation"}</small></p></li>)}</ol></aside></section>
    <section className="panel activity-panel"><div className="panel-heading"><div><p className="eyebrow">AGENT HANDOFFS</p><h2>Implementation pulse</h2></div><span className="pill pill-green">1 agent active</span></div><div className="timeline"><div><span className="timeline-dot indigo"/><strong>Codex</strong><p>App shell, design system and living tracker foundation</p><time>In progress</time></div><div><span className="timeline-dot violet"/><strong>STABLE gate</strong><p>Scope, mockup panels, risks and acceptance checks recorded</p><time>Completed</time></div><div><span className="timeline-dot gold"/><strong>Next handoff</strong><p>Review implementation evidence in CLAUDE_HANDOFF.md</p><time>Pending</time></div></div></section>
  </div>;
}
*/

function Tracker() {
  const initialSprint = tracker.sprints.find((sprint) => sprint.status === "IN_PROGRESS") ?? tracker.sprints[0];
  const [selectedSprintId, setSelectedSprintId] = useState(initialSprint.id);
  const [selectedPhaseId, setSelectedPhaseId] = useState(initialSprint.phases[0]?.id ?? "");
  const [selectedFeatureId, setSelectedFeatureId] = useState(initialSprint.phases[0]?.features[0]?.id ?? "");
  const selectedSprint = tracker.sprints.find((sprint) => sprint.id === selectedSprintId) ?? initialSprint;
  const selectedPhase = selectedSprint.phases.find((phase) => phase.id === selectedPhaseId) ?? selectedSprint.phases[0];
  const selectedFeature = selectedPhase?.features.find((feature) => feature.id === selectedFeatureId) ?? selectedPhase?.features[0];
  const doneCount = tracker.features.filter((feature) => feature.status === "DONE").length;
  const activeCount = tracker.features.filter((feature) => ["IN_PROGRESS", "IN_REVIEW", "VALIDATING"].includes(feature.status)).length;

  function selectSprint(id: string) {
    const sprint = tracker.sprints.find((candidate) => candidate.id === id) ?? initialSprint;
    setSelectedSprintId(sprint.id);
    setSelectedPhaseId(sprint.phases[0]?.id ?? "");
    setSelectedFeatureId(sprint.phases[0]?.features[0]?.id ?? "");
  }

  function selectPhase(id: string) {
    const phase = selectedSprint.phases.find((candidate) => candidate.id === id) ?? selectedSprint.phases[0];
    setSelectedPhaseId(phase?.id ?? "");
    setSelectedFeatureId(phase?.features[0]?.id ?? "");
  }

  return <div className="page tracker-page">
    <section className="page-intro"><div><span className="pill pill-violet">MARKDOWN-SYNCHRONIZED DELIVERY VIEW</span><h1>Every sprint, phase, and feature—one source.</h1><p>The hierarchy below is generated from <code>PRODUCT_TRACKER.md</code>. Edit its sprint and feature progress registers; the app validates and renders the same delivery record.</p></div><div className="sync-card tracker-source-card"><div className="sync-status"><span className="pulse"/><span><strong>Markdown source linked</strong><small>Tracker updated {tracker.lastUpdated}</small></span></div><small>PRODUCT_TRACKER.md · validated at build time</small></div></section>
    <section className="metric-grid"><Metric label="Overall completion" value={`${tracker.overallProgress}%`} change="Average feature progress" tone="indigo"/><Metric label="Tracked features" value={`${tracker.features.length}`} change={`Across ${tracker.phases.length} phases`} tone="violet"/><Metric label="Completed" value={`${doneCount}`} change="Acceptance evidence recorded" tone="green"/><Metric label="Active implementation" value={`${activeCount}`} change="Build, review, or validation" tone="gold"/></section>
    <section className="panel sprint-overview"><div className="panel-heading"><div><p className="eyebrow">SPRINT ROADMAP</p><h2>Delivery sequence</h2></div><span className="legend"><i/> Derived completion</span></div><div className="sprint-strip">{tracker.sprints.map((sprint) => <button key={sprint.id} aria-pressed={sprint.id === selectedSprint.id} className={sprint.id === selectedSprint.id ? "sprint-card selected" : "sprint-card"} onClick={() => selectSprint(sprint.id)}><span><b>{sprint.id}</b><StatusBadge status={sprint.status}/></span><strong>{sprint.title}</strong><small>{sprint.phases.length} phases · {sprint.phases.reduce((count, phase) => count + phase.features.length, 0)} features</small><span className="progress-track" role="progressbar" aria-label={`${sprint.title} completion`} aria-valuenow={sprint.progress} aria-valuemin={0} aria-valuemax={100}><i style={{width: `${sprint.progress}%`}}/></span><em>{sprint.progress}%</em></button>)}</div></section>
    <section className="delivery-layout">
      <aside className="panel phase-rail"><div className="panel-heading"><div><p className="eyebrow">{selectedSprint.id} · PHASES</p><h2>{selectedSprint.title}</h2></div><strong className="completion-number">{selectedSprint.progress}%</strong></div><div className="phase-selector">{selectedSprint.phases.map((phase) => <button key={phase.id} aria-pressed={phase.id === selectedPhase?.id} className={phase.id === selectedPhase?.id ? "phase-select selected" : "phase-select"} onClick={() => selectPhase(phase.id)}><span><b>{phase.id}</b><small>{phase.features.length} features</small></span><strong>{phase.title}</strong><span className="progress-track"><i style={{width: `${phase.progress}%`}}/></span><em>{phase.progress}%</em></button>)}</div></aside>
      <div className="panel feature-workspace">{selectedPhase && <><div className="feature-summary"><div><p className="eyebrow">{selectedPhase.id} · FEATURE IMPLEMENTATION</p><h2>{selectedPhase.title}</h2><p>{selectedPhase.exitCriteria}</p></div><strong>{selectedPhase.progress}%</strong></div><div className="feature-columns"><div className="feature-list" aria-label={`${selectedPhase.title} features`}>{selectedPhase.features.map((feature) => <button key={feature.id} aria-pressed={feature.id === selectedFeature?.id} className={feature.id === selectedFeature?.id ? "feature-row selected" : "feature-row"} onClick={() => setSelectedFeatureId(feature.id)}><span className="feature-copy"><small>{feature.id} · {feature.priority} · {feature.risk} risk</small><strong>{feature.title}</strong><StatusBadge status={feature.status}/></span><span className="feature-progress"><span className="progress-track"><i style={{width: `${feature.progress}%`}}/></span><b>{feature.progress}%</b></span></button>)}</div>{selectedFeature && <FeatureDetail feature={selectedFeature}/>}</div></>}</div>
    </section>
  </div>;
}

function StatusBadge({ status }: { status: TrackerStatus }) {
  return <span className={`status-badge status-${status.toLowerCase()}`}>{status.replaceAll("_", " ").toLowerCase()}</span>;
}

function FeatureDetail({ feature }: { feature: TrackerFeature }) {
  const current = trackerCheckpoints.indexOf(feature.checkpoint);
  return <article className="feature-detail"><div><p className="eyebrow">SELECTED FEATURE</p><h3>{feature.id} · {feature.title}</h3><StatusBadge status={feature.status}/></div><dl className="feature-detail-grid"><div><dt>Owner</dt><dd>{feature.owner}</dd></div><div><dt>Dependencies</dt><dd>{feature.dependencies}</dd></div><div><dt>Evidence / acceptance</dt><dd>{feature.evidence}</dd></div><div><dt>Risk</dt><dd>{feature.risk}</dd></div></dl><div><p className="eyebrow">STABLE CHECKPOINT</p><ol className="checkpoint-trail">{trackerCheckpoints.map((checkpoint, index) => { const completed = feature.status === "DONE" || index < current; const active = feature.status !== "DONE" && index === current; return <li key={checkpoint} className={completed ? "complete" : active ? "current" : ""}><span>{completed ? "✓" : index + 1}</span><small>{checkpoint.toLowerCase()}</small></li>; })}</ol></div></article>;
}

function Metric({ label, value, change, tone }: { label: string; value: string; change: string; tone: string }) { return <article className={`metric-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>{change}</small></article>; }

function Editorial() {
  const queue = [{ title: "Heat adaptation briefing", risk: "Elevated", status: "Needs review" }, { title: "Language technology funding", risk: "Standard", status: "Fact check" }, { title: "Regional care capacity", risk: "Standard", status: "Draft" }];
  return <div className="page editorial-page"><section className="page-intro"><div><span className="pill pill-gold">EDITORIAL DEMO · NO PUBLISHING</span><h1>Editorial clarity at every gate.</h1><p>A non-operational preview of review queues, coverage health, and AI-assisted workflow states.</p></div><button className="button primary">Open review queue</button></section><section className="metric-grid"><Metric label="Awaiting review" value="14" change="Fictional queue" tone="gold"/><Metric label="Source coverage" value="42" change="Demo sources" tone="indigo"/><Metric label="Corrections" value="0" change="No live publications" tone="green"/><Metric label="AI drafts" value="9" change="Human review required" tone="violet"/></section><section className="editorial-grid"><div className="panel"><div className="panel-heading"><div><p className="eyebrow">REVIEW QUEUE</p><h2>Priority work</h2></div><button className="text-button">View all →</button></div><div className="review-list">{queue.map((item) => <article key={item.title}><span className="review-icon">N</span><div><h3>{item.title}</h3><p>Demo cluster · 3–5 fictional sources</p></div><span className={item.risk === "Elevated" ? "badge warning" : "badge"}>{item.risk}</span><strong>{item.status}</strong></article>)}</div></div><div className="panel coverage-panel"><p className="eyebrow">GEOGRAPHIC COVERAGE</p><h2>Country-neutral monitoring</h2><div className="donut"><span>Demo<small>mix</small></span></div><ul><li><i className="indigo"/>Priority English markets <b>38%</b></li><li><i className="violet"/>Europe <b>18%</b></li><li><i className="gold"/>Africa <b>16%</b></li><li><i className="green"/>Asia-Pacific <b>17%</b></li><li><i className="info"/>Latin America & other <b>11%</b></li></ul><p className="fine-print">Planning visual only. Commercial priority never determines editorial importance.</p></div></section></div>;
}
