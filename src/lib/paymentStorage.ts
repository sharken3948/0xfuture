'use client';

import type { ChainKey } from '@/types';

type ModuleKey = 'astrology' | 'tarot';

const MAX_AGE_MS = 55 * 60_000;
const HASH_RE = /^0x[0-9a-fA-F]{64}$/;

function storageKey(module: ModuleKey, address: string, chainKey: ChainKey): string {
  return `0xfuture:paid:${module}:${address.toLowerCase()}:${chainKey}`;
}

export function readPaidTxHash(
  module: ModuleKey,
  address: string | null,
  chainKey: ChainKey,
): string | null {
  if (!address) return null;
  try {
    const key = storageKey(module, address, chainKey);
    const raw = sessionStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { txHash?: unknown; ts?: unknown };
    const ts = typeof parsed.ts === 'number' ? parsed.ts : 0;
    const txHash = typeof parsed.txHash === 'string' ? parsed.txHash : '';
    if (!HASH_RE.test(txHash) || Date.now() - ts > MAX_AGE_MS) {
      sessionStorage.removeItem(key);
      return null;
    }
    return txHash;
  } catch {
    return null;
  }
}

export function writePaidTxHash(
  module: ModuleKey,
  address: string,
  chainKey: ChainKey,
  txHash: string,
): void {
  if (!HASH_RE.test(txHash)) return;
  try {
    sessionStorage.setItem(
      storageKey(module, address, chainKey),
      JSON.stringify({ txHash, ts: Date.now() }),
    );
  } catch {
    // storage disabled or quota exceeded — module still works from state alone
  }
}

export function clearPaidTxHash(
  module: ModuleKey,
  address: string | null,
  chainKey: ChainKey,
): void {
  if (!address) return;
  try {
    sessionStorage.removeItem(storageKey(module, address, chainKey));
  } catch {
    // ignore
  }
}
