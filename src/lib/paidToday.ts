import {
  createPublicClient,
  getAddress,
  parseAbiItem,
  type Log,
} from 'viem';
import { CHAIN_CONFIGS, CHAIN_KEYS } from './constants';
import { chainTransport } from './rpc';
import type { ChainKey } from '@/types';

// Both USDC (Base) and USDC.e (Soneium) use 6 decimals; sticking with a constant
// here avoids an extra RPC roundtrip on the hot path. Arc's USDC ERC-20
// interface at 0x3600…0000 is also 6 decimals.
const USDC_DECIMALS = 6;

// Arc produces ~0.5s blocks and caps eth_getLogs at 5000 blocks per request.
const ARC_LOOKBACK_BLOCKS = 172_800n; // ~24h at 0.5s/block
const ARC_CHUNK_BLOCKS = 5_000n;
const ARC_RPC_CONCURRENCY = 6;

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
);

interface TokenTx {
  from?: string;
  to?: string;
  value?: string;
  timeStamp?: string;
}

function utcDayBounds(now: Date = new Date()): { startMs: number; endMs: number } {
  const startMs = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return { startMs, endMs: startMs + 86_400_000 };
}

async function queryBlockscout(
  explorerApi: string,
  userAddress: string,
  usdcAddress: string,
  treasury: string,
  rawAmount: string,
): Promise<boolean> {
  const url = new URL(explorerApi);
  url.searchParams.set('module', 'account');
  url.searchParams.set('action', 'tokentx');
  url.searchParams.set('address', userAddress);
  url.searchParams.set('contractaddress', usdcAddress);
  url.searchParams.set('sort', 'desc');
  url.searchParams.set('page', '1');
  url.searchParams.set('offset', '50');

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(5000),
    cache: 'no-store',
  });
  const data = (await res.json()) as { status?: string; result?: unknown };
  if (data.status !== '1' || !Array.isArray(data.result)) return false;

  const { startMs, endMs } = utcDayBounds();
  const treas = treasury.toLowerCase();
  const user = userAddress.toLowerCase();
  return (data.result as TokenTx[]).some((r) => {
    const tsMs = parseInt(r.timeStamp ?? '0', 10) * 1000;
    return (
      typeof r.from === 'string' &&
      r.from.toLowerCase() === user &&
      typeof r.to === 'string' &&
      r.to.toLowerCase() === treas &&
      r.value === rawAmount &&
      tsMs >= startMs &&
      tsMs < endMs
    );
  });
}

type TransferLog = Log<bigint, number, false, typeof TRANSFER_EVENT, true>;

async function queryRpcLogs(
  chainKey: ChainKey,
  userAddress: string,
  treasury: string,
  rawAmountBig: bigint,
): Promise<boolean> {
  const cfg = CHAIN_CONFIGS[chainKey];
  const client = createPublicClient({ chain: cfg.chain, transport: chainTransport(chainKey) });
  const latest = await client.getBlockNumber();
  const earliest = latest > ARC_LOOKBACK_BLOCKS ? latest - ARC_LOOKBACK_BLOCKS : 0n;

  const user = getAddress(userAddress);
  const treas = getAddress(treasury);

  // Backward-scan in 5k-block chunks, N in parallel, early-exit on match.
  const ranges: Array<[bigint, bigint]> = [];
  for (let to = latest; to >= earliest; ) {
    const from = to - ARC_CHUNK_BLOCKS + 1n > earliest ? to - ARC_CHUNK_BLOCKS + 1n : earliest;
    ranges.push([from, to]);
    if (from === earliest) break;
    to = from - 1n;
  }

  const { startMs, endMs } = utcDayBounds();

  for (let i = 0; i < ranges.length; i += ARC_RPC_CONCURRENCY) {
    const batch = ranges.slice(i, i + ARC_RPC_CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(([from, to]) =>
        client.getLogs({
          address: cfg.usdcAddress,
          event: TRANSFER_EVENT,
          args: { from: user, to: treas },
          fromBlock: from,
          toBlock: to,
        }),
      ),
    );
    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      for (const log of r.value as TransferLog[]) {
        if (log.args.value !== rawAmountBig) continue;
        try {
          const block = await client.getBlock({ blockHash: log.blockHash });
          const tsMs = Number(block.timestamp) * 1000;
          if (tsMs >= startMs && tsMs < endMs) return true;
        } catch {
          // ignore and keep scanning
        }
      }
    }
  }
  return false;
}

export async function hasPaidToday(
  userAddress: string,
  usdCents: number,
): Promise<boolean> {
  const treasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
  if (!treasury || !/^0x[0-9a-fA-F]{40}$/.test(treasury)) return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(userAddress)) return false;

  const rawAmountBig = (BigInt(usdCents) * 10n ** BigInt(USDC_DECIMALS)) / 100n;
  const rawAmount = rawAmountBig.toString();

  const results = await Promise.allSettled(
    CHAIN_KEYS.map((k) => {
      const cfg = CHAIN_CONFIGS[k];
      if (cfg.paidTodayStrategy === 'rpc-logs') {
        return queryRpcLogs(k, userAddress, treasury, rawAmountBig);
      }
      return queryBlockscout(cfg.explorerApi, userAddress, cfg.usdcAddress, treasury, rawAmount);
    }),
  );
  return results.some((r) => r.status === 'fulfilled' && r.value === true);
}
