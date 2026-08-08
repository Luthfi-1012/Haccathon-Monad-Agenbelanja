import React from 'react';
import Link from 'next/link';
import {
  Zap, ShieldCheck, ArrowRight, ChevronDown, Eye,
  Clock, CheckCircle2, Activity, Users,
  Lock, Cpu, Check
} from 'lucide-react';

export default function LandingPage() {
  return (
    <>
      {/* ─── Minimalist Navbar (Poppins Styling) ─── */}
      <nav className="landing-nav">
        <div className="nav-inner" style={{ maxWidth: 1140, margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" className="wordmark-minimal">
            <span>AgenBelanja</span>
            <span className="brand-dot">.</span>
          </Link>

          <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: '1.75rem' }}>
            <a href="#how-it-works" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>• How It Works</a>
            <a href="#trust" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>• Safeguards</a>
            <a href="#scenarios" style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>• Scenarios</a>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span className="chip" style={{ fontSize: '0.78rem' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', boxShadow: '0 0 8px var(--primary)' }} />
              Monad Testnet
            </span>
            <Link href="/app" className="btn btn-primary" style={{ padding: '0.55rem 1.35rem', fontSize: '0.88rem' }}>
              Open App <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </nav>

      {/* ─── Hero Section ─── */}
      <section className="hero" style={{ padding: '5rem 0 3.5rem', textAlign: 'center' }}>
        <div className="container">
          <h1 className="hero-headline" style={{ maxWidth: 840, margin: '0 auto 1.5rem' }}>
            Automated shopping <span style={{ color: 'var(--primary)' }}>negotiations.</span><br />
            Your budget stays <span style={{ color: 'var(--primary)' }}>locked.</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', maxWidth: 650, margin: '0 auto 2.25rem', lineHeight: 1.6 }}>
            Define what you need and your maximum budget limit. AgenBelanja deploys 3 parallel agents to request quotes, evaluate prices, and execute the best deal on Monad.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link href="/app" className="btn btn-primary" style={{ padding: '0.9rem 2.5rem', fontSize: '1rem' }}>
              Launch Workspace <ArrowRight size={17} />
            </Link>
            <a href="#how-it-works" className="btn btn-secondary" style={{ padding: '0.9rem 1.85rem', fontSize: '0.95rem' }}>
              How It Works <ChevronDown size={16} />
            </a>
          </div>

          {/* Interactive Preview Box */}
          <div className="glass-card" style={{
            maxWidth: 750, margin: '3.5rem auto 0', padding: '1.75rem',
            textAlign: 'left', background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Cpu size={18} color="var(--primary)" />
                <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#fff' }}>Autonomous Agent Request</span>
              </div>
              <span className="chip" style={{ background: 'var(--primary-subtle)', color: '#a594fd', borderColor: 'var(--border-default)' }}>
                <Users size={12} /> 3 Parallel Agents
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ padding: '0.85rem 1.1rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Target Product</span>
                <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>Gaming Headset Pro</span>
              </div>
              <div style={{ padding: '0.85rem 1.1rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', minWidth: 130 }}>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', display: 'block', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Budget Cap</span>
                <span className="mono" style={{ fontSize: '1.05rem', color: 'var(--primary)', fontWeight: 700 }}>50 USDC</span>
              </div>
            </div>

            {/* Vendor Cards Preview */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
              {[
                { name: 'TechStore A', quote: 48, status: 'WINNER', isWinner: true },
                { name: 'ElectroHub B', quote: 55, status: 'COUNTER', isWinner: false },
                { name: 'DigitalMart C', quote: 62, status: 'REJECTED', isWinner: false },
              ].map((v) => (
                <div key={v.name} style={{
                  padding: '0.85rem',
                  background: v.isWinner ? 'var(--primary-subtle)' : 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)',
                  border: `1px solid ${v.isWinner ? 'var(--primary)' : 'var(--border-subtle)'}`,
                }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{v.name}</div>
                  <div className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: v.isWinner ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {v.quote} USDC
                  </div>
                  {v.isWinner && (
                    <div style={{ fontSize: '0.7rem', color: '#a594fd', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
                      <Check size={12} /> Best Match
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Event Log Preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {[
                { icon: <Clock size={13} color="var(--text-muted)" />, text: '3 vendor quotes fetched in parallel' },
                { icon: <Activity size={13} color="var(--primary)" />, text: 'Agent evaluates budget cap: 50 USDC' },
                { icon: <CheckCircle2 size={13} color="var(--success)" />, text: 'Deal agreed with TechStore A (48 USDC) — 2 USDC saved' },
              ].map((e, idx) => (
                <div key={idx} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  padding: '0.5rem 0.85rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', color: 'var(--text-secondary)',
                }}>
                  {e.icon}
                  <span>{e.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section id="how-it-works" style={{ padding: '4.5rem 0', borderTop: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '0.5rem' }}>How AgenBelanja Works</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 540, margin: '0 auto' }}>
              Parallel quote requests, automated budget safety, and instant execution.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            {[
              { num: '01', title: 'Input Product & Limit', desc: 'Define what you need and your absolute maximum budget in USDC.' },
              { num: '02', title: 'Parallel Agent Quotes', desc: 'Agent contacts 3 simulation vendors simultaneously to evaluate prices.' },
              { num: '03', title: 'Smart Rule Evaluation', desc: 'Direct match or 1 counter-offer within budget bounds. Offers over budget are rejected.' },
              { num: '04', title: 'x402 & Monad Settlement', desc: 'Settle instantly via x402 payment flow or Monad Testnet smart contract escrow.' },
            ].map((step) => (
              <div key={step.num} className="glass-card" style={{ padding: '1.75rem', position: 'relative' }}>
                <div className="mono" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '0.75rem' }}>
                  {step.num}
                </div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>
                  {step.title}
                </h3>
                <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Safeguards ─── */}
      <section id="trust" style={{ padding: '4.5rem 0', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '0.5rem' }}>Built-in Safeguards</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: 500, margin: '0 auto' }}>
              Full transparency and total protection for your budget.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                <ShieldCheck size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Strict Budget Guard</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                The agent rule engine enforces your budget ceiling. If no vendor quote meets the requirement, the transaction is safely canceled.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Eye size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Transparent Audit Trail</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Every message, quote request, counter-offer, and decision is logged line by line on the execution timeline.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ width: 42, height: 42, borderRadius: 'var(--radius-sm)', background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', marginBottom: '1rem' }}>
                <Lock size={22} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>Monad Smart Contract</h3>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Optionally toggle Mode Arena On-Chain to escrow funds in `NegosiasiArena.sol` with automatic refund of change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Demo Scenarios ─── */}
      <section id="scenarios" style={{ padding: '4.5rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.75rem' }}>
            <h2 className="section-heading" style={{ marginBottom: '0.5rem' }}>Try a Demo Scenario</h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>
              Click any scenario to jump directly into the pre-filled workspace.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
            <Link href="/app?scenario=direct" className="glass-card" style={{ display: 'block', textDecoration: 'none', padding: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>SCENARIO 01</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Direct Match</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Mechanical keyboard (Budget 50 USDC). Initial quote fits budget directly.
              </p>
              <span className="badge badge-accepted" style={{ fontSize: '0.72rem' }}>
                <CheckCircle2 size={12} /> Instant Agreement
              </span>
            </Link>

            <Link href="/app?scenario=deal" className="glass-card" style={{ display: 'block', textDecoration: 'none', padding: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>SCENARIO 02</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>Negotiated Deal</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Gaming headset (Budget 50 USDC). Agent negotiates 58 USDC quote down to 50 USDC.
              </p>
              <span className="badge badge-quoted" style={{ fontSize: '0.72rem' }}>
                <Activity size={12} /> Agent Counter-Offer
              </span>
            </Link>

            <Link href="/app?scenario=nodeal" className="glass-card" style={{ display: 'block', textDecoration: 'none', padding: '1.5rem' }}>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem', fontWeight: 600 }}>SCENARIO 03</div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff', marginBottom: '0.35rem' }}>No Deal (Budget Safe)</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Wireless mouse (Budget 35 USDC). Vendors reject low offer, protecting user budget.
              </p>
              <span className="badge badge-rejected" style={{ fontSize: '0.72rem' }}>
                <ShieldCheck size={12} /> Budget Protected
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ─── Footer ─── */}
      <footer style={{ borderTop: '1px solid var(--border-subtle)', padding: '2.5rem 0', background: 'var(--bg-base)' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <Link href="/" className="wordmark-minimal" style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>
              <span>AgenBelanja</span>
              <span className="brand-dot">.</span>
            </Link>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Parallel Agentic Commerce on Monad</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <Link href="/app" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Workspace</Link>
            <a href="https://github.com/Luthfi-1012/Haccathon-Monad-Agenbelanja" target="_blank" rel="noreferrer" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 600 }}>GitHub</a>
          </div>
        </div>
      </footer>
    </>
  );
}
