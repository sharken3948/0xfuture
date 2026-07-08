'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { LANGUAGES } from '@/lib/translations';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const current = LANGUAGES.find(l => l.code === language)!;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 lg:gap-2 text-[11px] lg:text-[13px] text-[#a78bfa]/70 hover:text-[#a78bfa] transition-colors px-1.5 py-1 lg:px-2 lg:py-1.5 rounded-lg hover:bg-[#a78bfa]/10"
      >
        <img src={`https://flagcdn.com/24x18/${current.countryCode}.png`} alt={language} width={16} height={12} className="rounded-sm lg:w-5 lg:h-4" />
        <span className="font-mono font-semibold tracking-wider">{language}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl border border-[#a78bfa]/25 bg-[#0d0920] shadow-xl shadow-black/60 overflow-hidden">
          {LANGUAGES.map(l => (
            <button
              key={l.code}
              onClick={() => { setLanguage(l.code); setOpen(false); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-[12px] transition-colors ${
                l.code === language
                  ? 'bg-[#a78bfa]/15 text-[#a78bfa]'
                  : 'text-[#e2d9f3]/70 hover:bg-[#a78bfa]/10 hover:text-[#e2d9f3]'
              }`}
            >
              <img src={`https://flagcdn.com/24x18/${l.countryCode}.png`} alt={l.code} width={20} height={15} className="rounded-sm flex-shrink-0" />
              <span className="flex-1">{l.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
