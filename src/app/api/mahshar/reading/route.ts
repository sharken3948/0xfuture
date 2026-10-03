import { NextRequest, NextResponse } from 'next/server';
import { timingSafeEqual } from 'node:crypto';
import { drawThreeCards } from '@/lib/tarot';
import { calculateLifePath } from '@/lib/numerology';
import {
  dateToZodiac,
  pseudoDateFromAddress,
} from '@/lib/astrology';
import { generateReading } from '@/lib/groq';
import { LIFE_PATH_MEANINGS, ZODIAC_SYMBOLS } from '@/lib/constants';
import { GROQ_LANG_NAMES, type LangCode } from '@/lib/translations';
import { slidingWindow } from '@/lib/rateLimit';

export const maxDuration = 30;

const RATE_LIMIT_KEY = 'mahshar:global';
const RATE_LIMIT_MAX = 60;
const RATE_LIMIT_WINDOW_MS = 60_000;

function bearerOk(header: string | null, secret: string): boolean {
  if (!header) return false;
  const prefix = 'Bearer ';
  if (!header.startsWith(prefix)) return false;
  const provided = Buffer.from(header.slice(prefix.length));
  const expected = Buffer.from(secret);
  if (provided.length !== expected.length) return false;
  return timingSafeEqual(provided, expected);
}

async function tarotReading(address: string, langName: string) {
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
  return { cards, interpretation };
}

async function astrologyReading(address: string, langName: string) {
  const firstTxDate = pseudoDateFromAddress(address);
  const zodiacSign = dateToZodiac(firstTxDate);
  const symbol = ZODIAC_SYMBOLS[zodiacSign];
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const prompt = `Wallet ${shortAddr} made its first onchain transaction on ${firstTxDate.toDateString()}.
This birth date on the blockchain makes them a ${zodiacSign} ${symbol}.
Give a personalized astrology reading for this onchain soul. Reference their ${zodiacSign} nature, how the stars have shaped their web3 journey, and what cosmic forces guide their transactions.`;
  const raw = await generateReading(prompt, langName);
  const interpretation = raw.replace(new RegExp(address, 'gi'), shortAddr);
  return {
    firstTxDate: firstTxDate.toISOString(),
    zodiacSign,
    symbol,
    interpretation,
    dateSource: 'derived' as const,
  };
}

async function numerologyReading(address: string, langName: string) {
  const { digits, lifePathNumber } = calculateLifePath(address);
  const meaning = LIFE_PATH_MEANINGS[lifePathNumber] ?? 'Unknown path';
  const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;
  const prompt = `Wallet ${shortAddr} resolves to Life Path Number ${lifePathNumber}, ${meaning}.
The hex digits of the address sum to this sacred number. Give a personalized numerology reading for this onchain entity. Reference the number ${lifePathNumber} and what it means for their journey in web3 and beyond.`;
  const raw = await generateReading(prompt, langName);
  const interpretation = raw.replace(new RegExp(address, 'gi'), shortAddr);
  return { digits, lifePathNumber, interpretation };
}

export async function POST(req: NextRequest) {
  const secret = process.env.MAHSHAR_API_KEY;
  if (!secret) {
    return NextResponse.json(
      { error: 'MAHSHAR_API_KEY not configured' },
      { status: 503 },
    );
  }

  if (!bearerOk(req.headers.get('authorization'), secret)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const rl = slidingWindow(RATE_LIMIT_KEY, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW_MS);
  if (!rl.ok) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[mahshar] rate_limit_hit');
    }
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      {
        status: 429,
        headers: { 'Retry-After': String(rl.retryAfterSeconds) },
      },
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const address = body.address;
  if (typeof address !== 'string' || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
    return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
  }

  const langCode = (body.language as LangCode) ?? 'EN';
  const langName = GROQ_LANG_NAMES[langCode] ?? 'English';
  const responseLang: string = GROQ_LANG_NAMES[langCode] ? langCode : 'EN';

  const [tarotRes, astroRes, numRes] = await Promise.allSettled([
    tarotReading(address, langName),
    astrologyReading(address, langName),
    numerologyReading(address, langName),
  ]);

  const results = [tarotRes, astroRes, numRes];
  const allFailed = results.every((r) => r.status === 'rejected');
  if (allFailed) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('[mahshar] all_readings_failed');
    }
    return NextResponse.json(
      { error: 'All readings failed' },
      { status: 502 },
    );
  }

  return NextResponse.json({
    address,
    language: responseLang,
    tarot:
      tarotRes.status === 'fulfilled'
        ? tarotRes.value
        : { error: 'failed' as const },
    astrology:
      astroRes.status === 'fulfilled'
        ? astroRes.value
        : { error: 'failed' as const },
    numerology:
      numRes.status === 'fulfilled'
        ? numRes.value
        : { error: 'failed' as const },
  });
}
