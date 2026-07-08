import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { MiniKitProvider } from '@/components/providers/MiniKitProvider';
import { WagmiProvider } from '@/components/providers/WagmiProvider';
import { LanguageProvider } from '@/lib/language-context';
import { StarField } from '@/components/ui/StarField';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: '0xFUTURE — Onchain Oracle',
  description: 'Free crypto fortune telling powered by your wallet. Numerology, astrology & tarot readings on Base.',
  keywords: ['crypto', 'fortune telling', 'tarot', 'astrology', 'numerology', 'web3', 'base', 'farcaster', 'onchain', 'wallet'],
  metadataBase: new URL('https://www.0xfuture.xyz'),
  openGraph: {
    title: '0xFUTURE — Onchain Oracle',
    description: 'Free crypto fortune telling powered by your wallet. Numerology, astrology & tarot on Base.',
    url: 'https://www.0xfuture.xyz',
    siteName: '0xFUTURE',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: '0xFUTURE Onchain Oracle' }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: '0xFUTURE — Onchain Oracle',
    description: 'Free crypto fortune telling powered by your wallet. Numerology, astrology & tarot on Base.',
    images: ['/og.png'],
  },
  other: {
    'fc:frame': JSON.stringify({
      version: 'next',
      imageUrl: 'https://www.0xfuture.xyz/og.png',
      button: {
        title: 'Read My Future',
        action: {
          type: 'launch_frame',
          name: '0xFUTURE',
          url: 'https://www.0xfuture.xyz',
          splashImageUrl: 'https://www.0xfuture.xyz/splash.png',
          splashBackgroundColor: '#06040f',
        },
      },
    }),
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <StarField />
        <LanguageProvider>
          <WagmiProvider>
            <MiniKitProvider>{children}</MiniKitProvider>
          </WagmiProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
