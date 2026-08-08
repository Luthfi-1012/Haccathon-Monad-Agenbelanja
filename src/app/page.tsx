'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { OrderForm } from '@/components/OrderForm';
import { VendorCards } from '@/components/VendorCards';
import { Timeline } from '@/components/Timeline';
import { ResultPanel } from '@/components/ResultPanel';
import { Order, VendorId } from '@/types/negotiation';
import { ScenarioPreset, SEED_VENDORS } from '@/lib/vendorSimulator';
import { processX402Payment } from '@/lib/x402';

export default function Home() {
  const [currentScenario, setCurrentScenario] = useState<ScenarioPreset>('scenario_2');
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [budget, setBudget] = useState(50);

  const scenarioVendors = SEED_VENDORS[currentScenario];

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
      alert(`Terjadi kesalahan: ${err.message}`);
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
          errorMessage: err.message || 'Settlement gagal diproses',
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

  return (
    <main className="container">
      <Header onResetDemo={handleReset} />

      <OrderForm
        onStartNegotiation={handleStartNegotiation}
        isLoading={isLoading}
        onReset={handleReset}
      />

      <VendorCards
        vendors={order?.vendors}
        scenarioVendors={scenarioVendors}
        selectedVendorId={order?.selectedVendorId as VendorId | undefined}
        budgetAmount={budget}
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        <div>
          <Timeline timeline={order?.timeline || []} />
        </div>
        <div>
          <ResultPanel
            order={order}
            onPayWithX402={handlePayWithX402}
            isPaying={isPaying}
            onResetDemo={handleReset}
          />
        </div>
      </div>
    </main>
  );
}
