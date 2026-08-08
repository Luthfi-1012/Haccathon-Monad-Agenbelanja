'use client';

import React, { useState } from 'react';
import { ArrowRight, RefreshCw, ShoppingCart, DollarSign, AlertCircle, ShieldCheck, Sparkles, Tag } from 'lucide-react';
import Image from 'next/image';
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

  const presets: { id: ScenarioPreset; label: string; item: string; budget: number; category: string }[] = [
    { id: 'scenario_1', label: 'Direct Match (Keyboard)', item: 'Mechanical keyboard', budget: 50, category: 'keyboard' },
    { id: 'scenario_2', label: 'Negotiated Deal (Headset)', item: 'Gaming headset', budget: 50, category: 'headset' },
    { id: 'scenario_3', label: 'No Deal (Mouse)', item: 'Wireless mouse', budget: 35, category: 'mouse' },
  ];

  const getProductImageInfo = (text: string) => {
    const lower = text.toLowerCase();
    if (lower.includes('keyboard')) {
      return { src: '/products/keyboard.png', title: 'Mechanical Keyboard', badge: 'Keyboard Category' };
    }
    if (lower.includes('mouse')) {
      return { src: '/products/mouse.png', title: 'Wireless Mouse', badge: 'Mouse Category' };
    }
    return { src: '/products/headset.png', title: 'Gaming Headset', badge: 'Headset Category' };
  };

  const currentProduct = getProductImageInfo(itemDescription);

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
        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={18} color="var(--primary)" /> Request Composer
        </h3>
        <span className="chip" style={{ fontSize: '0.75rem', padding: '0.3rem 0.75rem' }}>
          Autonomous Agent Setup
        </span>
      </div>

      {/* Preset Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.35rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginRight: '0.2rem' }}>
          Demo Categories:
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
              fontWeight: selectedScenario === p.id ? 700 : 600,
              padding: '0.35rem 0.85rem',
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
          padding: '0.65rem 0.85rem', background: 'var(--danger-subtle)',
          border: '1px solid rgba(239,68,68,0.3)', borderRadius: 'var(--radius-sm)',
          color: '#fca5a5', fontSize: '0.85rem', marginBottom: '1rem',
        }}>
          <AlertCircle size={16} /> {errorMsg}
        </div>
      )}

      {/* Form Controls with Product Image Thumbnail */}
      <form onSubmit={handleSubmit}>
        <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 200px', gap: '1rem', marginBottom: '1.25rem', alignItems: 'center' }}>
          {/* Dynamic Product Image Card */}
          <div style={{
            position: 'relative',
            width: 120,
            height: 120,
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-recessed)',
            border: '1px solid var(--border-default)',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(131, 110, 249, 0.15)',
          }}>
            <Image
              src={currentProduct.src}
              alt={currentProduct.title}
              fill
              sizes="120px"
              style={{ objectFit: 'cover' }}
              priority
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              inset: 'auto 0 0 0',
              background: 'rgba(6, 7, 10, 0.75)',
              backdropFilter: 'blur(4px)',
              padding: '0.2rem 0.4rem',
              fontSize: '0.62rem',
              fontWeight: 700,
              color: '#a594fd',
              textAlign: 'center',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            }}>
              {currentProduct.title}
            </div>
          </div>

          {/* Product Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <ShoppingCart size={14} color="var(--primary)" /> Product Description
            </label>
            <input
              type="text"
              className="form-input"
              value={itemDescription}
              onChange={(e) => { setItemDescription(e.target.value); if (errorMsg) setErrorMsg(null); }}
              placeholder="e.g. Gaming headset, Mechanical keyboard, or Wireless mouse"
              disabled={isLoading}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
              <Tag size={12} color="var(--primary)" />
              Detected category: <strong style={{ color: 'var(--primary)' }}>{currentProduct.badge}</strong>
            </div>
          </div>

          {/* Budget Input */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-secondary)' }}>
              <DollarSign size={14} color="var(--primary)" /> Max Budget (USDC)
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
                fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)', pointerEvents: 'none',
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
            style={{ flex: 1, padding: '0.85rem', fontSize: '0.95rem' }}
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
            style={{ padding: '0.85rem 1.35rem', fontSize: '0.88rem' }}
          >
            Reset
          </button>
        </div>

        {/* Safeguard Hint */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.85rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <ShieldCheck size={14} color="var(--primary)" />
          Agent rule engine automatically prevents offers above your {budgetAmount || 50} USDC budget limit.
        </div>
      </form>
    </div>
  );
};
