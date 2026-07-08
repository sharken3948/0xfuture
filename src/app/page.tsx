'use client';

import { useState } from 'react';
import { TabBar } from '@/components/ui/TabBar';
import { NumerologyModule } from '@/components/modules/NumerologyModule';
import { AstrologyModule } from '@/components/modules/AstrologyModule';
import { TarotModule } from '@/components/modules/TarotModule';
import { WalletInput } from '@/components/ui/WalletInput';
import { WalletBar } from '@/components/ui/WalletBar';
import { LanguageSelector } from '@/components/ui/LanguageSelector';
import { MidnightCountdown } from '@/components/ui/MidnightCountdown';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { useTranslations } from '@/lib/language-context';
import type { Module } from '@/types';

export default function Home() {
  const [activeModule, setActiveModule] = useState<Module>('numerology');
  const [showDevPanel, setShowDevPanel] = useState(false);
  const { isReady, isFarcasterContext, walletAddress, setManualAddress } = useMiniKit();
  const t = useTranslations();

  return (
    <main className="relative z-10 flex flex-col min-h-screen max-w-sm mx-auto px-4 py-5">
      {/* Header */}
      <div className="relative text-center mb-5">
        <div className="absolute left-0 top-0">
          <MidnightCountdown />
        </div>
        <div className="absolute right-0 top-0">
          <LanguageSelector />
        </div>
        <img
          src="/logo.png"
          alt="0xFUTURE"
          className="mx-auto object-contain"
          style={{ maxHeight: '180px' }}
        />
        {walletAddress && (
          <p className="text-[10px] text-violet-500/50 mt-1 font-mono">
            {walletAddress.slice(0, 6)}&hellip;{walletAddress.slice(-4)}
          </p>
        )}
      </div>

      {/* Tab navigation */}
      <TabBar active={activeModule} onChange={setActiveModule} />

      {/* Module content */}
      <div className="flex-1 mt-4">
        {!isReady ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 rounded-full border-2 border-violet-500/30 border-t-violet-400 animate-spin" />
          </div>
        ) : (
          <>
            {activeModule === 'numerology' && <NumerologyModule />}
            {activeModule === 'astrology' && <AstrologyModule />}
            {activeModule === 'tarot' && <TarotModule />}
          </>
        )}
      </div>

      {/* Footer */}
      <div className="mt-6 space-y-3">
        {/* Browser wallet + chain selector — only outside Farcaster */}
        {!isFarcasterContext && <WalletBar />}

        {/* Dev panel — only outside Farcaster */}
        {!isFarcasterContext && showDevPanel && (
          <div className="rounded-xl border border-violet-900/40 bg-black/30 p-3 space-y-2.5">
            {walletAddress ? (
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-violet-400/70">
                  {walletAddress.slice(0, 6)}&hellip;{walletAddress.slice(-4)}
                </span>
                <button
                  onClick={() => setManualAddress(null)}
                  className="text-[11px] text-violet-600/70 hover:text-violet-400 transition-colors"
                >
                  Clear
                </button>
              </div>
            ) : (
              <WalletInput />
            )}
          </div>
        )}

        <p className="text-[10px] text-violet-600/40 text-center">
          {t.common.entertainment}
        </p>
        {!isFarcasterContext && (
          <button
            onClick={() => setShowDevPanel((v) => !v)}
            className="block mx-auto text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            {showDevPanel ? 'Hide Dev Mode' : 'Dev Mode'}
          </button>
        )}
      </div>
    </main>
  );
}
