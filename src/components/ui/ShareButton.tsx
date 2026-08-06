'use client';

import { base } from 'wagmi/chains';
import { CHAIN_CONFIGS } from '@/lib/constants';
import { useTranslations } from '@/lib/language-context';
import type { ChainKey } from '@/types';

interface ShareButtonProps {
  text: string;
  chainKey: ChainKey;
}

export function ShareButton({ text, chainKey }: ShareButtonProps) {
  const t = useTranslations();

  const handleShare = () => {
    const mention = CHAIN_CONFIGS[chainKey].chain.id === base.id ? ' @base' : ' @soneium';
    const finalText = text + mention;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(finalText)}&url=${encodeURIComponent('https://0xfuture.xyz')}`;
    window.open(url, '_blank');
  };

  return (
    <button
      onClick={handleShare}
      className="w-full py-3 rounded-xl text-[#a78bfa] font-semibold text-sm border border-[#a78bfa]/60 bg-[#06040f]/80 hover:bg-[#0f0820] active:scale-95 transition-all duration-150"
    >
      {t.common.shareOnX}
    </button>
  );
}
