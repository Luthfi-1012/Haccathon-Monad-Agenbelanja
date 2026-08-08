  'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Award, CheckCircle2, ShieldAlert, ArrowRight, ExternalLink, Zap, RefreshCw, AlertCircle } from 'lucide-react';
import { Order } from '../types/negotiation';
import gsap from 'gsap';

import { useWallet } from '@/context/WalletContext';

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
  const { address } = useWallet();

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
  const walletAddress = address
    ? `${address.substring(0, 6)}…${address.substring(address.length - 4)}`
    : '0x71C…4e8B';
  const isDemoPayment = order.transactionReference === 'DEMO_MODE_VERIFIED';

  return (
    <div
      ref={cardRef}
      className="glass-card"
      style={{
        borderColor: isSettled
          ? 'rgba(16,185,129,0.3)'
          : isNoDeal || isPaymentFailed
          ? 'rgba(239,68,68,0.2)'
          : 'var(--border-default)',
        padding: 'var(--space-lg)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={15} color={isNoDeal || isPaymentFailed ? 'var(--danger)' : 'var(--success)'} />
          Outcome & Settlement
        </h3>
        <div>
          {isSettled ? (
            <span className="badge badge-accepted"><CheckCircle2 size={10} /> Settled via x402</span>
          ) : isComplete ? (
            <span className="badge badge-quoted"><CheckCircle2 size={10} /> Deal Agreed</span>
          ) : isPaymentFailed ? (
            <span className="badge badge-rejected"><AlertCircle size={10} /> Settlement Failed</span>
          ) : (
            <span className="badge badge-rejected"><ShieldAlert size={10} /> No Deal</span>
          )}
        </div>
      </div>

      {isNoDeal ? (
        <div style={{
          padding: 'var(--space-md)', background: 'var(--danger-subtle)',
          border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-md)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.88rem', marginBottom: '0.3rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <AlertCircle size={15} /> No vendor matched your budget.
          </p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: 'var(--space-md)' }}>
            All vendors rejected the counter-offer of {order.budgetAmount} USDC. No money was spent.
          </p>
          <button
            className="btn btn-secondary"
            onClick={onResetDemo}
            style={{ width: '100%', padding: '0.6rem', fontSize: '0.82rem' }}
          >
            <RefreshCw size={13} /> Try Another Scenario
          </button>
        </div>
      ) : (
        <div>
          {/* Summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: 'var(--space-md)' }}>
            <div style={{ padding: '0.65rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Selected Vendor</span>
              <p style={{ fontSize: '0.92rem', fontWeight: 700 }}>{order.selectedVendorName}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Agreed Price</span>
              <p className="mono" style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--success)' }}>
                {order.initialPrice} <ArrowRight size={11} style={{ display: 'inline', verticalAlign: '-1px', margin: '0 0.15rem' }} /> {order.finalPrice} USDC
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {isPaymentFailed && (
            <div style={{
              padding: '0.6rem 0.8rem', background: 'var(--danger-subtle)',
              border: '1px solid rgba(239,68,68,0.2)', borderRadius: 'var(--radius-sm)',
              color: '#fca5a5', fontSize: '0.8rem', marginBottom: 'var(--space-md)',
            }}>
              <p style={{ fontWeight: 600 }}>⚠️ {order.errorMessage || 'Settlement failed.'}</p>
            </div>
          )}

          {/* Payment */}
          {!isSettled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <button
                className="btn btn-accent"
                onClick={() => onPayWithX402(order.orderId, false)}
                disabled={isPaying}
                style={{ width: '100%', padding: '0.8rem', fontSize: '0.92rem', borderRadius: 'var(--radius-md)' }}
              >
                <Zap size={16} /> {isPaying ? 'Processing x402 Settlement…' : `Pay ${order.finalPrice} USDC with x402`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-quoted" style={{ fontSize: '0.65rem' }}>Demo Payment Mode</span>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    fontSize: '0.7rem', cursor: 'pointer', textDecoration: 'underline',
                  }}
                  onClick={() => onPayWithX402(order.orderId, true)}
                >
                  Simulate Failure
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '0.8rem', background: 'var(--success-subtle)',
              border: '1px solid rgba(16,185,129,0.2)', borderRadius: 'var(--radius-md)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#6ee7b7', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckCircle2 size={14} /> Settlement Complete
                  </p>
                  <p className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.1rem' }}>
                    {isDemoPayment ? 'Demo Mode Verified' : `TX: ${order.transactionReference}`}
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReceiptModal(true)}
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.72rem' }}
                >
                  <ExternalLink size={11} /> Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200, padding: 'var(--space-md)',
        }}>
          <div className="glass-card" style={{ maxWidth: 420, width: '100%', padding: 'var(--space-lg)' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, marginBottom: 'var(--space-md)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={17} color="var(--success)" /> x402 Receipt
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', marginBottom: 'var(--space-lg)' }}>
              {[
                { label: 'Order ID', value: order.orderId },
                { label: 'Item', value: order.itemDescription },
                { label: 'Vendor', value: order.selectedVendorName },
                { label: 'Final Price', value: `${order.finalPrice} USDC`, mono: true, color: 'var(--success)' },
                { label: 'Payer', value: walletAddress, mono: true },
                { label: 'Network', value: 'Monad Testnet (10143)' },
                { label: 'Mode', value: isDemoPayment ? 'Demo' : 'On-Chain' },
              ].map(({ label, value, mono, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className={mono ? 'mono' : ''} style={{ fontWeight: color ? 700 : undefined, color }}>{value}</span>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowReceiptModal(false)}
              style={{ width: '100%', padding: '0.6rem' }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
