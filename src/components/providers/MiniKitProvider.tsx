'use client';

import { useEffect, useState, createContext, useContext, useCallback, useMemo } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount, useChainId, useConfig, useSwitchChain } from 'wagmi';
import { useConnectModal } from '@rainbow-me/rainbowkit';
import { getWalletClient as getWagmiWalletClient } from '@wagmi/core';
import { createWalletClient, custom, type WalletClient } from 'viem';
import { CHAIN_CONFIGS, DEFAULT_CHAIN_KEY } from '@/lib/constants';
import type { ChainKey } from '@/types';

interface MiniKitContextValue {
  isReady: boolean;
  isMounted: boolean;
  isFarcasterContext: boolean;
  walletAddress: string | null;
  connect: () => Promise<string | null>;
  setManualAddress: (addr: string | null) => void;
  selectedChainKey: ChainKey;
  setSelectedChainKey: (key: ChainKey) => void;
  getWalletClient: () => Promise<WalletClient>;
}

const MiniKitContext = createContext<MiniKitContextValue>({
  isReady: false,
  isMounted: false,
  isFarcasterContext: false,
  walletAddress: null,
  connect: async () => null,
  setManualAddress: () => {},
  selectedChainKey: DEFAULT_CHAIN_KEY,
  setSelectedChainKey: () => {},
  getWalletClient: async () => {
    throw new Error('Wallet not connected');
  },
});

export function useMiniKit() {
  return useContext(MiniKitContext);
}

function chainIdToKey(chainId: number | undefined): ChainKey {
  if (chainId === CHAIN_CONFIGS.soneium.chain.id) return 'soneium';
  return 'base';
}

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFarcasterContext, setIsFarcasterContext] = useState(false);
  const [fcAddress, setFcAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string | null>(null);

  const config = useConfig();
  const currentChainId = useChainId();
  const { address: wagmiAddress } = useAccount();
  const { switchChainAsync } = useSwitchChain();
  const { openConnectModal } = useConnectModal();

  const selectedChainKey: ChainKey = isFarcasterContext ? 'base' : chainIdToKey(currentChainId);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch {
        // not in a Farcaster frame — safe to ignore
      }

      // eth_requestAccounts auto-approves inside Farcaster; throws outside it.
      try {
        const accounts = (await sdk.wallet.ethProvider.request({
          method: 'eth_requestAccounts',
        })) as string[];
        setIsFarcasterContext(true);
        if (accounts[0]) setFcAddress(accounts[0]);
      } catch {
        setIsFarcasterContext(false);
      } finally {
        setIsReady(true);
      }
    };
    init();
  }, []);

  const walletAddress: string | null =
    fcAddress ?? (wagmiAddress as string | undefined) ?? manualAddress ?? null;

  const connect = useCallback(async (): Promise<string | null> => {
    if (isFarcasterContext) {
      try {
        const accounts = (await sdk.wallet.ethProvider.request({
          method: 'eth_requestAccounts',
        })) as string[];
        const addr = accounts[0] ?? null;
        setFcAddress(addr);
        return addr;
      } catch {
        return null;
      }
    }
    // Browser: pop the RainbowKit modal. The promise resolves right away;
    // wagmi's useAccount subscription will surface the address into
    // walletAddress once the user picks a wallet.
    if (!wagmiAddress) openConnectModal?.();
    return (wagmiAddress as string | undefined) ?? null;
  }, [isFarcasterContext, wagmiAddress, openConnectModal]);

  const setSelectedChainKey = useCallback(
    (key: ChainKey) => {
      // Inside Base App / Farcaster, chain is locked to Base.
      if (isFarcasterContext) return;
      const target = CHAIN_CONFIGS[key].chain.id;
      if (currentChainId !== target) {
        switchChainAsync({ chainId: target }).catch(() => {
          // user rejection or unsupported — leave chain as-is
        });
      }
    },
    [isFarcasterContext, currentChainId, switchChainAsync],
  );

  const getWalletClient = useCallback(async (): Promise<WalletClient> => {
    if (isFarcasterContext) {
      return createWalletClient({
        chain: CHAIN_CONFIGS.base.chain,
        transport: custom(sdk.wallet.ethProvider),
      });
    }
    const targetChainId = CHAIN_CONFIGS[selectedChainKey].chain.id;
    if (currentChainId !== targetChainId) {
      await switchChainAsync({ chainId: targetChainId });
    }
    const wc = await getWagmiWalletClient(config, { chainId: targetChainId });
    if (!wc) throw new Error('Wallet not connected');
    return wc;
  }, [isFarcasterContext, selectedChainKey, currentChainId, switchChainAsync, config]);

  const value = useMemo<MiniKitContextValue>(
    () => ({
      isReady,
      isMounted,
      isFarcasterContext,
      walletAddress,
      connect,
      setManualAddress,
      selectedChainKey,
      setSelectedChainKey,
      getWalletClient,
    }),
    [
      isReady,
      isMounted,
      isFarcasterContext,
      walletAddress,
      connect,
      setManualAddress,
      selectedChainKey,
      setSelectedChainKey,
      getWalletClient,
    ],
  );

  return <MiniKitContext.Provider value={value}>{children}</MiniKitContext.Provider>;
}
