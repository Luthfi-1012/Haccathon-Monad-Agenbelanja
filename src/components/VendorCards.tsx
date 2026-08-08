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
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.3, stagger: 0.06, ease: 'power2.out' }
      );
    }
  }, [vendors, selectedVendorId, budgetAmount]);

  const getStatusBadge = (vendorId: VendorId) => {
    if (selectedVendorId === vendorId) {
      return <span className="badge badge-selected"><Check size={11} /> Winner</span>;
    }
    const status = vendors ? (vendors[vendorId] as unknown as VendorStatus) : null;
    switch (status) {
      case 'SELECTED': return <span className="badge badge-selected"><Check size={11} /> Winner</span>;
      case 'ACCEPTED': return <span className="badge badge-accepted"><Check size={11} /> Accepted</span>;
      case 'REJECTED': return <span className="badge badge-rejected"><X size={11} /> Rejected</span>;
      case 'NEGOTIATING': return <span className="badge badge-quoted"><Clock size={11} /> Negotiating</span>;
      case 'QUOTED': return <span className="badge badge-quoted"><Tag size={11} /> Quoted</span>;
      default: return null;
    }
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h3 className="font-viga" style={{ fontSize: '1.1rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Store size={17} color="var(--primary)" /> Vendor Arena
        </h3>
        <span className="chip" style={{ fontSize: '0.72rem' }}>
          <Users size={12} color="var(--primary)" /> 3 Parallel Agents
        </span>
      </div>

      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {vendorList.map((vendor) => {
          const isSelected = selectedVendorId === vendor.vendorId;
          const vState = vendors ? vendors[vendor.vendorId] : undefined;
          const hasData = !!vendors;

          const displayedQuote = vState?.initialPrice
            ? vState.initialPrice
            : Math.max(1, Math.round(budgetAmount * (vendor.initialPrice / 50)));

          return (
            <div
              key={vendor.vendorId}
              className="vendor-card glass-card"
              style={{
                padding: '1.25rem',
                background: isSelected ? 'var(--primary-subtle)' : 'var(--bg-surface)',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border-default)',
                boxShadow: isSelected ? '0 0 25px rgba(131, 110, 249, 0.25)' : undefined,
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--primary-subtle)',
                    border: '1px solid var(--border-default)',
                    color: 'var(--primary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.8rem', fontWeight: 700, fontFamily: 'var(--font-mono)',
                  }}>
                    {vendor.vendorName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-viga" style={{ fontSize: '0.95rem', color: '#ffffff' }}>{vendor.vendorName}</div>
                    <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{vendor.vendorId}</div>
                  </div>
                </div>
                {getStatusBadge(vendor.vendorId)}
              </div>

              {/* Price Details */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0.75rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Initial Quote</span>
                  {hasData ? (
                    <span className="mono" style={{
                      fontSize: '0.9rem', fontWeight: 700,
                      color: displayedQuote <= budgetAmount ? 'var(--primary)' : 'var(--text-primary)',
                    }}>
                      {displayedQuote} USDC
                    </span>
                  ) : (
                    <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {displayedQuote} USDC
                    </span>
                  )}
                </div>

                <div style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '0.5rem 0.75rem', background: 'var(--bg-recessed)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)',
                }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Budget Cap</span>
                  <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>
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
