'use client';

import { useEffect, useRef, useState } from 'react';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { sendUSDC, isDevMode, isWhitelisted } from '@/lib/payment';
import { readPaidTxHash, writePaidTxHash, clearPaidTxHash } from '@/lib/paymentStorage';
import { readCachedReading, writeCachedReading } from '@/lib/readingCache';
import { READING_PRICES_CENTS } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReadingCard } from '@/components/ui/ReadingCard';
import { ExpandableInfo } from '@/components/ui/ExpandableInfo';
import { ShareButton } from '@/components/ui/ShareButton';
import { useTranslations, useLanguage } from '@/lib/language-context';
import { BCP47_LOCALE } from '@/lib/translations';
import type { ReadingState } from '@/types';

interface AstrologyResult {
  firstTxDate: string;
  zodiacSign: string;
  symbol: string;
  interpretation: string;
  dateSource: 'onchain' | 'derived';
}

export function AstrologyModule() {
  const { walletAddress, connect, selectedChainKey, getWalletClient } = useMiniKit();
  const { language } = useLanguage();
  const t = useTranslations();
  const [state, setState] = useState<ReadingState>('idle');
  const [result, setResult] = useState<AstrologyResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [paidTxHash, setPaidTxHash] = useState<string | null>(null);
  const [isReplay, setIsReplay] = useState(false);
  const prevIdentity = useRef<string>('');

  // Rehydrate on mount or identity (wallet / chain) change:
  //   - paid txHash from sessionStorage so a refresh never re-charges mid-flow
  //   - today's cached result from localStorage so one UTC day = one reading
  useEffect(() => {
    const identity = `${walletAddress ?? ''}|${selectedChainKey}`;
    const identityChanged = prevIdentity.current !== identity;
    prevIdentity.current = identity;

    setPaidTxHash(readPaidTxHash('astrology', walletAddress, selectedChainKey));
    const cached = readCachedReading<AstrologyResult>('astrology', walletAddress);
    if (cached) {
      setResult(cached);
      setIsReplay(true);
      setState('done');
      setError(null);
    } else if (identityChanged) {
      setResult(null);
      setIsReplay(false);
      setError(null);
      setState('idle');
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- hydration-safe: storage must not be read during SSR
  }, [walletAddress, selectedChainKey]);

  const treasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;

  const handleRead = async () => {
    let addr = walletAddress;
    if (!addr) {
      addr = await connect();
    }
    if (!addr) return;
    if (!treasury) {
      setError(t.common.treasuryNotConfigured);
      return;
    }

    setError(null);

    let txHash = paidTxHash;
    if (!txHash) {
      if (isWhitelisted(addr)) {
        txHash = '0xWHITELIST';
      } else if (isDevMode) {
        setState('paying');
        await new Promise((r) => setTimeout(r, 800));
        txHash = '0xDEV_SIMULATED';
      } else {
        setState('paying');
        try {
          const walletClient = await getWalletClient();
          const payment = await sendUSDC(
            treasury as `0x${string}`,
            selectedChainKey,
            walletClient,
            READING_PRICES_CENTS.astrology,
          );
          txHash = payment.txHash;
          writePaidTxHash('astrology', addr, selectedChainKey, txHash);
        } catch (err) {
          setError(err instanceof Error ? err.message : t.common.paymentFailed);
          setState('error');
          return;
        }
      }
      setPaidTxHash(txHash);
    }

    setState('loading');

    const callApi = async () =>
      fetch('/api/astrology', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address: addr, txHash, language, chainKey: selectedChainKey }),
      });

    const RETRY_FAILED_MSG = t.common.retryFailedMsg;

    try {
      let data: { error?: string } & Partial<AstrologyResult> = {};
      for (let attempt = 0; attempt < 3; attempt++) {
        const res = await callApi();
        data = {};
        try {
          data = await res.json();
        } catch {
          // non-JSON response — fall through
        }
        if (res.ok && typeof data.zodiacSign === 'string') {
          const resultData = data as AstrologyResult;
          setResult(resultData);
          writeCachedReading('astrology', addr, resultData);
          setIsReplay(Boolean((data as { sameDayReplay?: unknown }).sameDayReplay));
          clearPaidTxHash('astrology', addr, selectedChainKey);
          setPaidTxHash(null);
          setState('done');
          return;
        }
        if (res.status === 402 && attempt < 2) {
          await new Promise((r) => setTimeout(r, 3000));
          continue;
        }
        break;
      }
      throw new Error(RETRY_FAILED_MSG);
    } catch {
      setError(RETRY_FAILED_MSG);
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
          {isReplay && (
            <p className="text-[11px] text-[#a78bfa]/80 text-center bg-[#1a0d2e]/60 border border-[#a78bfa]/20 rounded-lg px-3 py-2">
              {t.common.todaysReadingNotice}
            </p>
          )}
          <ReadingCard title={t.astrology.resultTitle} subtitle={`${t.astrology.firstTx} ${new Date(result.firstTxDate).toLocaleDateString(BCP47_LOCALE[language], { year: 'numeric', month: 'long', day: 'numeric' })}`}>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#0e0620] border border-[#c4a25a]/50 flex items-center justify-center text-3xl shadow-lg shadow-[#c4a25a]/15">
                {result.symbol}
              </div>
              <div>
                <p className="text-xl font-bold text-[#c4a25a]">{t.astrology.zodiacSigns[result.zodiacSign] ?? result.zodiacSign}</p>
                <p className="text-xs text-[#a78bfa]/60">{t.astrology.birthSign}</p>
              </div>
            </div>
          </ReadingCard>

          <ReadingCard title={t.common.oracleReading}>
            <p className="text-sm lg:text-base text-[#e2d9f3]/85 leading-relaxed whitespace-pre-wrap">
              {result.interpretation}
            </p>
          </ReadingCard>
          {result.dateSource === 'derived' && (
            <p className="text-[11px] text-[#a78bfa]/70 text-center bg-[#1a0d2e]/60 border border-[#a78bfa]/15 rounded-lg px-3 py-2">
              {t.astrology.derivedDateNotice}
            </p>
          )}

          <ShareButton text={t.astrology.shareText(t.astrology.zodiacSigns[result.zodiacSign] ?? result.zodiacSign, selectedChainKey)} chainKey={selectedChainKey} />
        </div>
      )}
    </div>
  );
}
