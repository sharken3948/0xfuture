import { CHAIN_CONFIGS, CHAIN_KEYS } from './constants';

// Both USDC (Base) and USDC.e (Soneium) use 6 decimals; sticking with a constant
// here avoids an extra RPC roundtrip on the hot path.
const USDC_DECIMALS = 6;

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

async function queryChain(
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

export async function hasPaidToday(
  userAddress: string,
  usdCents: number,
): Promise<boolean> {
  const treasury = process.env.NEXT_PUBLIC_TREASURY_ADDRESS;
  if (!treasury || !/^0x[0-9a-fA-F]{40}$/.test(treasury)) return false;
  if (!/^0x[0-9a-fA-F]{40}$/.test(userAddress)) return false;

  const rawAmount = ((BigInt(usdCents) * 10n ** BigInt(USDC_DECIMALS)) / 100n).toString();

  const results = await Promise.allSettled(
    CHAIN_KEYS.map((k) => {
      const cfg = CHAIN_CONFIGS[k];
      return queryChain(cfg.explorerApi, userAddress, cfg.usdcAddress, treasury, rawAmount);
    }),
  );
  return results.some((r) => r.status === 'fulfilled' && r.value === true);
}
