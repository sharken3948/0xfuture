'use client';

import { useState, useEffect } from 'react';

const TOTAL_MINUTES = 24 * 60;

function getCountdown() {
  const now = new Date();
  const midnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  ));
  const minutesLeft = Math.floor((midnight.getTime() - now.getTime()) / 60_000);
  return {
    hours: Math.floor(minutesLeft / 60),
    minutes: minutesLeft % 60,
    progress: 1 - minutesLeft / TOTAL_MINUTES,
  };
}

export function MidnightCountdown() {
  const [state, setState] = useState(getCountdown);

  useEffect(() => {
    const id = setInterval(() => setState(getCountdown()), 60_000);
    return () => clearInterval(id);
  }, []);

  const glowOpacity = 0.3 + state.progress * 0.7;
  const glowSpread = 4 + state.progress * 8;
  const moonGlow = `0 0 ${glowSpread}px rgba(196,162,90,${glowOpacity.toFixed(2)})`;

  return (
    <div
      title="Readings reset at midnight UTC"
      className="flex flex-col items-center py-1 lg:py-2 cursor-default"
    >
      <span className="text-[11px] lg:text-[15px] font-semibold text-[#c4a25a] leading-none mb-0.5 lg:mb-1.5" style={{ letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
        RESET UTC
      </span>
      <div className="flex items-center justify-center gap-1 lg:gap-2">
        <span
          className="text-[13px] lg:text-[20px] leading-none select-none"
          style={{ textShadow: moonGlow }}
        >
          🌙
        </span>
        <span className="text-[11px] lg:text-[15px] font-semibold text-[#c4a25a] leading-none">
          {state.hours}h {String(state.minutes).padStart(2, '0')}m
        </span>
      </div>
    </div>
  );
}
