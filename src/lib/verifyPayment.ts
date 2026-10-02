import { createPublicClient, http, parseAbi, parseEventLogs } from 'viem';
import { CHAIN_CONFIGS } from './constants';
import type { ChainKey } from '@/types';

const USDC_EVENT_ABI = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
]);

const USDC_DECIMALS_ABI = parseAbi(['function decimals() view returns (uint8)']);

const OWNERS: ReadonlySet<string> = (() => {
  try {
    return new Set(
      (process.env.NEXT_PUBLIC_OWNER_ADDRESSES ?? '')
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter((s) => /^0x[0-9a-f]{40}$/.test(s)),
    );
  } catch {
    return new Set<string>();
  }
})();

export function isOwnerServer(address: string): boolean {
  return OWNERS.has(address.toLowerCase());
}

const RECEIPT_RETRIES = 3;
const RECEIPT_RETRY_DELAY_MS = 1500;
const RECENT_WINDOW_MS = 60 * 60 * 1000;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function reject(reason: string): false {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`[verifyPayment] reject: ${reason}`);
  }
  return false;
}

export async function verifyPayment(params: {
  txHash: string;
  address: string;
  chainKey: ChainKey;
  usdCents: number;
}): Promise<boolean> {
  const { txHash, address, chainKey, usdCents } = params;

  if (!/^0x[0-9a-fA-F]{64}$/.test(txHash)) return reject('txhash_shape');
  if (!/^0x[0-9a-fA-F]{40}$/.test(address)) return reject('address_shape');

  const treasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS?.toLowerCase();
  if (!treasury || !/^0x[0-9a-f]{40}$/.test(treasury)) return reject('treasury_missing');

  const cfg = CHAIN_CONFIGS[chainKey];
  const publicClient = createPublicClient({ chain: cfg.chain, transport: http() });

  const hash = txHash as `0x${string}`;
  let receipt: Awaited<ReturnType<typeof publicClient.getTransactionReceipt>> | null = null;
  for (let i = 0; i < RECEIPT_RETRIES; i++) {
    try {
      receipt = await publicClient.getTransactionReceipt({ hash });
      break;
    } catch {
      if (i === RECEIPT_RETRIES - 1) return reject('receipt_not_found');
      await sleep(RECEIPT_RETRY_DELAY_MS);
    }
  }
  if (!receipt) return reject('receipt_not_found');
  if (receipt.status !== 'success') return reject('receipt_reverted');

  const usdcAddr = cfg.usdcAddress.toLowerCase();
  const buyer = address.toLowerCase();

  const decimals = await publicClient.readContract({
    address: cfg.usdcAddress,
    abi: USDC_DECIMALS_ABI,
    functionName: 'decimals',
  });
  const required = (BigInt(usdCents) * 10n ** BigInt(decimals)) / 100n;

  const logs = parseEventLogs({
    abi: USDC_EVENT_ABI,
    eventName: 'Transfer',
    logs: receipt.logs,
  });

  const matched = logs.some((log) => {
    if (log.address.toLowerCase() !== usdcAddr) return false;
    const { from, to, value } = log.args;
    return (
      from.toLowerCase() === buyer &&
      to.toLowerCase() === treasury &&
      value >= required
    );
  });
  if (!matched) return reject('no_matching_transfer');

  const block = await publicClient.getBlock({ blockNumber: receipt.blockNumber });
  const tsMs = Number(block.timestamp) * 1000;
  const now = Date.now();
  if (tsMs > now) return reject('block_in_future');
  if (now - tsMs > RECENT_WINDOW_MS) return reject('block_too_old');

  return true;
}
