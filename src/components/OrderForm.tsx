'use client';

import React, { useState } from 'react';
import { Play, Sparkles, RefreshCw, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';
import { ScenarioPreset } from '../lib/vendorSimulator';
import { BlurText } from './BlurText';

interface OrderFormProps {
  onStartNegotiation: (item: string, budget: number, scenarioId: ScenarioPreset) => void;
  isLoading: boolean;
  onReset: () => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onStartNegotiation,
  isLoading,
  onReset,
}) => {
  const [itemDescription, setItemDescription] = useState('Headset gaming');
  const [budgetAmount, setBudgetAmount] = useState<number>(50);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>('scenario_2');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePresetSelect = (preset: ScenarioPreset) => {
    setSelectedScenario(preset);
    setErrorMsg(null);
    if (preset === 'scenario_1') {
      setItemDescription('Keyboard mekanikal');
      setBudgetAmount(50);
    } else if (preset === 'scenario_2') {
      setItemDescription('Headset gaming');
      setBudgetAmount(50);
    } else if (preset === 'scenario_3') {
      setItemDescription('Mouse wireless');
      setBudgetAmount(35);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDescription.trim()) {
      setErrorMsg('Nama item tidak boleh kosong.');
      return;
    }
    if (budgetAmount <= 0) {
      setErrorMsg('Batas anggaran harus lebih besar dari 0 USDC.');
      return;
    }
    setErrorMsg(null);
    onStartNegotiation(itemDescription.trim(), budgetAmount, selectedScenario);
  };

  return (
    <div className="glass-card mb-6" style={{ padding: '1.75rem' }}>
      {/* Hero Heading Section with BlurText */}
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.4rem', color: 'var(--text-main)' }}>
          <BlurText text="Your Autonomous Purchasing Agent" delay={60} />
        </h2>
        <p style={{ fontSize: '0.925rem', color: 'var(--text-muted)' }}>
          Compare, negotiate, and settle within your budget on Monad.
        </p>
      </div>

      {/* Demo Scenario Preset Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>Scenario Presets:</span>
        <button
          type="button"
          className={`btn ${selectedScenario === 'scenario_1' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handlePresetSelect('scenario_1')}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
        >
          Skenario 1 (Direct Match)
        </button>
        <button
          type="button"
          className={`btn ${selectedScenario === 'scenario_2' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handlePresetSelect('scenario_2')}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
        >
          Skenario 2 (Negosiasi Deal)
        </button>
        <button
          type="button"
          className={`btn ${selectedScenario === 'scenario_3' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handlePresetSelect('scenario_3')}
          style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
        >
          Skenario 3 (No Deal)
        </button>
      </div>

      {/* Validation Alert */}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Form Controls */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Item Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShoppingCart size={14} color="var(--primary-monad)" /> Item / Produk
            </label>
            <input
              type="text"
              className="form-input"
              value={itemDescription}
              onChange={(e) => {
                setItemDescription(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="Contoh: Headset gaming"
              disabled={isLoading}
            />
          </div>

          {/* Budget Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={14} color="var(--primary-accent)" /> Batas Maksimum Anggaran (USDC)
            </label>
            <input
              type="number"
              className="form-input mono"
              value={budgetAmount}
              onChange={(e) => {
                setBudgetAmount(Number(e.target.value));
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="50"
              min={1}
              disabled={isLoading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, padding: '0.85rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={18} className="anim-pulse" /> Find & Negotiate Price...
              </>
            ) : (
              <>
                <Sparkles size={18} /> Find & Negotiate Price
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isLoading}
            title="Reset Form & Demo State"
          >
            <RefreshCw size={16} /> Reset Demo
          </button>
        </div>
      </form>
    </div>
  );
};
