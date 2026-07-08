'use client';

import { createConfig, WagmiProvider as WagmiProviderBase, http } from 'wagmi';
import { base, soneium } from 'wagmi/chains';
import { injected } from '@wagmi/connectors/injected';
import { walletConnect } from '@wagmi/connectors/walletConnect';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

const WC_PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const config = useMemo(() => {
    const connectors = [
      injected({ shimDisconnect: true }),
      ...(WC_PROJECT_ID
        ? [walletConnect({ projectId: WC_PROJECT_ID, showQrModal: true })]
        : []),
    ];

    return createConfig({
      chains: [base, soneium],
      connectors,
      transports: {
        [base.id]: http(),
        [soneium.id]: http(),
      },
      ssr: true,
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>{children}</WagmiProviderBase>
    </QueryClientProvider>
  );
}
