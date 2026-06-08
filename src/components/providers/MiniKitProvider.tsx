'use client';

import { useEffect, useState, createContext, useContext } from 'react';
import { sdk } from '@farcaster/miniapp-sdk';

interface MiniKitContextValue {
  isReady: boolean;
  isFarcasterContext: boolean;
  walletAddress: string | null;
  connect: () => Promise<string | null>;
  setManualAddress: (addr: string | null) => void;
}

const MiniKitContext = createContext<MiniKitContextValue>({
  isReady: false,
  isFarcasterContext: false,
  walletAddress: null,
  connect: async () => null,
  setManualAddress: () => {},
});

export function useMiniKit() {
  return useContext(MiniKitContext);
}

export function MiniKitProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);
  const [isFarcasterContext, setIsFarcasterContext] = useState(false);
  const [fcAddress, setFcAddress] = useState<string | null>(null);
  const [manualAddress, setManualAddress] = useState<string | null>(null);

  // Effective address: Farcaster wallet takes priority over manual input
  const walletAddress = fcAddress ?? manualAddress;

  useEffect(() => {
    const init = async () => {
      try {
        await sdk.actions.ready();
      } catch {
        // not in a Farcaster frame — safe to ignore
      }

      // eth_requestAccounts auto-approves inside Farcaster; throws outside it.
      // This both detects context and auto-connects on app load.
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

  const connect = async (): Promise<string | null> => {
    try {
      if (!sdk.wallet) return null;
      const accounts = (await sdk.wallet.ethProvider.request({
        method: 'eth_requestAccounts',
      })) as string[];
      const addr = accounts[0] ?? null;
      setFcAddress(addr);
      return addr;
    } catch {
      return null;
    }
  };

  return (
    <MiniKitContext.Provider
      value={{ isReady, isFarcasterContext, walletAddress, connect, setManualAddress }}
    >
      {children}
    </MiniKitContext.Provider>
  );
}
