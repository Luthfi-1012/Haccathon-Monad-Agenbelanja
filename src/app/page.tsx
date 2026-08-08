import React from 'react';
import Link from 'next/link';
import {
  Zap, ShieldCheck, ArrowRight, ChevronDown, Eye,
  Store, Clock, CheckCircle2, Activity, Users,
  Lock, FileText, Sparkles
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      {/* ─── Navbar ─── */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <Link href="/" className="wordmark">
            <span className="wordmark-icon"><Zap size={15} /></span>
            AgenBelanja
          </Link>

          <div className="nav-links">
            <a href="#how-it-works" className="nav-link">How It Works</a>
            <a href="#trust" className="nav-link">Why Trust It</a>
            <a href="#scenarios" className="nav-link">Demo Scenarios</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="chip">
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)' }} />
              Built on Monad
            </span>
            <Link href="/app" className="btn btn-primary" style={{ padding: '0.5rem 1.1rem', fontSize: '0.82rem' }}>
              Try Demo <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero ─── */}
      <section className="hero">
        <div className="container">
          <div className="hero-eyebrow animate-fade-in">
            <Sparkles size={13} />
            AGENTIC COMMERCE · MONAD
          </div>

          <h1 className="hero-headline animate-slide-up">
            Shop smarter.<br />
            Negotiation runs on autopilot.
          </h1>

          <p className="hero-sub animate-slide-up" style={{ animationDelay: '100ms' }}>
            Enter what you need and your maximum budget. AgenBelanja requests quotes from multiple vendors in parallel, negotiates the price, and only picks deals that are safe for your budget.
          </p>

          <div className="hero-ctas animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link href="/app" className="btn btn-primary hero-cta-primary">
              Start Negotiation <ArrowRight size={16} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '0.85rem 1.5rem' }}>
              See How It Works <ChevronDown size={15} />
            </a>
          </div>

          {/* Interactive Preview */}
          <div className="preview-container animate-slide-up" style={{ animationDelay: '350ms' }}>
            {/* Request */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Store size={14} color="var(--primary)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 700 }}>Purchase Request</span>
              </div>
              <span className="chip" style={{ background: 'var(--primary-subtle)', color: 'var(--primary)', borderColor: 'rgba(131,110,249,0.2)' }}>
                <Users size={11} /> 3 vendors in parallel
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.75rem', marginBottom: 'var(--space-lg)' }}>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Item</span>
                Gaming Headset
              </div>
              <div style={{ padding: '0.6rem 0.85rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', fontSize: '0.85rem', minWidth: '100px' }}>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', display: 'block' }}>Budget</span>
                <span className="mono" style={{ color: 'var(--primary)', fontWeight: 700 }}>50 USDC</span>
              </div>
            </div>

            {/* Mini Vendor Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
              {[
                { name: 'TechStore A', initial: 'T', quote: 48, status: 'winner', color: 'var(--success)' },
                { name: 'ElectroHub B', initial: 'E', quote: 55, status: 'quoted', color: 'var(--primary)' },
                { name: 'DigitalMart C', initial: 'D', quote: 62, status: 'rejected', color: 'var(--text-muted)' },
              ].map((v) => (
                <div key={v.name} style={{
                  padding: '0.6rem',
                  background: v.status === 'winner' ? 'var(--success-subtle)' : 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${v.status === 'winner' ? 'rgba(16,185,129,0.25)' : 'var(--border-subtle)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.3rem' }}>
                    <span style={{
                      width: 20, height: 20, borderRadius: '50%', fontSize: '0.65rem', fontWeight: 700,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: v.status === 'winner' ? 'var(--success)' : 'var(--bg-elevated)',
                      color: v.status === 'winner' ? '#fff' : 'var(--text-muted)',
                    }}>
                      {v.initial}
                    </span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-primary)' }}>{v.name}</span>
                  </div>
                  <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: v.color }}>
                    {v.quote} USDC
                  </div>
                  {v.status === 'winner' && (
                    <div style={{ fontSize: '0.65rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.2rem' }}>
                      <CheckCircle2 size={10} /> Best deal
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Mini Timeline */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {[
                { icon: <Clock size={11} />, text: 'Quotes received from 3 vendors', color: 'var(--text-secondary)' },
                { icon: <Activity size={11} />, text: 'Counter-offer sent: 50 USDC', color: 'var(--primary)' },
                { icon: <CheckCircle2 size={11} />, text: 'Deal agreed — saved 2 USDC', color: 'var(--success)' },
              ].map((e, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.3rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-recessed)', fontSize: '0.72rem', color: e.color }}>
                  {e.icon}
                  <span>{e.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Strip */}
          <div className="tech-strip">
            {[
              { icon: <Users size={13} />, text: '3 Parallel Vendors' },
              { icon: <ShieldCheck size={13} />, text: 'Budget Guard' },
              { icon: <Zap size={13} />, text: 'x402 Settlement' },
              { icon: <Lock size={13} />, text: 'Monad Testnet' },
            ].map((item) => (
              <div key={item.text} className="tech-strip-item">
                {item.icon}
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Problem → Solution ─── */}
      <section className="section" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'var(--space-2xl)' }}>
            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--danger)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)', display: 'block' }}>The Problem</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
                Manual shopping leads to late decisions.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  'Comparing prices across vendors takes too long',
                  'Initial quotes often exceed your budget',
                  'No transparent record of how decisions were made',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <span className="mono" style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--danger)', lineHeight: 1, minWidth: '24px' }}>{i + 1}</span>
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 'var(--space-sm)', display: 'block' }}>The Solution</span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: 'var(--space-lg)' }}>
                AgenBelanja turns it into a measurable workflow.
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {[
                  'Parallel quotes — three vendors respond at once',
                  'One controlled counter-offer that never exceeds budget',
                  'Winner selection that respects your limit, every time',
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                    <CheckCircle2 size={16} style={{ color: 'var(--success)', marginTop: '0.15rem', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-heading">How It Works</h2>
            <p className="section-subheading" style={{ margin: '0 auto' }}>
              Four steps from request to settlement. The agent handles everything in between.
            </p>
          </div>

          <div className="stepper">
            {[
              { num: '01', title: 'Set your need', desc: 'Choose what to buy and set your maximum budget. The agent will never exceed this limit.' },
              { num: '02', title: 'Parallel quotes', desc: 'Three vendors receive your request simultaneously and respond with their initial prices.' },
              { num: '03', title: 'Agent evaluates', desc: 'Direct match if a price fits, or one counter-offer — always within your budget.' },
              { num: '04', title: 'Settle transparently', desc: 'Successful deal gets paid. No deal means no payment. Every step is visible.' },
            ].map((step) => (
              <div key={step.num} className="stepper-item">
                <div className="stepper-number">{step.num}</div>
                <h3 className="stepper-title">{step.title}</h3>
                <p className="stepper-desc">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Trust & Technical ─── */}
      <section id="trust" className="trust-section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-xl)' }}>
            <h2 className="section-heading">A fast agent still needs to be trusted.</h2>
            <p className="section-subheading" style={{ margin: '0 auto' }}>
              Three safeguards that keep you in control while the agent works.
            </p>
          </div>

          <div className="trust-grid">
            <div className="trust-card">
              <div className="trust-icon" style={{ background: 'var(--success-subtle)' }}>
                <ShieldCheck size={20} color="var(--success)" />
              </div>
              <h3 className="trust-title">Budget Guard</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The agent never submits a deal above your limit. If no vendor fits, the process stops — no forced transactions.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon" style={{ background: 'var(--primary-subtle)' }}>
                <Eye size={20} color="var(--primary)" />
              </div>
              <h3 className="trust-title">Execution Timeline</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every decision is displayed, not just claimed. Quotes, counter-offers, vendor responses — all visible in sequence.
              </p>
            </div>

            <div className="trust-card">
              <div className="trust-icon" style={{ background: 'var(--accent-cyan-subtle)' }}>
                <Lock size={20} color="var(--accent-cyan)" />
              </div>
              <h3 className="trust-title">Payment Ready</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                x402 for settlement after agreement. Arena On-Chain available as an optional trust layer with on-chain escrow.
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: 'var(--space-xl)', maxWidth: '520px', margin: 'var(--space-xl) auto 0' }}>
            Arena On-Chain mode activates only when enabled in the demo. Default mode uses x402 payment flow.
          </p>
        </div>
      </section>

      {/* ─── Demo Scenarios ─── */}
      <section id="scenarios" className="section">
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-2xl)' }}>
            <h2 className="section-heading">Try a Scenario</h2>
            <p className="section-subheading" style={{ margin: '0 auto' }}>
              Three real outcomes. Pick one and see how the agent handles it.
            </p>
          </div>

          <div className="scenario-grid">
            <Link href="/app?scenario=direct" className="scenario-card" style={{ borderColor: 'rgba(16,185,129,0.15)' }}>
              <div className="scenario-number">01</div>
              <h3 className="scenario-title">Direct Match</h3>
              <p className="scenario-desc">Mechanical keyboard, Budget 50 USDC — the best price already fits.</p>
              <span className="badge badge-accepted" style={{ fontSize: '0.68rem' }}>
                <CheckCircle2 size={10} /> Instant Match
              </span>
            </Link>

            <Link href="/app?scenario=deal" className="scenario-card" style={{ borderColor: 'rgba(131,110,249,0.15)' }}>
              <div className="scenario-number">02</div>
              <h3 className="scenario-title">Negotiated Deal</h3>
              <p className="scenario-desc">Gaming headset, Budget 50 USDC — the agent negotiates until a deal is reached.</p>
              <span className="badge badge-quoted" style={{ fontSize: '0.68rem' }}>
                <Activity size={10} /> Counter-offer Sent
              </span>
            </Link>

            <Link href="/app?scenario=nodeal" className="scenario-card" style={{ borderColor: 'rgba(239,68,68,0.1)' }}>
              <div className="scenario-number">03</div>
              <h3 className="scenario-title">No Deal</h3>
              <p className="scenario-desc">Wireless mouse, Budget 35 USDC — no transaction when budget is not met.</p>
              <span className="badge badge-rejected" style={{ fontSize: '0.68rem' }}>
                <ShieldCheck size={10} /> Budget Protected
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Final CTA ─── */}
      <section style={{ padding: 'var(--space-4xl) 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
            Ready to let the agent negotiate for you?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-xl)', maxWidth: '480px', margin: '0 auto var(--space-xl)' }}>
            Open the workspace, set your budget, and watch it work.
          </p>
          <Link href="/app" className="btn btn-primary hero-cta-primary">
            Open AgenBelanja Workspace <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer className="landing-footer">
        <div className="container">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-md)' }}>
            <div>
              <div className="wordmark" style={{ marginBottom: '0.25rem', fontSize: '0.95rem' }}>
                <span className="wordmark-icon" style={{ width: 22, height: 22 }}><Zap size={11} /></span>
                AgenBelanja
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Agentic Commerce on Monad</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-lg)' }}>
              <Link href="/app" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>Workspace</Link>
              <a href="#how-it-works" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>How It Works</a>
              <a href="https://github.com/Luthfi-1012/Haccathon-Monad-Agenbelanja" target="_blank" rel="noreferrer" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>GitHub</a>
            </div>
          </div>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 'var(--space-lg)', textAlign: 'center' }}>
            Hackathon demo — uses simulated vendor data.
          </p>
        </div>
      </footer>
    </>
  );
}
