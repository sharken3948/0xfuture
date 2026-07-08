'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useMiniKit } from '@/components/providers/MiniKitProvider';

export function WalletBar() {
  const { isMounted, isFarcasterContext } = useMiniKit();

  // Hydration guard: don't render wallet UI on the server.
  if (!isMounted) return null;
  // Inside Base App / Warpcast, the SDK owns the wallet — hide browser UI.
  if (isFarcasterContext) return null;

  return (
    <div className="flex justify-center">
      <ConnectButton
        chainStatus="icon"
        accountStatus={{ smallScreen: 'address', largeScreen: 'full' }}
        showBalance={false}
      />
    </div>
  );
}
