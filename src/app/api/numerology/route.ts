import { NextRequest, NextResponse } from 'next/server';
import { calculateLifePath } from '@/lib/numerology';
import { generateReading } from '@/lib/groq';
import { LIFE_PATH_MEANINGS } from '@/lib/constants';
import { GROQ_LANG_NAMES, type LangCode } from '@/lib/translations';

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
    console.log('[numerology] request body:', body);

    const { address, language } = body as Record<string, unknown>;
    const langName = GROQ_LANG_NAMES[(language as LangCode) ?? 'EN'] ?? 'English';
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address as string)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    const { digits, lifePathNumber } = calculateLifePath(address as string);
    const meaning = LIFE_PATH_MEANINGS[lifePathNumber] ?? 'Unknown path';
    const shortAddr = `${(address as string).slice(0, 6)}...${(address as string).slice(-4)}`;

    const prompt = `Wallet ${shortAddr} resolves to Life Path Number ${lifePathNumber}, ${meaning}.
The hex digits of the address sum to this sacred number. Give a personalized numerology reading for this onchain entity. Reference the number ${lifePathNumber} and what it means for their journey in web3 and beyond.`;

    const raw = await generateReading(prompt, langName);
    const interpretation = raw.replace(new RegExp(address as string, 'gi'), shortAddr);

    return NextResponse.json({ digits, lifePathNumber, interpretation });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[numerology] error:', message, err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
