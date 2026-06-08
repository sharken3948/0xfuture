'use client';

import { createConfig, WagmiProvider as WagmiProviderBase, http } from 'wagmi';
import { base } from 'viem/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMemo, useState } from 'react';

export function WagmiProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  const config = useMemo(
    () =>
      createConfig({
        chains: [base],
        transports: { [base.id]: http() },
        ssr: true,
      }),
    []
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProviderBase config={config}>{children}</WagmiProviderBase>
    </QueryClientProvider>
  );
}
