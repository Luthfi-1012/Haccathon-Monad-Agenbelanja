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
        { opacity: 0, scale: 0.96, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 0.4, ease: 'back.out(1.2)' }
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
          ? 'var(--primary-accent)'
          : isNoDeal || isPaymentFailed
          ? 'rgba(239, 68, 68, 0.4)'
          : 'var(--primary-monad)',
        boxShadow: isSettled
          ? '0 0 24px var(--primary-accent-glow)'
          : '0 0 20px var(--primary-monad-glow)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Award size={20} color={isNoDeal || isPaymentFailed ? '#ef4444' : '#20e2a2'} /> Negotiation & Payment Outcome
        </h3>

        {/* Status Badge */}
        <div>
          {isSettled ? (
            <span className="badge badge-selected"><CheckCircle2 size={13} /> SETTLEMENT BERHASIL</span>
          ) : isComplete ? (
            <span className="badge badge-accepted"><CheckCircle2 size={13} /> KESEPAKATAN TERCAAPAI</span>
          ) : isPaymentFailed ? (
            <span className="badge badge-rejected"><AlertCircle size={13} /> SETTLEMENT GAGAL</span>
          ) : (
            <span className="badge badge-rejected"><ShieldAlert size={13} /> NO DEAL (TANPA KESEPAKATAN)</span>
          )}
        </div>
      </div>

      {isNoDeal ? (
        <div style={{ padding: '1.25rem', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: '0.625rem', color: '#f87171' }}>
          <p style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <AlertCircle size={18} /> No offers match this budget yet.
          </p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
            Seluruh vendor menolak counter-offer sebesar {order.budgetAmount} USDC. Tombol pembayaran dinonaktifkan demi keamanan anggaran.
          </p>

          <button
            className="btn btn-secondary"
            onClick={onResetDemo}
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.875rem' }}
          >
            <RefreshCw size={15} /> Try Another Budget / Reset Demo
          </button>
        </div>
      ) : (
        <div>
          {/* Summary Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '0.85rem', background: 'rgba(10, 14, 26, 0.65)', borderRadius: '0.625rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Selected Vendor:</span>
              <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)' }}>{order.selectedVendorName}</p>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(10, 14, 26, 0.65)', borderRadius: '0.625rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Initial vs Final Price:</span>
              <p className="mono" style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--primary-accent)' }}>
                {order.initialPrice} USDC <ArrowRight size={14} style={{ display: 'inline', margin: '0 0.2rem' }} /> {order.finalPrice} USDC
              </p>
            </div>

            <div style={{ padding: '0.85rem', background: 'rgba(10, 14, 26, 0.65)', borderRadius: '0.625rem', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Budget Compliance:</span>
              <div style={{ marginTop: '0.2rem' }}>
                <span className="badge badge-accepted" style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem' }}>
                  <CheckCircle2 size={11} /> Within Budget ({order.budgetAmount} USDC)
                </span>
              </div>
            </div>
          </div>

          {/* Error Message for SETTLEMENT_FAILED */}
          {isPaymentFailed && (
            <div style={{ padding: '0.85rem 1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '0.5rem', color: '#f87171', fontSize: '0.85rem', marginBottom: '1rem' }}>
              <p style={{ fontWeight: 600 }}>⚠️ {order.errorMessage || 'Settlement pembayaran gagal diproses.'}</p>
            </div>
          )}

          {/* Payment Action Buttons */}
          {!isSettled ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button
                className="btn btn-accent"
                onClick={() => onPayWithX402(order.orderId, false)}
                disabled={isPaying}
                style={{ width: '100%', padding: '0.9rem', fontSize: '1.05rem' }}
              >
                <Zap size={20} /> {isPaying ? 'PAYMENT_PROCESSING (Memproses Settlement)...' : `Pay ${order.finalPrice} USDC with x402`}
              </button>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-quoted" style={{ fontSize: '0.68rem' }}>
                  Demo Payment Mode Active
                </span>
                <button
                  type="button"
                  style={{ background: 'none', border: 'none', color: 'var(--text-dim)', fontSize: '0.75rem', cursor: 'pointer', textDecoration: 'underline' }}
                  onClick={() => onPayWithX402(order.orderId, true)}
                >
                  Uji Simulasi Gagal Settlement
                </button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1.1rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', borderRadius: '0.625rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <p style={{ fontWeight: 700, color: '#34d399', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Settlement Complete via x402!
                  </p>
                  <p className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    Status: {isDemoPayment ? 'Demo Payment Mode Verified' : `TX Ref: ${order.transactionReference}`}
                  </p>
                </div>
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowReceiptModal(true)}
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                >
                  <ExternalLink size={13} /> View Receipt
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Receipt Modal */}
      {showReceiptModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          <div className="glass-card" style={{ maxWidth: '480px', width: '100%', border: '1px solid var(--primary-accent)' }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary-accent)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckCircle2 size={20} /> x402 Settlement Receipt
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
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
                <span className="mono" style={{ color: 'var(--primary-accent)', fontWeight: 700 }}>{order.finalPrice} USDC</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Payer Wallet:</span>
                <span className="mono">{walletAddress}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Network:</span>
                <span>Monad Testnet (Chain ID 10143)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'var(--text-muted)' }}>Mode Settlement:</span>
                <span className="badge badge-quoted" style={{ fontSize: '0.7rem' }}>
                  {isDemoPayment ? 'Demo Payment Mode' : 'On-Chain Settlement'}
                </span>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={() => setShowReceiptModal(false)}
              style={{ width: '100%' }}
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
