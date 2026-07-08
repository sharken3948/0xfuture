'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { WagmiProvider as WagmiProviderBase } from 'wagmi';
import { base, soneium } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? '';

const soneiumWithIcon = {
  ...soneium,
  name: 'Soneium',
  iconUrl: '/soneium.png',
  iconBackground: '#000',
};

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const config = useMemo(
    () =>
      getDefaultConfig({
        appName: '0xFUTURE',
        projectId: WC_PROJECT_ID,
        chains: [base, soneiumWithIcon],
        ssr: true,
      }),
    [],
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>
        <RainbowKitProvider
          initialChain={base}
          theme={darkTheme({
            accentColor: '#a78bfa',
            accentColorForeground: '#0e0620',
            borderRadius: 'medium',
            fontStack: 'system',
            overlayBlur: 'small',
          })}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </WagmiProviderBase>
    </QueryClientProvider>
  );
}
