'use client';

import React, { useState } from 'react';
import { ArrowRight, RefreshCw, ShoppingCart, DollarSign, AlertCircle, ShieldCheck, Sparkles } from 'lucide-react';
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
    { id: 'scenario_3', label: 'No Deal (Budget Safe)', item: 'Wireless mouse', budget: 35 },
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
    <div className="glass-card" style={{ padding: '1.5rem', marginBottom: '1.5rem' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <h3 className="font-viga" style={{ fontSize: '1.15rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Sparkles size={16} color="var(--primary)" /> Request Composer
        </h3>
        <span className="chip" style={{ fontSize: '0.72rem' }}>
          Autonomous Agent Setup
        </span>
      </div>

      {/* Preset Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginRight: '0.2rem' }}>
          Presets:
        </span>
        {presets.map((p) => (
          <button
            key={p.id}
            type="button"
            className="chip"
            onClick={() => handlePresetSelect(p)}
            style={{
              cursor: 'pointer',
              background: selectedScenario === p.id ? 'var(--primary-subtle)' : 'var(--surface-translucent)',
              color: selectedScenario === p.id ? '#a594fd' : 'var(--text-secondary)',
              borderColor: selectedScenario === p.id ? 'var(--primary)' : 'var(--border-subtle)',
              fontWeight: selectedScenario === p.id ? 700 : 500,
            }}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {errorMsg && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.6rem 0.85rem', background: 'var(--danger-subtle)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)',
          color: '#fca5a5', fontSize: '0.82rem', marginBottom: '1rem',
        }}>
          <AlertCircle size={15} /> {errorMsg}
        </div>
      )}

      {/* Form Controls */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 220px', gap: '1rem', marginBottom: '1.25rem' }}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <ShoppingCart size={13} color="var(--primary)" /> Product Description
            </label>
            <input
              type="text"
              className="form-input"
              value={itemDescription}
              onChange={(e) => { setItemDescription(e.target.value); if (errorMsg) setErrorMsg(null); }}
              placeholder="e.g. Mechanical gaming keyboard"
              disabled={isLoading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <DollarSign size={13} color="var(--primary)" /> Max Budget (USDC)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                className="form-input mono"
                style={{ paddingRight: '4rem', width: '100%', fontSize: '1rem', fontWeight: 700, color: 'var(--primary)' }}
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
              <span className="mono" style={{
                position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)',
                fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none',
              }}>
                USDC
              </span>
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isLoading}
            style={{ flex: 1, padding: '0.8rem', fontSize: '0.92rem', borderRadius: 'var(--radius-sm)' }}
          >
            {isLoading ? (
              <>
                <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> Processing Agent Negotiation…
              </>
            ) : (
              <>
                Execute Parallel Negotiation <ArrowRight size={16} />
              </>
            )}
          </button>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onReset}
            disabled={isLoading}
            style={{ padding: '0.8rem 1.25rem', fontSize: '0.85rem' }}
          >
            Reset
          </button>
        </div>

        {/* Safeguard Hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <ShieldCheck size={13} color="var(--primary)" />
          Agent rule engine automatically prevents offers above your {budgetAmount || 50} USDC budget limit.
        </div>
      </form>
    </div>
  );
};
