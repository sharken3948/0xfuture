'use client';

import { useEffect, useRef, useState } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useSwitchChain } from 'wagmi';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { CHAIN_CONFIGS, CHAIN_KEYS } from '@/lib/constants';
import type { ChainKey } from '@/types';

export function WalletBar() {
  const { isMounted, isFarcasterContext } = useMiniKit();
  const { isConnected } = useAccount();
  const { switchChain } = useSwitchChain();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDoc = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [menuOpen]);

  if (!isMounted) return null;
  if (isFarcasterContext) return null;
  if (!isConnected) return null;

  return (
    <div className="flex justify-center">
      <ConnectButton.Custom>
        {({ account, chain, openAccountModal, mounted }) => {
          if (!mounted || !account || !chain) return null;
          const currentKey: ChainKey =
            chain.id === CHAIN_CONFIGS.soneium.chain.id ? 'soneium' : 'base';
          const currentCfg = CHAIN_CONFIGS[currentKey];

          return (
            <div className="flex items-center gap-1.5">
              <div ref={menuRef} className="relative">
                <button
                  type="button"
                  onClick={() => setMenuOpen((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-violet-900/50 bg-black/40 text-[11px] font-medium text-violet-200 hover:bg-violet-950/60 active:scale-[0.98] transition-all"
                >
                  <img
                    src={currentCfg.iconUrl}
                    alt=""
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: currentCfg.iconBackground }}
                  />
                  <span>{currentCfg.label}</span>
                  <span className="text-violet-500/70 text-[9px] leading-none">▾</span>
                </button>

                {menuOpen && (
                  <div className="absolute z-30 top-full right-0 mt-1.5 min-w-[176px] rounded-xl border border-violet-900/50 bg-[#0e0620]/95 backdrop-blur-sm shadow-xl shadow-black/60 p-1 space-y-0.5">
                    {CHAIN_KEYS.map((k) => {
                      const cfg = CHAIN_CONFIGS[k];
                      const isCurrent = k === currentKey;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            if (!isCurrent) switchChain({ chainId: cfg.chain.id });
                          }}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] transition-colors ${
                            isCurrent
                              ? 'bg-violet-900/40 text-violet-100'
                              : 'text-violet-200 hover:bg-violet-950/60'
                          }`}
                        >
                          <img
                            src={cfg.iconUrl}
                            alt=""
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: cfg.iconBackground }}
                          />
                          <span className="flex-1 text-left">{cfg.label}</span>
                          {isCurrent && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/80" />
                          )}
                        </button>
                      );
                    })}
                    <div
                      aria-disabled
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-[11px] text-violet-400/40 select-none cursor-not-allowed"
                    >
                      <img
                        src="/arc.png"
                        alt=""
                        className="w-4 h-4 rounded-full grayscale opacity-50"
                      />
                      <span className="flex-1 text-left">Arc Mainnet</span>
                      <span className="text-[9px] tracking-widest uppercase text-emerald-400/60">
                        soon
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={openAccountModal}
                className="px-2.5 py-1.5 rounded-lg border border-violet-900/50 bg-black/40 text-[11px] font-mono font-medium text-violet-200 hover:bg-violet-950/60 active:scale-[0.98] transition-all"
              >
                {account.displayName}
              </button>
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
}
