'use client';

import React from 'react';

interface BlurTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const BlurText: React.FC<BlurTextProps> = ({
  text,
  className = '',
  delay = 50,
}) => {
  const words = text.split(' ');

  return (
    <span className={`blur-text-container ${className}`} style={{ display: 'inline-block' }}>
      {words.map((word, index) => (
        <span
          key={index}
          className="blur-text-word"
          style={{
            display: 'inline-block',
            marginRight: '0.3em',
            animation: `blurIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${index * delay}ms forwards`,
            opacity: 0,
            filter: 'blur(8px)',
            transform: 'translateY(12px)',
          }}
        >
          {word}
        </span>
      ))}
      <style jsx global>{`
        @keyframes blurIn {
          to {
            opacity: 1;
            filter: blur(0px);
            transform: translateY(0);
          }
        }
      `}</style>
    </span>
  );
};
