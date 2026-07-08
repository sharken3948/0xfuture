'use client';

import { useState, useEffect, useRef } from 'react';
import type { Module } from '@/types';
import { TAROT_IMAGES } from '@/lib/constants';
import { useTranslations } from '@/lib/language-context';

/* ── Tarot preview cards ── */
const TAROT_PREVIEW_KEYS = [
  'The Fool',
  'The High Priestess',
  'The Empress',
  'The Chariot',
  'The Star',
  'The Moon',
] as const;

/* ── Sacred geometry number sequences ── */
const CENTER_NUMS  = [1, 2, 3, 7, 9, 11, 22, 33];
const VERTEX_NUMS  = [1, 2, 3, 5, 7, 9, 11, 22, 33];

/* ── Solar system constants (SVG user-units) ── */
const R_EARTH  = 39;
const R_SATURN = 68;
const R_MOON   = 18;
const T_EARTH  = 8000;
const T_SATURN = 14000;
const T_MOON   = 3000;

/* ── Background zodiac glyphs ── */
const ASTRO_GLYPHS = [
  { s: '♈', x: -72, y: -55 },
  { s: '♌', x:  56, y: -65 },
  { s: '♎', x:  76, y:  35 },
  { s: '♒', x: -65, y:  55 },
  { s: '☿', x:  25, y: -76 },
  { s: '♀', x: -30, y: -72 },
  { s: '♂', x:  78, y: -18 },
  { s: '♃', x: -78, y:  18 },
  { s: '♄', x:   2, y:  80 },
] as const;

/* ── Shared label pinned at bottom of each tab ── */
function TabLabel({ name, price, free }: { name: string; price?: string; free?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-0.5 pb-3 lg:pb-5 lg:gap-1">
      <span className="text-[10px] lg:text-[13px] text-[#a78bfa]/70 tracking-wide" style={{ fontFamily: 'Georgia, serif' }}>
        {name}
      </span>
      <span className="text-[13px] lg:text-[15px] font-semibold text-[#c4a25a]/65">{free ? 'FREE' : price}</span>
    </div>
  );
}

/* ─────────────────────────────────────────────────
   Sacred geometry canvas draw
   Called every rAF frame with the DOMHighResTimeStamp.
   W / H are logical CSS pixels (already DPR-scaled on ctx).
───────────────────────────────────────────────── */
function drawGeometry(ctx: CanvasRenderingContext2D, W: number, H: number, t: number) {
  ctx.clearRect(0, 0, W, H);

  const cx = W / 2;
  const cy = H / 2;

  // R: distance from center to outer circle centers
  // chosen so the outer hexagon fits within the canvas with a margin
  const R  = Math.min(W, H) * 0.30;
  const rc = R * 0.54;   // radius of each of the 7 circles

  // Rotation speeds (radians per ms)
  const hexRot   =  t * 0.000110;  // whole 7-circle arrangement — slow CW
  const outerRot = -t * 0.000080;  // outer gold hexagon — CCW
  const innerRot =  t * 0.000145;  // inner purple hexagon — CW

  // 6 outer circle centers
  const verts: { x: number; y: number }[] = [];
  for (let i = 0; i < 6; i++) {
    verts.push({
      x: cx + R * Math.cos(hexRot + (i * Math.PI) / 3),
      y: cy + R * Math.sin(hexRot + (i * Math.PI) / 3),
    });
  }

  const allCenters = [{ x: cx, y: cy }, ...verts];

  // ── 1. Metatron connection lines (all 21 pairs) ──
  ctx.lineWidth = 0.5;
  ctx.strokeStyle = 'rgba(167,139,250,0.18)';
  for (let i = 0; i < allCenters.length; i++) {
    for (let j = i + 1; j < allCenters.length; j++) {
      ctx.beginPath();
      ctx.moveTo(allCenters[i].x, allCenters[i].y);
      ctx.lineTo(allCenters[j].x, allCenters[j].y);
      ctx.stroke();
    }
  }

  // ── 2. Outer gold hexagon (R × 1.28, rotating CCW) ──
  const outerR = R * 1.28;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a  = outerRot + (i * Math.PI) / 3;
    const px = cx + outerR * Math.cos(a);
    const py = cy + outerR * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(196,162,90,0.50)';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // ── 3. Inner purple hexagon (R × 0.68, rotating CW) ──
  const innerR = R * 0.68;
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a  = innerRot + (i * Math.PI) / 3;
    const px = cx + innerR * Math.cos(a);
    const py = cy + innerR * Math.sin(a);
    i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.strokeStyle = 'rgba(167,139,250,0.50)';
  ctx.lineWidth = 1.0;
  ctx.stroke();

  // ── 4. 6 outer circles ──
  ctx.lineWidth = 0.7;
  ctx.strokeStyle = 'rgba(167,139,250,0.28)';
  for (const v of verts) {
    ctx.beginPath();
    ctx.arc(v.x, v.y, rc, 0, Math.PI * 2);
    ctx.stroke();
  }

  // ── 5. Center circle ──
  ctx.beginPath();
  ctx.arc(cx, cy, rc, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(167,139,250,0.42)';
  ctx.lineWidth = 0.9;
  ctx.stroke();

  // ── 6. Vertex numbers ──
  const vi = Math.floor(t / 1500);
  ctx.font = '7px Georgia, serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = 'rgba(167,139,250,0.72)';
  for (let i = 0; i < 6; i++) {
    ctx.fillText(
      String(VERTEX_NUMS[(i + vi) % VERTEX_NUMS.length]),
      verts[i].x,
      verts[i].y,
    );
  }

  // ── 7. Center number — dominant focal point ──
  const cn = CENTER_NUMS[Math.floor(t / 800) % CENTER_NUMS.length];
  ctx.font = 'bold 36px Georgia, serif';
  ctx.fillStyle = '#c4a25a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(String(cn), cx, cy);
}

/* ─────────────────────────────────────────────────
   Main component
───────────────────────────────────────────────── */
interface TabBarProps {
  active: Module;
  onChange: (m: Module) => void;
}

export function TabBar({ active, onChange }: TabBarProps) {
  const t = useTranslations();
  const [cardIndex, setCardIndex] = useState(0);

  /* refs for canvas geometry */
  const numCanvasRef = useRef<HTMLCanvasElement>(null);

  /* refs for solar system */
  const earthRef       = useRef<SVGCircleElement>(null);
  const moonRef        = useRef<SVGCircleElement>(null);
  const saturnGroupRef = useRef<SVGGElement>(null);

  /* tarot card cycling */
  useEffect(() => {
    const id = setInterval(() => setCardIndex(i => (i + 1) % TAROT_PREVIEW_KEYS.length), 2000);
    return () => clearInterval(id);
  }, []);

  /* sacred geometry canvas animation */
  useEffect(() => {
    const canvas = numCanvasRef.current;
    if (!canvas) return;

    let raf: number;

    const boot = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        /* layout not ready yet — retry next frame */
        raf = requestAnimationFrame(boot);
        return;
      }

      const dpr = window.devicePixelRatio || 1;
      canvas.width  = Math.round(rect.width  * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext('2d')!;
      ctx.scale(dpr, dpr);
      const W = rect.width;
      const H = rect.height;

      const draw = (t: number) => {
        drawGeometry(ctx, W, H, t);
        raf = requestAnimationFrame(draw);
      };
      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(boot);
    return () => cancelAnimationFrame(raf);
  }, []);

  /* solar system — rAF, direct DOM mutation, no re-renders */
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (t: number) => {
      if (start === null) start = t;
      const ms = t - start;
      const ea = (ms / T_EARTH)  * Math.PI * 2;
      const ex = R_EARTH  * Math.cos(ea);
      const ey = R_EARTH  * Math.sin(ea);
      const sa = (ms / T_SATURN) * Math.PI * 2;
      const ma = (ms / T_MOON)   * Math.PI * 2;
      earthRef.current?.setAttribute('cx', ex.toFixed(2));
      earthRef.current?.setAttribute('cy', ey.toFixed(2));
      moonRef.current?.setAttribute('cx', (ex + R_MOON * Math.cos(ma)).toFixed(2));
      moonRef.current?.setAttribute('cy', (ey + R_MOON * Math.sin(ma)).toFixed(2));
      saturnGroupRef.current?.setAttribute(
        'transform',
        `translate(${(R_SATURN * Math.cos(sa)).toFixed(2)},${(R_SATURN * Math.sin(sa)).toFixed(2)})`,
      );
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  /*
    h-[180px] (not min-h) is intentional: flex children need a definite
    container height so that flex-1 resolves to a concrete pixel value,
    which in turn lets height:100% work on the canvas element.
  */
  const base =
    'flex-1 flex flex-col justify-between items-center h-[180px] pt-3 px-1.5 rounded-xl transition-all duration-300 overflow-hidden lg:h-[280px] lg:pt-5 lg:px-3 lg:rounded-2xl';

  return (
    <div className="flex gap-2 lg:gap-4">

      {/* ══════════════ NUMEROLOGY — Sacred Geometry ══════════════ */}
      <button
        onClick={() => onChange('numerology')}
        className={`${base} ${
          active === 'numerology'
            ? 'bg-[#1a1030] border-b-2 border-[#a78bfa]'
            : 'bg-[#0f0820] border border-[#a78bfa]/20 hover:bg-[#140c28]'
        }`}
      >
        <div className="flex-1 w-full">
          <canvas ref={numCanvasRef} className="w-full h-full block" />
        </div>
        <TabLabel name={t.tabs.numerology} free />
      </button>

      {/* ══════════════ ASTROLOGY ══════════════ */}
      <button
        onClick={() => onChange('astrology')}
        className={`${base} ${
          active === 'astrology'
            ? 'bg-[#1a1030] border-b-2 border-[#a78bfa]'
            : 'bg-[#0f0820] border border-[#a78bfa]/20 hover:bg-[#140c28]'
        }`}
      >
        <div className="flex-1 w-full flex items-center justify-center">
          <svg width="100%" height="100%" viewBox="-92 -92 184 184" preserveAspectRatio="xMidYMid meet">
            {ASTRO_GLYPHS.map(({ s, x, y }) => (
              <text key={s} x={x} y={y} textAnchor="middle" dominantBaseline="middle"
                fontSize="11" fill="#a78bfa" opacity="0.15"
                style={{ userSelect: 'none', pointerEvents: 'none' }}>
                {s}
              </text>
            ))}
            <circle cx="0" cy="0" r={R_EARTH}  fill="none" stroke="#a78bfa" strokeWidth="0.4" opacity="0.4" strokeDasharray="2.5 3.5" />
            <circle cx="0" cy="0" r={R_SATURN} fill="none" stroke="#a78bfa" strokeWidth="0.4" opacity="0.4" strokeDasharray="2.5 3.5" />
            <text x="0" y="0" textAnchor="middle" dominantBaseline="middle"
              fontSize="48" style={{ userSelect: 'none', pointerEvents: 'none' }}>☀️</text>
            <circle ref={earthRef} cx={R_EARTH} cy="0" r="6" fill="#4dd0e1" />
            <circle ref={moonRef}  cx={R_EARTH + R_MOON} cy="0" r="4" fill="#f1f5f9" opacity="0.88" />
            <g ref={saturnGroupRef} transform={`translate(${R_SATURN},0)`}>
              <ellipse cx="0" cy="0" rx="17" ry="5"               fill="none" stroke="#c4a25a" strokeWidth="1.2" opacity="0.55" />
              <circle  cx="0" cy="0" r="9"                         fill="#c8a35a" />
              <path    d="M -17 0 A 17 5 0 0 0 17 0"               fill="none" stroke="#c4a25a" strokeWidth="1.5" opacity="0.80" />
            </g>
            <g opacity="0">
              <animateTransform attributeName="transform" type="translate"
                values="-85,-50; 60,40; 60,40" keyTimes="0;0.28;1"
                dur="4s" repeatCount="indefinite" calcMode="linear" />
              <animate attributeName="opacity"
                values="0;0.9;0.9;0;0" keyTimes="0;0.02;0.25;0.30;1"
                dur="4s" repeatCount="indefinite" />
              <line x1="-10" y1="-6" x2="0" y2="0" stroke="rgba(255,255,255,0.55)" strokeWidth="1.1" strokeLinecap="round" />
              <circle cx="0" cy="0" r="1.8" fill="white" />
            </g>
          </svg>
        </div>
        <TabLabel name={t.tabs.astrology} price="$0.10" />
      </button>

      {/* ══════════════ TAROT ══════════════ */}
      <button
        onClick={() => onChange('tarot')}
        className={`${base} ${
          active === 'tarot'
            ? 'bg-[#1a1030] border-b-2 border-[#a78bfa]'
            : 'bg-[#0f0820] border border-[#a78bfa]/20 hover:bg-[#140c28]'
        }`}
      >
        <div className="flex-1 w-full flex items-center justify-center">
          <div className="relative w-[62px] h-[96px] lg:w-[92px] lg:h-[140px] rounded overflow-hidden border border-[#c4a25a]/35 shadow-lg shadow-black/50">
            <img
              key={cardIndex}
              src={TAROT_IMAGES[TAROT_PREVIEW_KEYS[cardIndex]]}
              alt=""
              className="w-full h-full object-cover object-top tab-card-fade"
              loading="eager"
            />
          </div>
        </div>
        <TabLabel name={t.tabs.tarot} price="$0.50" />
      </button>

    </div>
  );
}
