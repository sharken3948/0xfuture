'use client';

import { useState } from 'react';
import { useTranslations } from '@/lib/language-context';

interface ExpandableInfoProps {
  howItWorks: string;
  history: string;
}

export function ExpandableInfo({ howItWorks, history }: ExpandableInfoProps) {
  const [open, setOpen] = useState(false);
  const t = useTranslations();

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-center gap-1 w-full text-[14px] font-semibold tracking-wider text-[#c4a25a] hover:text-[#d4b26a] transition-colors duration-200"
      >
        <span>{t.common.howDoesThisWork}</span>
        <span
          className="inline-block leading-none transition-transform duration-300"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          ↓
        </span>
      </button>

      {/* CSS grid trick: animates height without knowing the target height */}
      <div
        style={{
          display: 'grid',
          gridTemplateRows: open ? '1fr' : '0fr',
          transition: 'grid-template-rows 0.35s ease',
        }}
      >
        <div className="overflow-hidden">
          <div className="pt-3 space-y-3 max-w-prose">

            <p className="text-[14px] leading-relaxed text-[#9d8ec4]">
              {howItWorks}
            </p>

            <div className="border-t border-[#a78bfa]/15" />

            <div className="space-y-1.5 pb-1">
              <p className="text-[14px] font-semibold tracking-wider text-[#c4a25a]">{t.common.history}</p>
              <p className="text-[14px] leading-relaxed text-[#6b5f8a]">
                {history}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
