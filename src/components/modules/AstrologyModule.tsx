'use client';

import { useState } from 'react';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { sendUSDC, isDevMode, isWhitelisted } from '@/lib/payment';
import { READING_PRICES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReadingCard } from '@/components/ui/ReadingCard';
import { ExpandableInfo } from '@/components/ui/ExpandableInfo';
import { ShareButton } from '@/components/ui/ShareButton';
import { useTranslations, useLanguage } from '@/lib/language-context';
import type { ReadingState } from '@/types';

interface AstrologyResult {
  firstTxDate: string;
  zodiacSign: string;
  symbol: string;
  interpretation: string;
}

export function AstrologyModule() {
  const { walletAddress, connect } = useMiniKit();
  const { language } = useLanguage();
  const t = useTranslations();
  const [state, setState] = useState<ReadingState>('idle');
  const [result, setResult] = useState<AstrologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const treasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

  const handleRead = async () => {
    let addr = walletAddress;
    if (!addr) {
      addr = await connect();
    }
    if (!addr) {
      setError('Connect your wallet to continue.');
      return;
    }
    if (!treasury) {
      setError('Treasury address not configured.');
      return;
    }

    setError(null);

    let txHash: string;
    if (isWhitelisted(addr)) {
      txHash = '0xWHITELIST';
    } else {
      setState('paying');
      try {
        const payment = await sendUSDC(treasury, READING_PRICES.astrology);
        txHash = payment.txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed');
        setState('error');
        return;
      }
    }

    setState('loading');

    try {
      const res = await fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, txHash, language }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResult(data);
      setState('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Reading failed');
      setState('error');
    }
  };

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-[#a78bfa]/80 text-sm">
          {t.astrology.description}
        </p>
      </div>

      {!result && state === 'idle' && (
        <ExpandableInfo howItWorks={t.astrology.howItWorks} history={t.astrology.history} />
      )}

      {!result && state === 'idle' && (
        <button
          onClick={handleRead}
          className="w-full py-3 rounded-xl mystic-btn text-[#c4a25a] font-semibold text-sm active:scale-95 transition-transform duration-150"
        >
          {walletAddress ? t.astrology.buttonConnected : t.common.connectWallet}
        </button>
      )}

      {state === 'paying' && <LoadingSpinner label={t.common.payingLabel} />}
      {state === 'loading' && <LoadingSpinner label={t.astrology.loadingLabel} />}

      {state === 'error' && (
        <>
          <p className="text-center text-xs text-red-400 bg-red-950/30 border border-red-900/40 rounded-lg p-3">
            {error}
          </p>
          <button
            onClick={() => setState('idle')}
            className="w-full py-2 text-xs text-[#a78bfa]/60 hover:text-[#a78bfa] transition-colors"
          >
            {t.common.tryAgain}
          </button>
        </>
      )}

      {result && (
        <div className="space-y-3">
          {isDevMode && (
            <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-yellow-950/40 border border-yellow-700/40">
              <span className="text-yellow-400 text-xs">⚠</span>
              <span className="text-[11px] font-mono font-medium text-yellow-400/90 tracking-wide">
                {t.common.devMode}
              </span>
            </div>
          )}
          {walletAddress && isWhitelisted(walletAddress) && (
            <div className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-violet-950/60 border border-violet-600/40">
              <span className="text-violet-300 text-xs">✦</span>
              <span className="text-[11px] font-mono font-medium text-violet-300/90 tracking-wide">
                {t.common.ownerFree}
              </span>
            </div>
          )}
          <ReadingCard title={t.astrology.resultTitle} subtitle={`${t.astrology.firstTx} ${new Date(result.firstTxDate).toLocaleDateString()}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0e0620] border border-[#c4a25a]/50 flex items-center justify-center text-3xl shadow-lg shadow-[#c4a25a]/15">
                {result.symbol}
              </div>
              <div>
                <p className="text-xl font-bold text-[#c4a25a]">{result.zodiacSign}</p>
                <p className="text-xs text-[#a78bfa]/60">{t.astrology.birthSign}</p>
              </div>
            </div>
          </ReadingCard>

          <ReadingCard title={t.common.oracleReading}>
            <p className="text-sm text-[#e2d9f3]/85 leading-relaxed whitespace-pre-wrap">
              {result.interpretation}
            </p>
          </ReadingCard>

          <ShareButton text={t.astrology.shareText(result.zodiacSign)} />
        </div>
      )}
    </div>
  );
}
