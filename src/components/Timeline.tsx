'use client';

import React, { useEffect, useRef } from 'react';
import { Activity, Bot, Store, CheckCircle2, AlertTriangle, FileText } from 'lucide-react';
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
      <div className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
        <FileText size={20} color="var(--primary)" style={{ opacity: 0.5, marginBottom: '0.4rem' }} />
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Real-time agent log will populate here once negotiation is initiated.
        </p>
      </div>
    );
  }

  const getIcon = (actor: NegotiationEvent['actor'], eventType: NegotiationEvent['eventType']) => {
    if (eventType === 'NO_DEAL' || eventType === 'SETTLEMENT_FAILED')
      return <AlertTriangle size={14} color="var(--danger)" />;
    if (eventType === 'VENDOR_SELECTED' || eventType === 'SETTLEMENT_SUCCESS')
      return <CheckCircle2 size={14} color="var(--success)" />;
    if (actor === 'agent') return <Bot size={14} color="var(--primary)" />;
    if (actor === 'system') return <Activity size={14} color="var(--text-secondary)" />;
    return <Store size={14} color="var(--primary)" />;
  };

  return (
    <div className="glass-card" style={{ padding: '1.25rem 1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h3 className="font-viga" style={{ fontSize: '1.05rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <Activity size={16} color="var(--primary)" /> Execution Audit Log
        </h3>
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          {timeline.length} events
        </span>
      </div>

      <div ref={listRef} style={{
        display: 'flex', flexDirection: 'column', gap: '0.35rem',
        maxHeight: '400px', overflowY: 'auto', paddingRight: '0.25rem',
        position: 'relative',
      }}>
        {/* Vertical Line */}
        <div style={{
          position: 'absolute', left: '17px', top: '14px', bottom: '14px',
          width: '1px', background: 'var(--border-subtle)', zIndex: 0,
        }} />

        {timeline.map((event) => (
          <div
            key={event.eventId}
            className="tl-event"
            style={{
              display: 'flex', alignItems: 'flex-start', gap: '0.7rem',
              padding: '0.55rem 0.65rem', position: 'relative', zIndex: 1,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-recessed)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: 'var(--bg-surface)', border: '1px solid var(--border-default)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0, marginTop: '0.05rem',
            }}>
              {getIcon(event.actor, event.eventType)}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.15rem' }}>
                <span className="font-viga" style={{ fontSize: '0.75rem', color: 'var(--primary)', textTransform: 'uppercase' }}>
                  {event.actor === 'agent' ? 'AGENT' : event.actor === 'system' ? 'SYSTEM' : event.actor.toUpperCase()}
                </span>
                <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  #{event.sequenceNumber} · {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.5 }}>{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
