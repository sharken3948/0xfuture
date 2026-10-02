import { fallback, http, type Transport } from 'viem';
import { CHAIN_CONFIGS } from './constants';
import type { ChainKey } from '@/types';

export function chainTransport(chainKey: ChainKey): Transport {
  const urls = CHAIN_CONFIGS[chainKey].rpcUrls;
  if (urls.length <= 1) return http(urls[0]);
  return fallback(urls.map((u) => http(u)));
}
