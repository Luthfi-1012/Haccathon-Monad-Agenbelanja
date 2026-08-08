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
          ? 'var(--primary)'
          : isNoDeal || isPaymentFailed
          ? 'rgba(239,68,68,0.3)'
          : 'var(--border-default)',
        padding: '1.25rem 1.5rem',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 className="font-viga" style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Award size={17} color="var(--primary)" /> Outcome & Settlement
        </h3>
        <div>
          {isSettled ? (
            <span className="badge badge-accepted"><CheckCircle2 size={11} /> Settled via x402</span>
          ) : isComplete ? (
            <span className="badge badge-quoted"><CheckCircle2 size={11} /> Deal Agreed</span>
          ) : isPaymentFailed ? (
            <span className="badge badge-rejected"><AlertCircle size={11} /> Settlement Failed</span>
          ) : (
            <span className="badge badge-rejected"><ShieldAlert size={11} /> No Deal</span>
          )}
        </div>
      </div>

      {isNoDeal ? (
        <div style={{
          padding: '1.25rem', background: 'var(--danger-subtle)',
          border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)',
        }}>
          <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.35rem', color: '#fca5a5', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={16} /> Budget Protection Triggered
          </p>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
            All vendors rejected counter-offer of {order.budgetAmount} USDC. Payment is locked to protect your funds.
          </p>
          <button
            className="btn btn-secondary"
            onClick={onResetDemo}
            style={{ width: '100%', padding: '0.65rem', fontSize: '0.85rem' }}
          >
            <RefreshCw size={14} /> Try Another Scenario / Reset
          </button>
        </div>
      ) : (
        <div>
          {/* Summary Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.65rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.75rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Selected Vendor</span>
              <p className="font-viga" style={{ fontSize: '1rem', color: '#ffffff', marginTop: '0.15rem' }}>{order.selectedVendorName}</p>
            </div>
            <div style={{ padding: '0.75rem', background: 'var(--bg-recessed)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Agreed Price</span>
              <p className="mono" style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--primary)', marginTop: '0.15rem' }}>
                {order.initialPrice} <ArrowRight size={12} style={{ display: 'inline', verticalAlign: '-1px' }} /> {order.finalPrice} USDC
              </p>
            </div>
          </div>

          {/* Error Alert */}
          {isPaymentFailed && (
            <div style={{
              padding: '0.65rem 0.85rem', background: 'var(--danger-subtle)',
              border: '1px solid rgba(239,68,68,0.25)', borderRadius: 'var(--radius-sm)',
              color: '#fca5a5', fontSize: '0.82rem', marginBottom: '1rem',
            }}>
              <p style={{ fontWeight: 600 }}>⚠️ {order.errorMessage || 'Settlement failed.'}</p>
            </div>
          )}

          {/* Payment CTA */}
          {!isSettled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                className="btn btn-accent"
                onClick={() => onPayWithX402(order.orderId, false)}
                disabled={isPaying}
                style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Zap size={17} /> {isPaying ? 'Processing x402 Settlement…' : `Pay ${order.finalPrice} USDC via x402`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="chip" style={{ fontSize: '0.7rem' }}>Demo x402 Payment Mode</span>
                <button
                  type="button"
                  style={{
                    background: 'none', border: 'none', color: 'var(--text-muted)',
                    fontSize: '0.72rem', cursor: 'pointer', textDecoration: 'underline',
                  }}
                  onClick={() => onPayWithX402(order.orderId, true)}
                >
                  Simulate Settlement Failure
                </button>
              </div>
            </div>
          ) : (
            <div style={{
              padding: '1rem', background: 'var(--primary-subtle)',
              border: '1px solid var(--border-default)', borderRadius: 'var(--radius-sm)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p className="font-viga" style={{ color: '#a594fd', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} color="var(--primary)" /> Settlement Complete via x402
                  </p>
                  <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                    {isDemoPayment ? 'Demo Payment Verified' : `TX: ${order.transactionReference}`}
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReceiptModal(true)}
                  style={{ padding: '0.4rem 0.75rem', fontSize: '0.75rem' }}
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
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 200, padding: '1rem',
        }}>
          <div className="glass-card" style={{ maxWidth: 440, width: '100%', padding: '1.75rem' }}>
            <h3 className="font-viga" style={{ fontSize: '1.25rem', color: '#ffffff', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <CheckCircle2 size={18} color="var(--primary)" /> x402 Settlement Receipt
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
              {[
                { label: 'Order ID', value: order.orderId, mono: true },
                { label: 'Product', value: order.itemDescription },
                { label: 'Vendor Winner', value: order.selectedVendorName },
                { label: 'Final Price', value: `${order.finalPrice} USDC`, mono: true, color: 'var(--primary)' },
                { label: 'Payer Wallet', value: walletAddress, mono: true },
                { label: 'Network', value: 'Monad Testnet (10143)' },
                { label: 'Mode', value: isDemoPayment ? 'Demo Payment' : 'On-Chain' },
              ].map(({ label, value, mono, color }) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.35rem', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>{label}</span>
                  <span className={mono ? 'mono' : ''} style={{ fontWeight: color ? 700 : 500, color: color || 'var(--text-primary)' }}>{value}</span>
                </div>
              ))}
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowReceiptModal(false)}
              style={{ width: '100%', padding: '0.7rem' }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
