'use client';

import { useState } from 'react';
import { useMiniKit } from '@/components/providers/MiniKitProvider';
import { isWhitelisted } from '@/lib/payment';

const ADDRESS_RE = /^0x[0-9a-fA-F]{40}$/;

export function WalletInput() {
  const { setManualAddress } = useMiniKit();
  const [value, setValue] = useState('');

  const trimmed = value.trim();
  const looksLikeAddress = ADDRESS_RE.test(trimmed);
  const isOwner = looksLikeAddress && isWhitelisted(trimmed);
  const showRedirect = looksLikeAddress && !isOwner;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isOwner) return;
    setManualAddress(trimmed);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2.5">
      <p className="text-xs text-violet-400/70 text-center">
        Dev access — enter owner address
      </p>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="0x..."
          spellCheck={false}
          autoComplete="off"
          className={`w-full bg-black/50 border rounded-xl px-3 py-2.5 pr-8 text-sm font-mono text-violet-100 placeholder-violet-700/50 outline-none focus:ring-1 transition-colors ${
            showRedirect
              ? 'border-amber-700/50 focus:ring-amber-700/30'
              : isOwner
              ? 'border-emerald-700/50 focus:ring-emerald-700/30'
              : 'border-violet-800/50 focus:ring-violet-600/30'
          }`}
        />
        {isOwner && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400 text-sm select-none">
            ✓
          </span>
        )}
      </div>
      {showRedirect && (
        <p className="text-center text-xs text-amber-400/80 bg-amber-950/30 border border-amber-800/40 rounded-lg px-3 py-2">
          This app runs inside Base App
        </p>
      )}
      <button
        type="submit"
        disabled={!isOwner}
        className="w-full py-2.5 rounded-xl bg-violet-900/60 border border-violet-700/50 text-violet-200 text-sm font-medium
          disabled:opacity-35 disabled:cursor-not-allowed
          enabled:hover:bg-violet-800/60 enabled:active:scale-95 transition-all duration-150"
      >
        Continue as Owner
      </button>
    </form>
  );
}
