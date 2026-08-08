# AgenBelanja — Hackathon MVP 6-Jam Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build AgenBelanja, an agentic commerce negotiation web app on Monad that queries 3 simulated vendors in parallel, negotiates a price within user budget, and executes x402 payment settlement (with fallback mode).

**Architecture:** Next.js App Router application housing a deterministic TypeScript rule engine for parallel quote negotiation, an in-memory order state orchestrator, HTTP 402 payment endpoints, and a glassmorphic dashboard UI displaying real-time vendor negotiation timelines.

**Tech Stack:** Next.js, React, TypeScript, Vanilla CSS Modules, Viem / Wagmi, x402 HTTP standard.

## Global Constraints

- Scope bounded strictly by `AgenBelanja_MVP_6_Jam.md`.
- No AI / LLM APIs.
- No database, login/auth, custom smart contract, admin dashboard, or product catalog.
- Maximum 1 counter-offer per vendor; agent counter-offer strictly equals `budget_amount`.
- Never submit or select an offer above budget.
- x402 / Monad integration occurs only after negotiation core & UI are operational.

---

### Task 1: Project Scaffolding & Data Types

**Files:**
- Create: `package.json`
- Create: `tsconfig.json`
- Create: `next.config.js`
- Create: `src/types/negotiation.ts`

**Interfaces:**
- Consumes: None
- Produces: `Order`, `Vendor`, `OrderStatus`, `VendorStatus`, `NegotiationEvent` definitions in `src/types/negotiation.ts`.

- [ ] **Step 1: Write types in `src/types/negotiation.ts`**
- [ ] **Step 2: Create Next.js configuration and `package.json`**
- [ ] **Step 3: Run `npm install` to install dependencies**
- [ ] **Step 4: Commit Task 1 changes**

---

### Task 2: Vendor Simulator & Rule Engine Core (With Tests)

**Files:**
- Create: `src/lib/vendorSimulator.ts`
- Create: `src/lib/ruleEngine.ts`
- Create: `tests/ruleEngine.test.ts`

**Interfaces:**
- Consumes: `src/types/negotiation.ts`
- Produces: `requestVendorQuote()`, `runNegotiationOrchestrator()`.

- [ ] **Step 1: Write failing test in `tests/ruleEngine.test.ts` for all 3 demo scenarios**
- [ ] **Step 2: Run test to verify it fails**
- [ ] **Step 3: Implement `src/lib/vendorSimulator.ts` with seed vendor data**
- [ ] **Step 4: Implement deterministic `src/lib/ruleEngine.ts` with parallel `Promise.all` quoting**
- [ ] **Step 5: Run test to verify all 3 scenarios pass**
- [ ] **Step 6: Commit Task 2 changes**

---

### Task 3: Backend API Routes (`/api/orders/negotiate` & `/api/orders/[orderId]/confirm`)

**Files:**
- Create: `src/app/api/orders/negotiate/route.ts`
- Create: `src/app/api/orders/[orderId]/confirm/route.ts`
- Create: `src/lib/orderStore.ts`

**Interfaces:**
- Consumes: `src/lib/ruleEngine.ts`, `src/types/negotiation.ts`
- Produces: `POST /api/orders/negotiate`, `POST /api/orders/[orderId]/confirm` HTTP handlers.

- [ ] **Step 1: Implement `src/lib/orderStore.ts` for in-memory order caching**
- [ ] **Step 2: Implement `src/app/api/orders/negotiate/route.ts`**
- [ ] **Step 3: Implement `src/app/api/orders/[orderId]/confirm/route.ts` with HTTP 402 & `DEMO_PAYMENT_MODE` logic**
- [ ] **Step 4: Test API routes via test script or fetch**
- [ ] **Step 5: Commit Task 3 changes**

---

### Task 4: Responsive Dark-Theme UI & Dashboard Components

**Files:**
- Create: `src/app/globals.css`
- Create: `src/components/Header.tsx`
- Create: `src/components/OrderForm.tsx`
- Create: `src/components/VendorCards.tsx`
- Create: `src/components/Timeline.tsx`
- Create: `src/components/ResultPanel.tsx`
- Create: `src/app/page.tsx`

**Interfaces:**
- Consumes: API endpoints `/api/orders/negotiate` and `/api/orders/[orderId]/confirm`.
- Produces: Complete responsive single-page AgenBelanja application.

- [ ] **Step 1: Create global glassmorphic Dark Mode styles in `src/app/globals.css`**
- [ ] **Step 2: Build `Header.tsx` with Monad badge and scenario switcher**
- [ ] **Step 3: Build `OrderForm.tsx` with quick seed presets**
- [ ] **Step 4: Build `VendorCards.tsx` and `Timeline.tsx` with animated state transitions**
- [ ] **Step 5: Build `ResultPanel.tsx` with x402 payment button and receipt card**
- [ ] **Step 6: Assemble main page `src/app/page.tsx`**
- [ ] **Step 7: Verify UI flow across Scenarios 1, 2, and 3**
- [ ] **Step 8: Commit Task 4 changes**

---

### Task 5: x402 Settlement & Monad Integration + Fallback Mode

**Files:**
- Create: `src/lib/x402.ts`
- Create: `.env.local`
- Modify: `src/components/ResultPanel.tsx`

**Interfaces:**
- Consumes: Monad Testnet RPC & x402 Facilitator config.
- Produces: Wallet payment request and fallback demo payment confirmation modal.

- [ ] **Step 1: Set up `.env.local` with Monad Testnet RPC and x402 environment parameters**
- [ ] **Step 2: Implement `src/lib/x402.ts` with wallet connection & authorization payload**
- [ ] **Step 3: Wire payment button to x402 flow and fallback modal when `DEMO_PAYMENT_MODE=true`**
- [ ] **Step 4: Verify end-to-end payment settlement and receipt generation**
- [ ] **Step 5: Commit Task 5 changes**

---

### Task 6: Documentation & Verification

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write `README.md` with setup instructions, architecture breakdown, and demo mode notes**
- [ ] **Step 2: Run full build check (`npm run build`)**
- [ ] **Step 3: Verify all 3 demo scenarios end-to-end from browser**
- [ ] **Step 4: Commit Task 6 changes**
