'use client';

import { concat, createPublicClient, encodeFunctionData, http, parseAbi, type WalletClient } from 'viem';
import { base } from 'wagmi/chains';
import { Attribution } from 'ox/erc8021';
import { CHAIN_CONFIGS } from './constants';
import type { ChainKey, PaymentResult } from '@/types';

const USDC_ABI = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
]);

const DATA_SUFFIX = Attribution.toDataSuffix({ codes: ['bc_tbuej0km'] });

// NODE_ENV is inlined at build time by Next.js, so the entire dev-mode
// branch is dead-code-eliminated in production bundles.
export const isDevMode =
  process.env.NODE_ENV !== 'production' &&
  (process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ?? false);

const WHITELIST = new Set(['0xf58dc3d979271325f52349142afec83b4b1c4e3a']);

export function isWhitelisted(address: string): boolean {
  return WHITELIST.has(address.toLowerCase());
}

export async function sendUSDC(
  toAddress: `0x${string}`,
  chainKey: ChainKey,
  walletClient: WalletClient,
  usdCents: number,
): Promise<PaymentResult> {
  const cfg = CHAIN_CONFIGS[chainKey];
  const publicClient = createPublicClient({ chain: cfg.chain, transport: http() });

  // Ensure wallet is on the selected chain
  const currentChainId = await walletClient.getChainId();
  if (currentChainId !== cfg.chain.id) {
    await walletClient.switchChain({ id: cfg.chain.id });
  }

  const decimals = await publicClient.readContract({
    address: cfg.usdcAddress,
    abi: USDC_ABI,
    functionName: 'decimals',
  });
  const amount = (BigInt(usdCents) * 10n ** BigInt(decimals)) / 100n;

  const [account] = await walletClient.getAddresses();
  if (!account) throw new Error('No account available');

  const balance = await publicClient.readContract({
    address: cfg.usdcAddress,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [account],
  });
  if (balance < amount) {
    throw new Error(
      `Insufficient ${cfg.usdcSymbol} on ${cfg.label}. Need $${(usdCents / 100).toFixed(2)}.`,
    );
  }

  let txHash: `0x${string}`;
  if (cfg.chain.id === base.id) {
    const data = encodeFunctionData({
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
    });
    const dataWithSuffix = concat([data, DATA_SUFFIX]);

    txHash = await walletClient.sendTransaction({
      account,
      chain: cfg.chain,
      to: cfg.usdcAddress,
      data: dataWithSuffix,
    });
  } else {
    txHash = await walletClient.writeContract({
      address: cfg.usdcAddress,
      abi: USDC_ABI,
      functionName: 'transfer',
      args: [toAddress, amount],
      account,
      chain: cfg.chain,
    });
  }

  await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });
  return { txHash, success: true };
}
