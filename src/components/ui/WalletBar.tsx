'use client';

import { useConnect, useDisconnect, useConnectors } from 'wagmi';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { CHAIN_CONFIGS, CHAIN_KEYS } from '@/lib/constants';
import type { ChainKey } from '@/types';

export function WalletBar() {
  const { isMounted, isFarcasterContext, walletAddress, selectedChainKey, setSelectedChainKey } =
    useMiniKit();
  const connectors = useConnectors();
  const { connect, isPending, error } = useConnect();
  const { disconnect } = useDisconnect();

  // Hydration guard: don't render wallet UI on the server.
  if (!isMounted) return null;
  // Inside Base App / Warpcast, the SDK handles the wallet — don't show browser UI.
  if (isFarcasterContext) return null;

  const injectedConnector = connectors.find((c) => c.type === 'injected');
  const wcConnector = connectors.find((c) => c.type === 'walletConnect');

  return (
    <div className="rounded-xl border border-violet-900/40 bg-black/30 p-3 space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-[10px] uppercase tracking-widest text-violet-400/60">
          Chain
        </label>
        <select
          value={selectedChainKey}
          onChange={(e) => setSelectedChainKey(e.target.value as ChainKey)}
          className="flex-1 bg-black/50 border border-violet-800/50 rounded-lg px-2 py-1.5 text-xs text-violet-100 outline-none focus:ring-1 focus:ring-violet-600/40"
        >
          {CHAIN_KEYS.map((k) => (
            <option key={k} value={k}>
              {CHAIN_CONFIGS[k].label}
            </option>
          ))}
        </select>
      </div>

      {walletAddress ? (
        <div className="flex items-center justify-between gap-2">
          <span className="text-[11px] font-mono text-violet-300/80 truncate">
            {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          </span>
          <button
            onClick={() => disconnect()}
            className="text-[11px] text-violet-500/80 hover:text-violet-300 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-1.5">
          {injectedConnector && (
            <button
              onClick={() => connect({ connector: injectedConnector })}
              disabled={isPending}
              className="w-full py-2 rounded-lg bg-violet-900/60 border border-violet-700/50 text-violet-100 text-xs font-medium enabled:hover:bg-violet-800/60 enabled:active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              {isPending ? 'Connecting…' : 'Connect Browser Wallet'}
            </button>
          )}
          {wcConnector && (
            <button
              onClick={() => connect({ connector: wcConnector })}
              disabled={isPending}
              className="w-full py-2 rounded-lg bg-black/40 border border-violet-800/50 text-violet-200 text-xs font-medium enabled:hover:bg-violet-950/60 enabled:active:scale-[0.98] disabled:opacity-40 transition-all"
            >
              WalletConnect
            </button>
          )}
          {error && (
            <p className="text-[10px] text-red-400/80 text-center">{error.message}</p>
          )}
        </div>
      )}
    </div>
  );
}
