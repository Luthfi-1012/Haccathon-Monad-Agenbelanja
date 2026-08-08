'use client';

import React, { useState } from 'react';
import { ArrowRight, RefreshCw, ShoppingCart, DollarSign, AlertCircle, ShieldCheck } from 'lucide-react';
import { ScenarioPreset } from '../lib/vendorSimulator';

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
  const [itemDescription, setItemDescription] = useState('Gaming headset');
  const [budgetAmount, setBudgetAmount] = useState<number>(50);
  const [selectedScenario, setSelectedScenario] = useState<ScenarioPreset>('scenario_2');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const presets: { id: ScenarioPreset; label: string; item: string; budget: number }[] = [
    { id: 'scenario_1', label: 'Direct Match', item: 'Mechanical keyboard', budget: 50 },
    { id: 'scenario_2', label: 'Negotiated Deal', item: 'Gaming headset', budget: 50 },
    { id: 'scenario_3', label: 'No Deal', item: 'Wireless mouse', budget: 35 },
  ];

  const handlePresetSelect = (preset: typeof presets[0]) => {
    setSelectedScenario(preset.id);
    setItemDescription(preset.item);
    setBudgetAmount(preset.budget);
    setErrorMsg(null);
    if (onBudgetChange) onBudgetChange(preset.budget);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemDescription.trim()) { setErrorMsg('Item description is required.'); return; }
    if (budgetAmount <= 0) { setErrorMsg('Budget must be greater than 0 USDC.'); return; }
    setErrorMsg(null);
    onStartNegotiation(itemDescription.trim(), budgetAmount, selectedScenario);
  };

  return (
    <div className="glass-card" style={{ padding: 'var(--space-lg)', marginBottom: 'var(--space-lg)' }}>
      {/* Scenario Presets */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', marginRight: '0.25rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Presets
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip"
            onClick={() => handlePresetSelect(p)}
            style={{
              cursor: 'pointer',
              background: selectedScenario === p.id ? 'var(--primary-subtle)' : undefined,
              color: selectedScenario === p.id ? 'var(--primary)' : undefined,
              borderColor: selectedScenario === p.id ? 'rgba(131,110,249,0.25)' : undefined,
              transition: 'all 150ms ease',
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {errorMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.55rem 0.85rem', background: 'var(--danger-subtle)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)',
          color: '#fca5a5', fontSize: '0.8rem', marginBottom: 'var(--space-md)',
        }}>
          <AlertCircle size={14} /> {errorMsg}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 200px', gap: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <ShoppingCart size={12} color="var(--primary)" /> What do you want to buy?
            </label>
            <input
              type="text"
              className="form-input"
              value={itemDescription}
              onChange={(e) => { setItemDescription(e.target.value); if (errorMsg) setErrorMsg(null); }}
              placeholder="e.g. Gaming headset for online meetings"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <DollarSign size={12} color="var(--success)" /> Max Budget
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                className="form-input mono"
                style={{ paddingRight: '3.5rem', width: '100%' }}
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
              <span style={{
                position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>
                USDC
              </span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, padding: '0.75rem', fontSize: '0.88rem', borderRadius: 'var(--radius-md)' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={15} style={{ animation: 'spin 1s linear infinite' }} /> Processing Parallel Quotes…
              </>
            ) : (
              <>
                Run Parallel Negotiation <ArrowRight size={15} />
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isLoading}
            style={{ padding: '0.75rem 1rem', fontSize: '0.82rem' }}
          >
            Reset
          </button>
        </div>

        {/* Helper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: 'var(--space-sm)', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={12} color="var(--success)" />
          Agent will never submit an offer above your budget.
        </div>
      </form>
    </div>
  );
};
