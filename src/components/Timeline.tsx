'use client';

import React, { useEffect, useRef } from 'react';
import { Activity, Bot, Store, CheckCircle, AlertTriangle, FileText } from 'lucide-react';
import { NegotiationEvent } from '../types/negotiation';
import gsap from 'gsap';

interface TimelineProps {
  timeline: NegotiationEvent[];
}

export const Timeline: React.FC<TimelineProps> = ({ timeline }) => {
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && timeline.length > 0) {
      const items = listRef.current.querySelectorAll('.tl-event');
      gsap.fromTo(items,
        { opacity: 0, x: -8 },
        { opacity: 1, x: 0, duration: 0.25, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="glass-card" style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
        <FileText size={18} style={{ opacity: 0.3, marginBottom: '0.3rem' }} />
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          Enter a request to start the negotiation — every step will appear here.
        </p>
      </div>
    );
  }

  const getIcon = (actor: NegotiationEvent['actor'], eventType: NegotiationEvent['eventType']) => {
    if (eventType === 'NO_DEAL' || eventType === 'SETTLEMENT_FAILED')
      return <AlertTriangle size={13} color="var(--danger)" />;
    if (eventType === 'VENDOR_SELECTED' || eventType === 'SETTLEMENT_SUCCESS')
      return <CheckCircle size={13} color="var(--success)" />;
    if (actor === 'agent') return <Bot size={13} color="var(--primary)" />;
    if (actor === 'system') return <Activity size={13} color="var(--text-secondary)" />;
    return <Store size={13} color="var(--accent-cyan)" />;
  };

  const getActorLabel = (actor: NegotiationEvent['actor']) => {
    if (actor === 'agent') return 'Agent';
    if (actor === 'system') return 'System';
    return actor.toUpperCase();
  };

  return (
    <div className="glass-card" style={{ padding: 'var(--space-md) var(--space-lg)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-md)' }}>
        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Activity size={15} color="var(--primary)" /> Agent Decision Trail
        </h3>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          {timeline.length} events
        </span>
      </div>

      <div ref={listRef} style={{
        display: 'flex', flexDirection: 'column', gap: '0.25rem',
        maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem',
        position: 'relative',
      }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute', left: '16px', top: '12px', bottom: '12px',
          width: '1px', background: 'var(--border-subtle)', zIndex: 0,
        }} />

        {timeline.map((event) => (
          <div
            key={event.eventId}
            className="tl-event"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.6rem',
              padding: '0.5rem 0.6rem', position: 'relative', zIndex: 1,
              borderRadius: 'var(--radius-sm)',
              transition: 'background 150ms ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-elevated)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '0.05rem',
            }}>
              {getIcon(event.actor, event.eventType)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.4rem', marginBottom: '0.1rem' }}>
                <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {getActorLabel(event.actor)}
                </span>
                <span className="mono" style={{ fontSize: '0.62rem', color: 'var(--text-muted)', flexShrink: 0 }}>
                  #{event.sequenceNumber} · {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
