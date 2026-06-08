'use client';

import { sdk } from '@farcaster/miniapp-sdk';
import { useTranslations } from '@/lib/language-context';

interface ShareButtonProps {
  text: string;
}

export function ShareButton({ text }: ShareButtonProps) {
  const t = useTranslations();

  const handleShare = async () => {
    const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
    try {
      await sdk.actions.openUrl(url);
    } catch {
      window.open(url, '_blank');
    }
  };

  return (
    <button
      onClick={handleShare}
      className="w-full py-3 rounded-xl text-[#a78bfa] font-semibold text-sm border border-[#a78bfa]/60 bg-[#06040f]/80 hover:bg-[#0f0820] active:scale-95 transition-all duration-150"
    >
      {t.common.shareOnFarcaster}
    </button>
  );
}
