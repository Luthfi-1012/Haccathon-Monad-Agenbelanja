'use client';

import React, { useEffect, useRef } from 'react';
import { Store, Tag, Check, X, Clock, Zap } from 'lucide-react';
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
        { opacity: 0, y: 15 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out',
        }
      );
    }
  }, [vendors, selectedVendorId]);

  const getStatusBadge = (vendorId: VendorId) => {
    if (selectedVendorId === vendorId) {
      return (
        <span className="badge badge-selected">
          <Check size={12} /> TERPILIH (WINNER)
        </span>
      );
    }

    const status = vendors ? (vendors[vendorId] as unknown as VendorStatus) : 'WAITING';

    switch (status) {
      case 'SELECTED':
        return (
          <span className="badge badge-selected">
            <Check size={12} /> TERPILIH
          </span>
        );
      case 'ACCEPTED':
        return (
          <span className="badge badge-accepted">
            <Check size={12} /> MENERIMA OFFER
          </span>
        );
      case 'REJECTED':
        return (
          <span className="badge badge-rejected">
            <X size={12} /> MENOLAK OFFER
          </span>
        );
      case 'NEGOTIATING':
        return (
          <span className="badge badge-negotiating anim-pulse">
            <Clock size={12} /> NEGOSIASI
          </span>
        );
      case 'QUOTED':
        return (
          <span className="badge badge-quoted">
            <Tag size={12} /> QUOTED
          </span>
        );
      default:
        return (
          <span className="badge badge-waiting">
            <Clock size={12} /> MENUNGGU
          </span>
        );
    }
  };

  return (
    <div className="mb-6">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Store size={18} color="#836ef9" /> Vendor Arena (Paralel Execution)
        </h3>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          3 Query Vendor Diproses Bersamaan oleh Agent
        </span>
      </div>

      <div ref={containerRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
        {vendorList.map((vendor) => {
          const isSelected = selectedVendorId === vendor.vendorId;

          return (
            <div
              key={vendor.vendorId}
              className="tactical-vendor-card glass-card"
              style={{
                padding: '1.25rem',
                position: 'relative',
                overflow: 'hidden',
                borderColor: isSelected ? 'var(--primary-accent)' : undefined,
                boxShadow: isSelected ? '0 0 24px rgba(32, 226, 162, 0.3)' : undefined,
                background: isSelected ? 'rgba(26, 45, 45, 0.85)' : undefined,
                transition: 'all 0.3s ease',
              }}
            >
              {isSelected && (
                <div
                  style={{
                    position: 'absolute',
                    top: '0',
                    right: '0',
                    background: 'linear-gradient(135deg, #836ef9 0%, #20e2a2 100%)',
                    color: '#090a0f',
                    padding: '0.2rem 0.75rem',
                    fontSize: '0.65rem',
                    fontWeight: 800,
                    borderBottomLeftRadius: '0.5rem',
                    letterSpacing: '0.05em',
                  }}
                >
                  BEST MATCH
                </div>
              )}

              {/* Vendor Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div>
                  <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>{vendor.vendorName}</h4>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }} className="mono">
                    ID: {vendor.vendorId}
                  </span>
                </div>
                {getStatusBadge(vendor.vendorId)}
              </div>

              {/* Price Specification (Floor price strictly hidden from user per rules) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(10, 14, 26, 0.7)', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Harga Awal Vendor:</span>
                  <span className="mono" style={{ fontWeight: 700, color: vendor.initialPrice <= budgetAmount ? '#34d399' : '#f87171' }}>
                    {vendor.initialPrice} USDC
                  </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', background: 'rgba(10, 14, 26, 0.5)', borderRadius: '0.5rem' }}>
                  <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Penawaran Agen (Budget):</span>
                  <span className="mono" style={{ color: 'var(--primary-monad)', fontWeight: 600, fontSize: '0.85rem' }}>
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
