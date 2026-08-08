'use client';

import React, { useEffect, useRef } from 'react';
import { Store, Tag, Check, X, Clock } from 'lucide-react';
import { Vendor, VendorStatus, VendorId } from '../types/negotiation';
import gsap from 'gsap';

interface VendorCardsProps {
  vendors?: Record<VendorId, VendorStatus & { initialPrice: number; currentOffer?: number }>;
  scenarioVendors: Record<VendorId, Vendor>;
  selectedVendorId?: VendorId;
  budgetAmount: number;
}

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
      const cards = containerRef.current.querySelectorAll('.tactical-vendor-card');
      gsap.fromTo(
        cards,
        { opacity: 0, y: 10 },
        {
          opacity: 1,
          y: 0,
          duration: 0.35,
          stagger: 0.08,
          ease: 'power2.out',
        }
      );
    }
  }, [vendors, selectedVendorId, budgetAmount]);

  const getStatusBadge = (vendorId: VendorId) => {
    if (selectedVendorId === vendorId) {
      return (
        <span className="badge badge-selected">
          <Check size={11} /> WINNER
        </span>
      );
    }

    const status = vendors ? (vendors[vendorId] as unknown as VendorStatus) : 'WAITING';

    switch (status) {
      case 'SELECTED':
        return (
          <span className="badge badge-selected">
            <Check size={11} /> WINNER
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-accepted">
            <Check size={11} /> ACCEPTED
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-rejected">
            <X size={11} /> REJECTED
          </span>
        );
      case 'NEGOTIATING':
        return (
          <span className="badge badge-negotiating">
            <Clock size={11} /> NEGOTIATING
          </span>
        );
      case 'QUOTED':
        return (
          <span className="badge badge-quoted">
            <Tag size={11} /> QUOTED
          </span>
        );
      default:
        return (
          <span className="badge badge-waiting">
            <Clock size={11} /> WAITING
          </span>
        );
    }
  };

  return (
    <div className="mb-6" style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <h3 style={{ fontSize: '0.95rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
          <Store size={16} color="var(--primary-accent)" /> Parallel Vendor Arena
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          3 Parallel Queries Evaluated
        </span>
      </div>

      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.85rem' }}>
        {vendorList.map((vendor) => {
          const isSelected = selectedVendorId === vendor.vendorId;
          const vState = vendors ? vendors[vendor.vendorId] : undefined;

          // Dynamically scale displayed initial quote relative to user's current budgetAmount
          const displayedInitialQuote = vState?.initialPrice
            ? vState.initialPrice
            : Math.max(1, Math.round(budgetAmount * (vendor.initialPrice / 50)));

          return (
            <div
              key={vendor.vendorId}
              className="tactical-vendor-card glass-card"
              style={{
                padding: '1.1rem',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isSelected ? 'var(--primary-accent)' : undefined,
                background: isSelected ? 'rgba(131, 110, 249, 0.06)' : undefined,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{vendor.vendorName}</h4>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="mono">
                    {vendor.vendorId}
                  </span>
                </div>
                {getStatusBadge(vendor.vendorId)}
              </div>

              {/* Price Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.825rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.65rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Initial Quote:</span>
                  <span className="mono" style={{ fontWeight: 700, color: displayedInitialQuote <= budgetAmount ? 'var(--success-green)' : 'var(--text-primary)' }}>
                    {displayedInitialQuote} USDC
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.45rem 0.65rem', background: '#090a0f', borderRadius: '0.375rem', border: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Agent Limit:</span>
                  <span className="mono" style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>
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
