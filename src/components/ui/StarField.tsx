'use client';

import { useEffect, useRef } from 'react';

const COUNT = 90;
const TWO_PI = Math.PI * 2;

interface Star {
  // positions and drift in physical pixels
  ox: number; oy: number;   // origin (physical px)
  dx: number; dy: number;   // drift vector at peak (physical px), magnitude = 2–4 CSS px × dpr
  period: number;            // seconds for one full drift cycle
  driftPhase: number;        // radian offset so stars start at different points in cycle
  // appearance
  radius: number;            // physical px
  baseAlpha: number;
  twinkleAmp: number;
  twinklePeriod: number;
  twinklePhase: number;
  // colour channel strings, pre-built
  rgb: string;
}

function rnd(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function buildStars(physW: number, physH: number, dpr: number): Star[] {
  return Array.from({ length: COUNT }, (): Star => {
    const cssAmp  = rnd(20, 30);
    const angle   = rnd(0, TWO_PI);
    const violet  = Math.random() < 0.28;
    const blue    = !violet && Math.random() < 0.15;
    const r = violet ? (rnd(180, 220) | 0) : blue ? (rnd(200, 225) | 0) : 255;
    const g = violet ? (rnd(140, 175) | 0) : blue ? (rnd(215, 240) | 0) : 255;
    return {
      ox: rnd(0, physW),
      oy: rnd(0, physH),
      // drift vector in physical pixels so it looks the same on all DPR screens
      dx: Math.cos(angle) * cssAmp * dpr,
      dy: Math.sin(angle) * cssAmp * dpr,
      period:      rnd(8, 12),
      driftPhase:  rnd(0, TWO_PI),
      radius:      rnd(0.5, 1.2) * dpr,
      baseAlpha:   rnd(0.35, 0.9),
      twinkleAmp:  rnd(0.2, 0.45),
      twinklePeriod: rnd(3, 8),
      twinklePhase:  rnd(0, TWO_PI),
      rgb: `${r},${g},255`,
    };
  });
}

export function StarField() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    let physW = 0;
    let physH = 0;
    let stars: Star[] = [];

    function resize() {
      if (!canvas) return;
      physW = window.innerWidth  * dpr;
      physH = window.innerHeight * dpr;
      canvas.width  = physW;
      canvas.height = physH;
      canvas.style.width  = window.innerWidth  + 'px';
      canvas.style.height = window.innerHeight + 'px';
      // no ctx.setTransform / scale — we work entirely in physical pixels
      stars = buildStars(physW, physH, dpr);
    }

    resize();
    window.addEventListener('resize', resize, { passive: true });

    let raf = 0;

    function frame() {
      if (!ctx) return;
      const t = performance.now() / 1000;

      ctx.clearRect(0, 0, physW, physH);

      for (const s of stars) {
        // oscillate along the pre-computed drift vector
        const osc = Math.sin(TWO_PI * t / s.period + s.driftPhase);
        const x = s.ox + s.dx * osc;
        const y = s.oy + s.dy * osc;

        const alpha = Math.max(0.02, Math.min(1,
          s.baseAlpha + Math.sin(TWO_PI * t / s.twinklePeriod + s.twinklePhase) * s.twinkleAmp,
        ));

        ctx.beginPath();
        ctx.arc(x, y, s.radius, 0, TWO_PI);
        ctx.fillStyle = `rgba(${s.rgb},${alpha.toFixed(2)})`;
        ctx.fill();
      }

      raf = requestAnimationFrame(frame);
    }

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 0 }}
    />
  );
}
