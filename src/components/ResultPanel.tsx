  'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { Order } from '../types/negotiation';
import gsap from 'gsap';

interface ResultPanelProps {
  order: Order | null;
  onPayWithX402: (orderId: string, simulateFailure?: boolean) => Promise<void>;
  isPaying: boolean;
  onResetDemo: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  order,
  onPayWithX402,
  isPaying,
  onResetDemo,
}) => {
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && order) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  }, [order?.status]);

  if (!order) return null;

  const isNoDeal = order.status === 'NO_DEAL';
  const isComplete = order.status === 'NEGOTIATION_COMPLETE';
  const isSettled = order.status === 'SETTLEMENT_SUCCESS';
  const isPaymentFailed = order.status === 'SETTLEMENT_FAILED';
  const walletAddress = '0x71C...4e8B';
  const isDemoPayment = order.transactionReference === 'DEMO_MODE_VERIFIED';

  return (
    <div
      ref={cardRef}
      className="glass-card mb-6"
      style={{
        borderColor: isSettled
          ? 'var(--success-green)'
          : isNoDeal || isPaymentFailed
          ? 'var(--danger-red)'
          : 'var(--border-strong)',
        padding: '1.25rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Award size={16} color={isNoDeal || isPaymentFailed ? 'var(--danger-red)' : 'var(--success-green)'} /> Outcome & Settlement
        </h3>

        {/* Status Badge */}
        <div>
          {isSettled ? (
            <span className="badge badge-accepted"><CheckCircle2 size={12} /> SETTLED VIA X402</span>
          ) : isComplete ? (
            <span className="badge badge-quoted"><CheckCircle2 size={12} /> DEAL AGREED</span>
          ) : isPaymentFailed ? (
            <span className="badge badge-rejected"><AlertCircle size={12} /> SETTLEMENT FAILED</span>
          ) : (
            <span className="badge badge-rejected"><ShieldAlert size={12} /> NO DEAL</span>
          )}
        </div>
      </div>

      {isNoDeal ? (
        <div style={{ padding: '1rem', background: 'var(--danger-red-subtle)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '0.375rem', color: '#fca5a5' }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.3rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} /> No offers match target budget.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
            All vendors rejected counter-offer of {order.budgetAmount} USDC. Payment disabled to protect budget.
          </p>

          <button
            className="btn btn-secondary"
            onClick={onResetDemo}
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.8rem' }}
          >
            <RefreshCw size={14} /> Try Another Budget / Reset
          </button>
        </div>
      ) : (
        <div>
          {/* Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '1rem' }}>
            <div style={{ padding: '0.7rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Selected Vendor:</span>
              <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{order.selectedVendorName}</p>
            </div>

            <div style={{ padding: '0.7rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Final Agreed Price:</span>
              <p className="mono" style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--success-green)' }}>
                {order.initialPrice} USDC <ArrowRight size={12} style={{ display: 'inline', margin: '0 0.2rem' }} /> {order.finalPrice} USDC
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {isPaymentFailed && (
            <div style={{ padding: '0.7rem 0.85rem', background: 'var(--danger-red-subtle)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.375rem', color: '#fca5a5', fontSize: '0.8rem', marginBottom: '0.85rem' }}>
              <p style={{ fontWeight: 600 }}>⚠️ {order.errorMessage || 'Settlement failed.'}</p>
            </div>
          )}

          {/* Payment Action */}
          {!isSettled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                className="btn btn-accent"
                onClick={() => onPayWithX402(order.orderId, false)}
                disabled={isPaying}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
              >
                <Zap size={18} /> {isPaying ? 'Processing x402 Settlement...' : `Pay ${order.finalPrice} USDC with x402`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-quoted" style={{ fontSize: '0.68rem' }}>
                  Demo Payment Mode Active
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => onPayWithX402(order.orderId, true)}
                >
                  Simulate Settlement Failure
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '0.85rem', background: 'var(--success-green-subtle)', border: '1px solid rgba(16, 185, 129, 0.25)', borderRadius: '0.375rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    <CheckCircle2 size={15} /> Settlement Complete via x402
                  </p>
                  <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {isDemoPayment ? 'Demo Payment Mode Verified' : `TX Ref: ${order.transactionReference}`}
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReceiptModal(true)}
                  style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem' }}
                >
                  <ExternalLink size={12} /> Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '440px', width: '100%', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={18} color="var(--success-green)" /> x402 Settlement Receipt
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.825rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Order ID:</span>
                <span className="mono">{order.orderId}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Item:</span>
                <span>{order.itemDescription}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Selected Vendor:</span>
                <span>{order.selectedVendorName}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Final Price:</span>
                <span className="mono" style={{ color: 'var(--success-green)', fontWeight: 700 }}>{order.finalPrice} USDC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payer Wallet:</span>
                <span className="mono">{walletAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Network:</span>
                <span>Monad Testnet (10143)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode:</span>
                <span className="badge badge-quoted" style={{ fontSize: '0.68rem' }}>
                  {isDemoPayment ? 'Demo Payment Mode' : 'On-Chain Settlement'}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowReceiptModal(false)}
              style={{ width: '100%', padding: '0.65rem' }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
