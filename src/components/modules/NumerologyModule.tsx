'use client';

import { useState } from 'react';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReadingCard } from '@/components/ui/ReadingCard';
import { ExpandableInfo } from '@/components/ui/ExpandableInfo';
import { ShareButton } from '@/components/ui/ShareButton';
import { useTranslations } from '@/lib/language-context';
import { useLanguage } from '@/lib/language-context';
import type { ReadingState } from '@/types';

interface NumerologyResult {
  digits: number[];
  lifePathNumber: number;
  interpretation: string;
}

export function NumerologyModule() {
  const { walletAddress, connect } = useMiniKit();
  const { language } = useLanguage();
  const t = useTranslations();
  const [state, setState] = useState<ReadingState>('idle');
  const [result, setResult] = useState<NumerologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRead = async () => {
    let addr = walletAddress;
    if (!addr) {
      addr = await connect();
    }
    if (!addr) return;

    setState('loading');
    setError(null);

    try {
      const res = await fetch('/api/numerology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-[#a78bfa]/80 text-sm">
          {t.numerology.description}
        </p>
      </div>

      {!result && state !== 'loading' && (
        <ExpandableInfo howItWorks={t.numerology.howItWorks} history={t.numerology.history} />
      )}

      {!result && state !== 'loading' && (
        <button
          onClick={handleRead}
          className="w-full py-3 rounded-xl mystic-btn text-[#c4a25a] font-semibold text-sm active:scale-95 transition-transform duration-150"
        >
          {walletAddress ? t.numerology.buttonConnected : t.common.connectWallet}
        </button>
      )}

      {state === 'loading' && <LoadingSpinner label={t.numerology.loadingLabel} />}

      {error && (
        <p className="text-center text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg p-3">
          {error}
        </p>
      )}

      {result && (
        <div className="space-y-3">
          <ReadingCard title={t.numerology.resultTitle} subtitle={walletAddress ? `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}` : ''}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-16 h-16 rounded-full bg-[#0e0620] border border-[#c4a25a]/50 flex items-center justify-center text-3xl font-bold text-[#c4a25a] shadow-lg shadow-[#c4a25a]/15">
                {result.lifePathNumber}
              </div>
              <div>
                <p className="text-xs text-[#a78bfa]/60 mb-1">{t.numerology.derivedFrom}</p>
                <div className="flex flex-wrap gap-1 max-w-[180px]">
                  {result.digits.slice(0, 12).map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] w-5 h-5 flex items-center justify-center rounded bg-[#1a0d2e] text-[#a78bfa]"
                    >
                      {d}
                    </span>
                  ))}
                  {result.digits.length > 12 && (
                    <span className="text-[10px] text-[#a78bfa]/50">+{result.digits.length - 12}</span>
                  )}
                </div>
              </div>
            </div>
          </ReadingCard>

          <ReadingCard title={t.common.oracleReading}>
            <p className="text-sm text-[#e2d9f3]/85 leading-relaxed whitespace-pre-wrap">
              {result.interpretation}
            </p>
          </ReadingCard>

          <ShareButton text={t.numerology.shareText(result.lifePathNumber)} />

          <button
            onClick={() => { setResult(null); setState('idle'); }}
            className="w-full py-2 text-xs text-[#a78bfa]/60 hover:text-[#a78bfa] transition-colors"
          >
            {t.numerology.readAgain}
          </button>
        </div>
      )}
    </div>
  );
}
