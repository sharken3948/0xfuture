import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import './globals.css';
import { MiniKitProvider } from '@/components/providers/MiniKitProvider';
import { LanguageProvider } from '@/lib/language-context';
import { StarField } from '@/components/ui/StarField';

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' });

export const metadata: Metadata = {
  title: '0xFUTURE — Onchain Oracle',
  description: 'Numerology, astrology & tarot readings powered by your wallet address',
  other: {
    'fc:frame': 'vNext',
    'fc:frame:image': `${process.env.NEXT_PUBLIC_APP_URL}/og.png`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full`}>
      <body className="min-h-full flex flex-col">
        <StarField />
        <LanguageProvider>
          <MiniKitProvider>{children}</MiniKitProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
