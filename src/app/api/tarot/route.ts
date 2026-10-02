import { NextRequest, NextResponse } from 'next/server';
import { drawThreeCards } from '@/lib/tarot';
import { generateReading } from '@/lib/groq';
import {
  DEFAULT_CHAIN_KEY,
  READING_PRICES_CENTS,
  isChainKey,
} from '@/lib/constants';
import { GROQ_LANG_NAMES, type LangCode } from '@/lib/translations';
import { isOwnerServer, verifyPayment } from '@/lib/verifyPayment';

export async function POST(req: NextRequest) {
  try {
    const { address, txHash, language, chainKey } = await req.json();
    const langName = GROQ_LANG_NAMES[(language as LangCode) ?? 'EN'] ?? 'English';
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    const chain = isChainKey(chainKey) ? chainKey : DEFAULT_CHAIN_KEY;

    if (!isOwnerServer(address)) {
      const ok = await verifyPayment({
        txHash: typeof txHash === 'string' ? txHash : '',
        address,
        chainKey: chain,
        usdCents: READING_PRICES_CENTS.tarot,
      }).catch(() => false);
      if (!ok) {
        return NextResponse.json({ error: 'Payment required' }, { status: 402 });
      }
    }

    const cards = drawThreeCards(address);
    const [past, present, future] = cards;
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

    const prompt = `Tarot spread for wallet ${shortAddr}:
- PAST: ${past.name}${past.reversed ? ' (Reversed)' : ''} ${past.imageSymbol}
- PRESENT: ${present.name}${present.reversed ? ' (Reversed)' : ''} ${present.imageSymbol}
- FUTURE: ${future.name}${future.reversed ? ' (Reversed)' : ''} ${future.imageSymbol}

Give a cohesive three-card tarot reading in past/present/future format. Each card's energy as ${past.reversed || present.reversed || future.reversed ? 'some are reversed' : 'all upright'} shapes the narrative. Connect the cards to the person's onchain journey and crypto life.`;

    const raw = await generateReading(prompt, langName);
    const interpretation = raw.replace(new RegExp(address, 'gi'), shortAddr);

    return NextResponse.json({ cards, interpretation });
  } catch {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[tarot] handler error');
    }
    return NextResponse.json({ error: 'Reading failed' }, { status: 500 });
  }
}
