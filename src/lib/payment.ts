'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { createWalletClient, createPublicClient, custom, http, parseAbi } from 'viem';
import { base } from 'viem/chains';
import { USDC_ADDRESS_BASE, BASE_CHAIN_ID } from './constants';
import type { PaymentResult } from '@/types';

const USDC_ABI = parseAbi([
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
]);

export const isDevMode = process.env.NEXT_PUBLIC_APP_URL?.includes('localhost') ?? false;

const WHITELIST = new Set(['0xf58dc3d979271325f52349142afec83b4b1c4e3a']);

export function isWhitelisted(address: string): boolean {
  return WHITELIST.has(address.toLowerCase());
}

export async function sendUSDC(
  toAddress: string,
  amountMicro: bigint
): Promise<PaymentResult> {
  if (isDevMode) {
    await new Promise((r) => setTimeout(r, 800)); // simulate network delay
    return { txHash: '0xDEV_SIMULATED', success: true };
  }

  const provider = sdk.wallet.ethProvider;

  const walletClient = createWalletClient({
    chain: base,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain: base,
    transport: http(),
  });

  const [account] = await walletClient.requestAddresses();

  // Check balance first
  const balance = await publicClient.readContract({
    address: USDC_ADDRESS_BASE,
    abi: USDC_ABI,
    functionName: 'balanceOf',
    args: [account],
  });

  if (balance < amountMicro) {
    throw new Error(`Insufficient USDC balance. Need ${Number(amountMicro) / 1e6} USDC.`);
  }

  // Switch chain to Base if needed
  try {
    await provider.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: `0x${BASE_CHAIN_ID.toString(16)}` }],
    });
  } catch {
    // ignore if already on Base or chain switching not supported
  }

  const txHash = await walletClient.writeContract({
    address: USDC_ADDRESS_BASE,
    abi: USDC_ABI,
    functionName: 'transfer',
    args: [toAddress as `0x${string}`, amountMicro],
    account,
  });

  // Wait for 1 confirmation
  await publicClient.waitForTransactionReceipt({ hash: txHash, confirmations: 1 });

  return { txHash, success: true };
}
