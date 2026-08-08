'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/Header';
import { OrderForm } from '@/components/OrderForm';
import { VendorCards } from '@/components/VendorCards';
import { Timeline } from '@/components/Timeline';
import { ResultPanel } from '@/components/ResultPanel';
import { ArenaCard } from '@/components/ArenaCard';
import { Order, VendorId } from '@/types/negotiation';
import { ScenarioPreset, SEED_VENDORS } from '@/lib/vendorSimulator';
import { processX402Payment } from '@/lib/x402';

export default function WorkspacePage() {
  return (
    <Suspense fallback={
      <main className="container" style={{ maxWidth: 1140, paddingTop: 'var(--space-xl)', textAlign: 'center' }}>
        <div style={{ padding: 'var(--space-2xl)', color: 'var(--text-muted)' }}>Loading workspace…</div>
      </main>
    }>
      <WorkspaceContent />
    </Suspense>
  );
}

function WorkspaceContent() {
  const searchParams = useSearchParams();
  const scenarioParam = searchParams.get('scenario');

  const getPresetFromParam = (param: string | null): ScenarioPreset => {
    if (param === 'direct') return 'scenario_1';
    if (param === 'deal') return 'scenario_2';
    if (param === 'nodeal') return 'scenario_3';
    return 'scenario_2';
  };

  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>(getPresetFromParam(scenarioParam));
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [budget, setBudget] = useState(50);
  const [arenaMode, setArenaMode] = useState<boolean>(true);

  const scenarioVendors = SEED_VENDORS[currentScenario];

  useEffect(() => {
    if (scenarioParam && !order) {
      const preset = getPresetFromParam(scenarioParam);
      setCurrentScenario(preset);
      const items: Record<string, { desc: string; budget: number }> = {
        direct: { desc: 'Mechanical keyboard', budget: 50 },
        deal: { desc: 'Gaming headset', budget: 50 },
        nodeal: { desc: 'Wireless mouse', budget: 35 },
      };
      const config = items[scenarioParam] || items.deal;
      setBudget(config.budget);
    }
  }, [scenarioParam, order]);

  const handleStartNegotiation = async (
    itemDescription: string,
    budgetAmount: number,
    scenarioId: ScenarioPreset
  ) => {
    setIsLoading(true);
    setCurrentScenario(scenarioId);
    setBudget(budgetAmount);
    setOrder(null);

    try {
      const res = await fetch('/api/orders/negotiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemDescription,
          budgetAmount,
          scenarioId,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(`Error: ${err.error}`);
        setIsLoading(false);
        return;
      }

      const orderData: Order = await res.json();
      setOrder(orderData);
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePayWithX402 = async (orderId: string, simulateFailure = false) => {
    setIsPaying(true);
    try {
      const updatedOrder = await processX402Payment(orderId, simulateFailure);
      setOrder(updatedOrder);
    } catch (err: any) {
      if (order) {
        setOrder({
          ...order,
          status: 'SETTLEMENT_FAILED',
          errorMessage: err.message || 'Settlement failed',
        });
      }
    } finally {
      setIsPaying(false);
    }
  };

  const handleReset = () => {
    setOrder(null);
    setCurrentScenario('scenario_2');
    setBudget(50);
  };

  const getStatusLabel = () => {
    if (!order && !isLoading) return { text: 'Ready to negotiate', color: 'var(--text-muted)' };
    if (isLoading) return { text: 'Requesting quotes from 3 vendors…', color: 'var(--warning)' };
    if (order?.status === 'NEGOTIATION_COMPLETE') return { text: 'Deal found', color: 'var(--success)' };
    if (order?.status === 'NO_DEAL') return { text: 'No deal', color: 'var(--danger)' };
    if (order?.status === 'SETTLEMENT_SUCCESS') return { text: 'Settled', color: 'var(--success)' };
    if (order?.status === 'SETTLEMENT_FAILED') return { text: 'Settlement failed', color: 'var(--danger)' };
    return { text: 'Processing…', color: 'var(--warning)' };
  };

  const status = getStatusLabel();

  return (
    <main className="container" style={{ maxWidth: 1140, paddingTop: '1rem' }}>
      {/* Back link */}
      <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '1.25rem', textDecoration: 'none' }}>
        <ArrowLeft size={14} /> Back to Home
      </Link>

      <Header
        onResetDemo={handleReset}
        arenaMode={arenaMode}
        onToggleArenaMode={() => setArenaMode((prev) => !prev)}
      />

      {/* Workspace Hero */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)' }}>
            Autonomous Procurement Agent
          </span>
        </div>
        <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
          Find the best deal without exceeding your budget.
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)' }}>
            The agent requests parallel quotes, evaluates vendor responses, and shows every decision in real-time.
          </p>
          <div className="chip" style={{ flexShrink: 0, fontSize: '0.78rem' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: status.color, animation: isLoading ? 'pulse-dot 1.5s infinite' : 'none' }} />
            {status.text}
          </div>
        </div>
      </div>

      <OrderForm
        onStartNegotiation={handleStartNegotiation}
        isLoading={isLoading}
        onReset={handleReset}
        onBudgetChange={(b) => setBudget(b)}
      />

      <VendorCards
        vendors={order?.vendors}
        scenarioVendors={scenarioVendors}
        selectedVendorId={order?.selectedVendorId as VendorId | undefined}
        budgetAmount={budget}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
        <div>
          <Timeline timeline={order?.timeline || []} />
        </div>
        <div>
          {arenaMode ? (
            <ArenaCard order={order} onResetDemo={handleReset} />
          ) : (
            <ResultPanel
              order={order}
              onPayWithX402={handlePayWithX402}
              isPaying={isPaying}
              onResetDemo={handleReset}
            />
          )}
        </div>
      </div>
    </main>
  );
}
