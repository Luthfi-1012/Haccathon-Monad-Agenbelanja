'use client';

import React, { useEffect, useRef } from 'react';
import { Activity, Bot, Store, CheckCircle, AlertTriangle } from 'lucide-react';
import { NegotiationEvent } from '../types/negotiation';
import gsap from 'gsap';

interface TimelineProps {
  timeline: NegotiationEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && timeline.length > 0) {
      const items = listRef.current.querySelectorAll('.timeline-event-item');
      gsap.fromTo(
        items,
        { opacity: 0, x: -15 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          stagger: 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="glass-card mb-6" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>
        <Activity size={24} style={{ marginBottom: '0.5rem', opacity: 0.5 }} />
        <p style={{ fontSize: '0.875rem' }}>Timeline negosiasi real-time akan muncul setelah Anda menekan tombol Find & Negotiate Price.</p>
      </div>
    );
  }

  const getActorIcon = (actor: NegotiationEvent['actor'], eventType: NegotiationEvent['eventType']) => {
    if (eventType === 'NO_DEAL' || eventType === 'SETTLEMENT_FAILED') {
      return <AlertTriangle size={15} color="#ef4444" />;
    }
    if (eventType === 'VENDOR_SELECTED' || eventType === 'SETTLEMENT_SUCCESS') {
      return <CheckCircle size={15} color="#10b981" />;
    }
    if (actor === 'agent') {
      return <Bot size={15} color="#836ef9" />;
    }
    if (actor === 'system') {
      return <Activity size={15} color="#3b82f6" />;
    }
    return <Store size={15} color="#20e2a2" />;
  };

  return (
    <div className="glass-card mb-6">
      <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
        <Activity size={18} color="#836ef9" /> Negotiation Event Timeline
      </h3>

      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
        {timeline.map((event) => (
          <div
            key={event.eventId}
            className="timeline-event-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              background: 'rgba(10, 14, 26, 0.65)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              borderRadius: '0.625rem',
            }}
          >
            <div
              style={{
                marginTop: '0.15rem',
                padding: '0.4rem',
                borderRadius: '0.4rem',
                background: 'rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getActorIcon(event.actor, event.eventType)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  {event.actor === 'agent' ? '🤖 AgenBelanja' : event.actor === 'system' ? '⚙️ System' : `🏪 ${event.actor}`}
                </span>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>
                  #{event.sequenceNumber} • {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-main)' }}>{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
