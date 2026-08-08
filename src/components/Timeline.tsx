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
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.3,
          stagger: 0.04,
          ease: 'power2.out',
        }
      );
    }
  }, [timeline]);

  if (!timeline || timeline.length === 0) {
    return (
      <div className="glass-card mb-6" style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        <Activity size={20} style={{ marginBottom: '0.4rem', opacity: 0.4 }} />
        <p style={{ fontSize: '0.8rem' }}>Real-time execution log will appear when negotiation begins.</p>
      </div>
    );
  }

  const getActorIcon = (actor: NegotiationEvent['actor'], eventType: NegotiationEvent['eventType']) => {
    if (eventType === 'NO_DEAL' || eventType === 'SETTLEMENT_FAILED') {
      return <AlertTriangle size={14} color="var(--danger-red)" />;
    }
    if (eventType === 'VENDOR_SELECTED' || eventType === 'SETTLEMENT_SUCCESS') {
      return <CheckCircle size={14} color="var(--success-green)" />;
    }
    if (actor === 'agent') {
      return <Bot size={14} color="var(--primary-accent)" />;
    }
    if (actor === 'system') {
      return <Activity size={14} color="var(--text-secondary)" />;
    }
    return <Store size={14} color="var(--text-secondary)" />;
  };

  return (
    <div className="glass-card mb-6" style={{ padding: '1.25rem' }}>
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-primary)' }}>
        <Activity size={16} color="var(--primary-accent)" /> Execution Timeline
      </h3>

      <div ref={listRef} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '0.25rem' }}>
        {timeline.map((event) => (
          <div
            key={event.eventId}
            className="timeline-event-item"
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.65rem',
              padding: '0.55rem 0.75rem',
              background: '#090a0f',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.375rem',
            }}
          >
            <div
              style={{
                marginTop: '0.1rem',
                padding: '0.3rem',
                borderRadius: '0.25rem',
                background: 'rgba(255, 255, 255, 0.03)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {getActorIcon(event.actor, event.eventType)}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.15rem' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                  {event.actor === 'agent' ? 'Agent' : event.actor === 'system' ? 'System' : event.actor}
                </span>
                <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  #{event.sequenceNumber} • {new Date(event.timestamp).toLocaleTimeString()}
                </span>
              </div>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-primary)' }}>{event.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
