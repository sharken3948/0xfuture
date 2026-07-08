'use client';

import { useEffect, useState, createContext, useContext, useCallback, useMemo } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';
import { useAccount, useWalletClient, useSwitchChain } from 'wagmi';
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

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isFarcasterContext, setIsFarcasterContext] = useState(false);
  const [fcAddress, setFcAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string | null>(null);
  const [chainKeyState, setChainKeyState] = useState<ChainKey>(DEFAULT_CHAIN_KEY);

  const { address: wagmiAddress } = useAccount();
  const selectedChainKey: ChainKey = isFarcasterContext ? 'base' : chainKeyState;
  const chainCfg = CHAIN_CONFIGS[selectedChainKey];
  const { data: wagmiWalletClient } = useWalletClient({ chainId: chainCfg.chain.id });
  const { switchChainAsync } = useSwitchChain();

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
    // Browser: connection is initiated by the ConnectButton UI (wagmi).
    return (wagmiAddress as string | undefined) ?? null;
  }, [isFarcasterContext, wagmiAddress]);

  const setSelectedChainKey = useCallback(
    (key: ChainKey) => {
      // Inside Base App / Farcaster, chain is locked to Base.
      if (isFarcasterContext) return;
      setChainKeyState(key);
    },
    [isFarcasterContext],
  );

  const getWalletClient = useCallback(async (): Promise<WalletClient> => {
    if (isFarcasterContext) {
      return createWalletClient({
        chain: CHAIN_CONFIGS.base.chain,
        transport: custom(sdk.wallet.ethProvider),
      });
    }
    if (!wagmiWalletClient) {
      throw new Error('Wallet not connected');
    }
    if (wagmiWalletClient.chain?.id !== chainCfg.chain.id) {
      await switchChainAsync({ chainId: chainCfg.chain.id });
    }
    return wagmiWalletClient;
  }, [isFarcasterContext, wagmiWalletClient, chainCfg.chain.id, switchChainAsync]);

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
      selectedChainKey,
      setSelectedChainKey,
      getWalletClient,
    ],
  );

  return <MiniKitContext.Provider value={value}>{children}</MiniKitContext.Provider>;
}
