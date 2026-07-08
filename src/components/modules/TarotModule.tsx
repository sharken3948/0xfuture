'use client';

import { useState, useEffect } from 'react';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { sendUSDC, isDevMode, isWhitelisted } from '@/lib/payment';
import { READING_PRICES_CENTS, TAROT_IMAGES } from '@/lib/constants';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ReadingCard } from '@/components/ui/ReadingCard';
import { ExpandableInfo } from '@/components/ui/ExpandableInfo';
import { ShareButton } from '@/components/ui/ShareButton';
import { useTranslations, useLanguage } from '@/lib/language-context';
import type { ReadingState, TarotCard } from '@/types';

interface TarotResult {
  cards: TarotCard[];
  interpretation: string;
}

export function TarotModule() {
  const { walletAddress, connect, selectedChainKey, getWalletClient } = useMiniKit();
  const { language } = useLanguage();
  const t = useTranslations();
  const [state, setState] = useState<ReadingState>('idle');
  const [result, setResult] = useState<TarotResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [flippedCount, setFlippedCount] = useState(0);

  useEffect(() => {
    if (!result) {
      setFlippedCount(0);
      return;
    }
    const timers = [
      setTimeout(() => setFlippedCount(1), 500),
      setTimeout(() => setFlippedCount(2), 800),
      setTimeout(() => setFlippedCount(3), 1100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [result]);

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
        const walletClient = await getWalletClient();
        const payment = await sendUSDC(
          treasury as `0x${string}`,
          selectedChainKey,
          walletClient,
          READING_PRICES_CENTS.tarot,
        );
        txHash = payment.txHash;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Payment failed');
        setState('error');
        return;
      }
    }

    setState('loading');

    try {
      const res = await fetch('/api/tarot', {
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
          {t.tarot.description}
        </p>
      </div>

      {!result && state === 'idle' && (
        <ExpandableInfo howItWorks={t.tarot.howItWorks} history={t.tarot.history} />
      )}

      {!result && state === 'idle' && (
        <button
          onClick={handleRead}
          className="w-full py-3 rounded-xl mystic-btn text-[#c4a25a] font-semibold text-sm active:scale-95 transition-transform duration-150"
        >
          {walletAddress ? t.tarot.buttonConnected : t.common.connectWallet}
        </button>
      )}

      {state === 'paying' && <LoadingSpinner label={t.common.payingLabel} />}
      {state === 'loading' && <LoadingSpinner label={t.tarot.loadingLabel} />}

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
          <div className="grid grid-cols-3 gap-2">
            {result.cards.map((card, i) => (
              <div key={i} className="tarot-card h-48">
                <div className={`tarot-card-inner${flippedCount > i ? ' flipped' : ''}`}>

                  {/* Back face — shown first */}
                  <div className="tarot-card-face flex items-center justify-center relative bg-gradient-to-br from-[#1a0d2e] to-[#06040f] border border-[#c4a25a]/50">
                    <div className="absolute inset-[5px] rounded-[8px] border border-[#c4a25a]/25" />
                    <div className="relative flex items-center justify-center">
                      <div className="absolute w-16 h-16 rounded-full border border-[#c4a25a]/18" />
                      <div className="absolute w-10 h-10 rounded-full border border-[#c4a25a]/28" />
                      <span
                        className="text-[20px] text-[#c4a25a]/80 select-none"
                        style={{ textShadow: '0 0 10px rgba(196,162,90,0.65)' }}
                      >
                        ✦
                      </span>
                    </div>
                    <span className="absolute top-2 left-2.5 text-[9px] text-[#c4a25a]/45 select-none leading-none">·</span>
                    <span className="absolute top-2 right-2.5 text-[9px] text-[#c4a25a]/45 select-none leading-none">·</span>
                    <span className="absolute bottom-2 left-2.5 text-[9px] text-[#c4a25a]/45 select-none leading-none">·</span>
                    <span className="absolute bottom-2 right-2.5 text-[9px] text-[#c4a25a]/45 select-none leading-none">·</span>
                  </div>

                  {/* Front face — revealed on flip */}
                  <div className="tarot-card-face tarot-card-front border border-white/10">
                    <img
                      src={TAROT_IMAGES[card.name]}
                      alt={card.name}
                      className={`w-full h-full object-cover object-top${card.reversed ? ' rotate-180' : ''}`}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/70 to-transparent px-1.5 pt-5 pb-1.5">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-white/50 leading-none">
                        {t.tarot.positions[i]}
                      </p>
                      <p className="text-[10px] font-medium text-white/90 leading-tight mt-0.5">
                        {card.name}
                      </p>
                      {card.reversed && (
                        <p className="text-[8px] text-red-400/80 leading-none mt-0.5">{t.common.reversed}</p>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            ))}
          </div>

          <ReadingCard title={t.common.oracleReading}>
            <p className="text-sm text-[#e2d9f3]/85 leading-relaxed whitespace-pre-wrap">
              {result.interpretation}
            </p>
          </ReadingCard>

          <ShareButton text={t.tarot.shareText(result.cards.map(c => c.name).join(' · '))} />
        </div>
      )}
    </div>
  );
}
