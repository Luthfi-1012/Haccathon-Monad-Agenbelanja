# AgenBelanja — Design System Specification

## Visual Style Direction: Dark Tactical Commerce Console

A high-contrast, modern, Web3-native command console designed specifically for live hackathon presentations and large-screen demonstrations. The interface emphasizes high-visibility typography, precise state badges, and smooth GSAP-controlled choreography to communicate parallel agentic negotiation and Monad x402 settlement instantly.

---

## Semantic Color Tokens

| Token Name | Hex / Value | Usage |
| :--- | :--- | :--- |
| `bg-console` | `#07090e` | Pitch dark background |
| `bg-card` | `#111625` | Solid dark card surface (no heavy glassmorphism) |
| `bg-card-border` | `rgba(255, 255, 255, 0.08)` | Subtle card perimeter stroke |
| `primary-monad` | `#836ef9` | Monad Purple main accent & active agent state |
| `primary-monad-glow` | `rgba(131, 110, 249, 0.25)` | Focus & winner glow highlights |
| `status-emerald` | `#10b981` | Success / Accepted / Settlement Complete |
| `status-amber` | `#f59e0b` | Pending / Quoted / Negotiating |
| `status-red` | `#ef4444` | Rejected / No-Deal / Settlement Failed |
| `text-primary` | `#f8fafc` | High contrast main headings & values |
| `text-secondary` | `#94a3b8` | Subheadings & labels |
| `text-dim` | `#64748b` | Timestamps & metadata |

---

## Typography & Font Pairing

* **Headings & Primary UI**: `Outfit` (Google Font) — Weights: 600 (Semibold), 700 (Bold), 800 (ExtraBold).
* **Prices, Timestamps, Hashes & Code**: `JetBrains Mono` — Weights: 500 (Medium), 700 (Bold).

### Scale
- **Display Hero**: 2.5rem (40px) / Line height: 1.15
- **Section Heading (H2)**: 1.5rem (24px) / Line height: 1.25
- **Card Title (H3)**: 1.125rem (18px) / Line height: 1.3
- **Body Text**: 0.9375rem (15px) / Line height: 1.5
- **Caption / Meta**: 0.75rem (12px) / Line height: 1.4

---

## Spacing & Density Scale

- **Container Max-Width**: 1140px (Centered single-page layout)
- **Grid Gap**: 1.25rem (20px)
- **Card Padding**: 1.5rem (24px)
- **Section Spacing**: 1.5rem (24px)
- **Control Element Spacing**: 0.5rem (8px)

---

## Border Radius & Shadow Rules

- **Cards**: `border-radius: 0.875rem (14px)`
- **Buttons / Inputs**: `border-radius: 0.5rem (8px)`
- **Badges**: `border-radius: 2rem (32px)`
- **Default Card Shadow**: `0 10px 30px -10px rgba(0,0,0,0.6)`
- **Winner / Highlight Shadow**: `0 0 25px rgba(131, 110, 249, 0.3)`

---

## Card Hierarchy & Status Badges

1. **Header Console**: Compact status row with Monad Testnet badge, x402 badge, wallet state indicator, and Quick Reset button.
2. **Hero Purchase Request Form**: Clear input fields for Item Description & USDC Budget with quick scenario preset selectors.
3. **Vendor Arena (3 Cards)**: Parallel vendor display (TechStore A, ElectroHub B, DigitalMart C) displaying Initial Price, Counter-Offer, and Status Badges (`WAITING`, `QUOTED`, `NEGOTIATING`, `ACCEPTED`, `REJECTED`, `SELECTED`). Floor prices are strictly hidden from the user.
4. **Negotiation Event Timeline**: Chronological, animated agent activity stream highlighting parallel quote requests, counter-offers, and vendor responses.
5. **Result & Settlement Card**: Deal summary card displaying selected vendor, final price, savings, and x402 payment execution.
6. **No-Deal State Card**: High-contrast alert card displayed when all vendors reject the counter-offer, explaining the outcome and offering a reset action.

---

## Motion & GSAP Choreography Rules

- **Engine**: GSAP as main animation controller.
- **Hero Reveal**: Opacity 0 to 1, translateY(20px) (max 0.8s).
- **Vendor Cards Stagger**: 0.1s stagger delay across Vendor A, B, and C to communicate parallel query processing.
- **Timeline Events**: Subtly slide-in from left on state updates.
- **Cleanup**: `gsap.context()` cleanup on unmount or demo reset.
- **Reduced Motion**: Respects `prefers-reduced-motion` media queries.

---

## UI Anti-Patterns to Avoid

❌ Excessive neon glow or rainbow gradients.
❌ Heavy glassmorphism or low-contrast background blurs.
❌ Displaying vendor floor prices to the user.
❌ Complex enterprise charts or irrelevant financial metrics.
❌ Tiny text (< 12px) that cannot be read during a presentation.
❌ Canvas/WebGL 3D background clutter.
