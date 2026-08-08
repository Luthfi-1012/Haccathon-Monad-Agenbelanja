'use client';

import React, { useEffect, useRef } from 'react';
import { Store, Tag, Check, X, Clock, Users } from 'lucide-react';
import { Vendor, VendorStatus, VendorId } from '../types/negotiation';
import gsap from 'gsap';

interface VendorCardsProps {
  vendors?: Record<VendorId, VendorStatus & { initialPrice: number; currentOffer?: number }>;
  scenarioVendors: Record<VendorId, Vendor>;
  selectedVendorId?: VendorId;
  budgetAmount: number;
}

const VENDOR_COLORS: Record<VendorId, { bg: string; text: string; initial: string }> = {
  vendor_a: { bg: 'rgba(6, 182, 212, 0.08)', text: '#22d3ee', initial: 'T' },
  vendor_b: { bg: 'rgba(131, 110, 249, 0.08)', text: '#a594fd', initial: 'E' },
  vendor_c: { bg: 'rgba(245, 158, 11, 0.08)', text: '#fbbf24', initial: 'D' },
};

export const VendorCards: React.FC<VendorCardsProps> = ({
  vendors,
  scenarioVendors,
  selectedVendorId,
  budgetAmount,
}) => {
  const vendorList = Object.values(scenarioVendors);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const cards = containerRef.current.querySelectorAll('.vendor-card');
      gsap.fromTo(cards,
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [vendors, selectedVendorId, budgetAmount]);

  const getStatusBadge = (vendorId: VendorId) => {
    if (selectedVendorId === vendorId) {
      return <span className="badge badge-selected"><Check size={10} /> Winner</span>;
    }
    const status = vendors ? (vendors[vendorId] as unknown as VendorStatus) : null;
    switch (status) {
      case 'SELECTED': return <span className="badge badge-selected"><Check size={10} /> Winner</span>;
      case 'ACCEPTED': return <span className="badge badge-accepted"><Check size={10} /> Accepted</span>;
      case 'REJECTED': return <span className="badge badge-rejected"><X size={10} /> Rejected</span>;
      case 'NEGOTIATING': return <span className="badge badge-negotiating"><Clock size={10} /> Negotiating</span>;
      case 'QUOTED': return <span className="badge badge-quoted"><Tag size={10} /> Quoted</span>;
      default: return null;
    }
  };

  return (
    <div style={{ marginBottom: 'var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Store size={15} color="var(--primary)" /> Vendor Arena
        </h3>
        <span className="chip">
          <Users size={11} /> 3 vendors · parallel execution
        </span>
      </div>

      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
        {vendorList.map((vendor) => {
          const isSelected = selectedVendorId === vendor.vendorId;
          const vState = vendors ? vendors[vendor.vendorId] : undefined;
          const colors = VENDOR_COLORS[vendor.vendorId];
          const hasData = !!vendors;

          const displayedQuote = vState?.initialPrice
            ? vState.initialPrice
            : Math.max(1, Math.round(budgetAmount * (vendor.initialPrice / 50)));

          return (
            <div
              key={vendor.vendorId}
              className="vendor-card"
              style={{
                padding: 'var(--space-md)',
                background: isSelected ? 'var(--primary-muted)' : 'var(--bg-surface)',
                border: `1px solid ${isSelected ? 'rgba(131,110,249,0.25)' : 'var(--border-subtle)'}`,
                borderRadius: 'var(--radius-lg)',
                transition: 'all 250ms var(--ease-out)',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: colors.bg, color: colors.text,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  }}>
                    {colors.initial}
                  </span>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{vendor.vendorName}</div>
                    <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{vendor.vendorId}</div>
                  </div>
                </div>
                {getStatusBadge(vendor.vendorId)}
              </div>

              {/* Price Rows */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0.6rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Initial Quote</span>
                  {hasData ? (
                    <span className="mono" style={{
                      fontSize: '0.82rem', fontWeight: 700,
                      color: displayedQuote <= budgetAmount ? 'var(--success)' : 'var(--text-primary)',
                    }}>
                      {displayedQuote} USDC
                    </span>
                  ) : (
                    <span className="skeleton" style={{ width: 60, height: 16, display: 'inline-block' }} />
                  )}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.4rem 0.6rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Budget Limit</span>
                  <span className="mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                    {budgetAmount} USDC
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
