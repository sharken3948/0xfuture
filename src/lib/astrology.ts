import {
  createPublicClient,
  getAddress,
  parseAbiItem,
  type Log,
} from 'viem';
import type { ChainKey, ZodiacSign } from '@/types';
import { CHAIN_CONFIGS, ZODIAC_SIGNS } from './constants';
import { chainTransport } from './rpc';

export function dateToZodiac(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const { sign, from, to } of ZODIAC_SIGNS) {
    const [fromMonth, fromDay] = from;
    const [toMonth, toDay] = to;

    if (fromMonth > toMonth) {
      // sign wraps year-end (Capricorn: Dec 22 – Jan 19)
      if ((month === fromMonth && day >= fromDay) || (month === toMonth && day <= toDay)) {
        return sign;
      }
    } else {
      if (
        (month === fromMonth && day >= fromDay) ||
        (month > fromMonth && month < toMonth) ||
        (month === toMonth && day <= toDay)
      ) {
        return sign;
      }
    }
  }

  return 'Capricorn';
}

export type DateSource = 'onchain' | 'derived';

export interface FirstTxDateResult {
  date: Date;
  source: DateSource;
}

export function pseudoDateFromAddress(address: string): Date {
  const hex = address.toLowerCase().replace(/^0x/, '');
  const month = (parseInt(hex.slice(0, 2), 16) % 12) + 1;
  const day = (parseInt(hex.slice(2, 4), 16) % 28) + 1;
  const year = 2020 + (parseInt(hex.slice(4, 6), 16) % 4);
  return new Date(year, month - 1, day);
}

const TRANSFER_EVENT = parseAbiItem(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
);

// Arc: 0.5s blocks; 30 days ≈ 5,184,000 blocks. 5k per getLogs call,
// scanned forward in parallel batches with a wall-clock budget so we fall
// back to the derived date rather than hang the request.
const ARC_FIRST_TX_LOOKBACK_BLOCKS = 5_184_000n;
const ARC_FIRST_TX_CHUNK_BLOCKS = 5_000n;
const ARC_FIRST_TX_CONCURRENCY = 10;
const ARC_FIRST_TX_BUDGET_MS = 8_000;

type TransferLog = Log<bigint, number, false, typeof TRANSFER_EVENT, true>;

async function firstTxBlockscout(
  address: string,
  chainKey: ChainKey,
): Promise<FirstTxDateResult> {
  const cfg = CHAIN_CONFIGS[chainKey];
  const url = new URL(cfg.explorerApi);
  url.searchParams.set('module', 'account');
  url.searchParams.set('action', 'txlist');
  url.searchParams.set('address', address);
  url.searchParams.set('startblock', '0');
  url.searchParams.set('endblock', '99999999');
  url.searchParams.set('page', '1');
  url.searchParams.set('offset', '1');
  url.searchParams.set('sort', 'asc');

  const res = await fetch(url.toString(), {
    signal: AbortSignal.timeout(5000),
    next: { revalidate: 3600 },
  });
  const data = await res.json();

  if (data.status === '1' && data.result?.length > 0) {
    return {
      date: new Date(parseInt(data.result[0].timeStamp) * 1000),
      source: 'onchain',
    };
  }

  return { date: pseudoDateFromAddress(address), source: 'derived' };
}

async function firstTxRpcLogs(
  address: string,
  chainKey: ChainKey,
): Promise<FirstTxDateResult> {
  const cfg = CHAIN_CONFIGS[chainKey];
  const client = createPublicClient({ chain: cfg.chain, transport: chainTransport(chainKey) });
  const user = getAddress(address);

  let latest: bigint;
  try {
    latest = await client.getBlockNumber();
  } catch {
    return { date: pseudoDateFromAddress(address), source: 'derived' };
  }
  const earliest =
    latest > ARC_FIRST_TX_LOOKBACK_BLOCKS ? latest - ARC_FIRST_TX_LOOKBACK_BLOCKS : 0n;

  // Build forward-ordered ranges [earliest, …, latest].
  const ranges: Array<[bigint, bigint]> = [];
  for (let from = earliest; from <= latest; ) {
    const to = from + ARC_FIRST_TX_CHUNK_BLOCKS - 1n < latest
      ? from + ARC_FIRST_TX_CHUNK_BLOCKS - 1n
      : latest;
    ranges.push([from, to]);
    if (to === latest) break;
    from = to + 1n;
  }

  const deadline = Date.now() + ARC_FIRST_TX_BUDGET_MS;

  for (let i = 0; i < ranges.length; i += ARC_FIRST_TX_CONCURRENCY) {
    if (Date.now() >= deadline) break;
    const batch = ranges.slice(i, i + ARC_FIRST_TX_CONCURRENCY);
    const results = await Promise.allSettled(
      batch.map(([from, to]) =>
        client.getLogs({
          address: cfg.usdcAddress,
          event: TRANSFER_EVENT,
          args: { to: user },
          fromBlock: from,
          toBlock: to,
        }),
      ),
    );
    // Walk forward through this batch to prefer the earliest hit.
    for (const r of results) {
      if (r.status !== 'fulfilled') continue;
      const logs = r.value as TransferLog[];
      if (logs.length === 0) continue;
      let earliestLog = logs[0];
      for (const l of logs) {
        if (l.blockNumber < earliestLog.blockNumber) earliestLog = l;
      }
      try {
        const block = await client.getBlock({ blockHash: earliestLog.blockHash });
        return { date: new Date(Number(block.timestamp) * 1000), source: 'onchain' };
      } catch {
        // give up on this hit; keep scanning
      }
    }
  }

  return { date: pseudoDateFromAddress(address), source: 'derived' };
}

export async function getFirstTransactionDate(
  address: string,
  chainKey: ChainKey,
): Promise<FirstTxDateResult> {
  const cfg = CHAIN_CONFIGS[chainKey];
  if (cfg.firstTxStrategy === 'rpc-logs') return firstTxRpcLogs(address, chainKey);
  return firstTxBlockscout(address, chainKey);
}
