'use client';

import React, { useState } from 'react';
import { Sparkles, RefreshCw, ShoppingCart, DollarSign, AlertCircle } from 'lucide-react';
import { ScenarioPreset } from '../lib/vendorSimulator';
import { BlurText } from './BlurText';

interface OrderFormProps {
  onStartNegotiation: (item: string, budget: number, scenarioId: ScenarioPreset) => void;
  isLoading: boolean;
  onReset: () => void;
  onBudgetChange?: (budget: number) => void;
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onStartNegotiation,
  isLoading,
  onReset,
  onBudgetChange,
}) => {
  const [itemDescription, setItemDescription] = useState('Headset gaming');
  const [budgetAmount, setBudgetAmount] = useState<number>(50);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>('scenario_2');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handlePresetSelect = (preset: ScenarioPreset) => {
    setSelectedScenario(preset);
    setErrorMsg(null);
    let newBudget = 50;
    if (preset === 'scenario_1') {
      setItemDescription('Keyboard mekanikal');
      newBudget = 50;
    } else if (preset === 'scenario_2') {
      setItemDescription('Headset gaming');
      newBudget = 50;
    } else if (preset === 'scenario_3') {
      setItemDescription('Mouse wireless');
      newBudget = 35;
    }
    setBudgetAmount(newBudget);
    if (onBudgetChange) onBudgetChange(newBudget);
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
    <div className="glass-card mb-6" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Title */}
      <div style={{ marginBottom: '1.25rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
          <BlurText text="Autonomous Purchasing Agent" delay={60} />
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Compare parallel vendor quotes, negotiate autonomously, and settle on Monad.
        </p>
      </div>

      {/* Preset Pill Tabs */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, marginRight: '0.25rem' }}>
          Presets:
        </span>
        <button
          type="button"
          className="btn"
          onClick={() => handlePresetSelect('scenario_1')}
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.72rem',
            borderRadius: '0.375rem',
            background: selectedScenario === 'scenario_1' ? 'var(--primary-accent-subtle)' : 'transparent',
            color: selectedScenario === 'scenario_1' ? 'var(--primary-accent)' : 'var(--text-secondary)',
            border: `1px solid ${selectedScenario === 'scenario_1' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
          }}
        >
          Skenario 1 (Direct Match)
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handlePresetSelect('scenario_2')}
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.72rem',
            borderRadius: '0.375rem',
            background: selectedScenario === 'scenario_2' ? 'var(--primary-accent-subtle)' : 'transparent',
            color: selectedScenario === 'scenario_2' ? 'var(--primary-accent)' : 'var(--text-secondary)',
            border: `1px solid ${selectedScenario === 'scenario_2' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
          }}
        >
          Skenario 2 (Negosiasi Deal)
        </button>
        <button
          type="button"
          className="btn"
          onClick={() => handlePresetSelect('scenario_3')}
          style={{
            padding: '0.3rem 0.65rem',
            fontSize: '0.72rem',
            borderRadius: '0.375rem',
            background: selectedScenario === 'scenario_3' ? 'var(--primary-accent-subtle)' : 'transparent',
            color: selectedScenario === 'scenario_3' ? 'var(--primary-accent)' : 'var(--text-secondary)',
            border: `1px solid ${selectedScenario === 'scenario_3' ? 'var(--primary-accent)' : 'var(--border-subtle)'}`,
          }}
        >
          Skenario 3 (No Deal)
        </button>
      </div>

      {/* Validation Message */}
      {errorMsg && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 0.85rem', background: 'var(--danger-red-subtle)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.375rem', color: '#fca5a5', fontSize: '0.8rem', marginBottom: '1rem' }}>
          <AlertCircle size={15} /> {errorMsg}
        </div>
      )}

      {/* Form Fields */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShoppingCart size={13} color="var(--primary-accent)" /> Item Description
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

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={13} color="var(--success-green)" /> Maximum Budget (USDC)
            </label>
            <input
              type="number"
              className="form-input mono"
              value={budgetAmount || ''}
              onChange={(e) => {
                const val = Number(e.target.value);
                setBudgetAmount(val);
                if (onBudgetChange) onBudgetChange(val);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="50"
              min={1}
              disabled={isLoading}
            />
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing Parallel Quotes...
              </>
            ) : (
              <>
                <Sparkles size={16} /> Execute Parallel Negotiation
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isLoading}
            style={{ padding: '0.75rem 1rem', fontSize: '0.85rem' }}
            title="Reset Form"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};
