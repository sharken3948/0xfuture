import { NextRequest, NextResponse } from 'next/server';
import { getFirstTransactionDate, dateToZodiac } from '@/lib/astrology';
import { generateReading } from '@/lib/groq';
import { DEFAULT_CHAIN_KEY, ZODIAC_SYMBOLS, isChainKey } from '@/lib/constants';
import { GROQ_LANG_NAMES, type LangCode } from '@/lib/translations';

export async function POST(req: NextRequest) {
  try {
    const { address, txHash, language, chainKey } = await req.json();
    const langName = GROQ_LANG_NAMES[(language as LangCode) ?? 'EN'] ?? 'English';
    if (!address || !/^0x[0-9a-fA-F]{40}$/.test(address)) {
      return NextResponse.json({ error: 'Invalid address' }, { status: 400 });
    }

    // txHash is the proof-of-payment hash (verified client-side)
    if (!txHash) {
      return NextResponse.json({ error: 'Payment required' }, { status: 402 });
    }

    const chain = isChainKey(chainKey) ? chainKey : DEFAULT_CHAIN_KEY;
    const firstTxDate = await getFirstTransactionDate(address, chain);
    const zodiacSign = dateToZodiac(firstTxDate);
    const symbol = ZODIAC_SYMBOLS[zodiacSign];
    const shortAddr = `${address.slice(0, 6)}...${address.slice(-4)}`;

    // Fetch real daily horoscope; fall back to generic prompt if unavailable
    let dailyHoroscope: string | null = null;
    try {
      const horoRes = await fetch(
        `https://freehoroscopeapi.com/api/v1/get-horoscope/daily?sign=${zodiacSign.toLowerCase()}`,
        { next: { revalidate: 3600 } },
      );
      if (horoRes.ok) {
        const horoData = await horoRes.json();
        dailyHoroscope = horoData?.horoscope ?? horoData?.data?.horoscope ?? null;
      }
    } catch {
      // proceed without daily horoscope
    }

    const prompt = dailyHoroscope
      ? `Wallet ${shortAddr} is a ${zodiacSign} ${symbol} (first onchain transaction: ${firstTxDate.toDateString()}).
Based on this real daily horoscope: '${dailyHoroscope}' - create a personalized onchain interpretation for a crypto wallet user. Keep the core message but relate it to their blockchain journey. 2-3 sentences max. No hyphens or dashes.`
      : `Wallet ${shortAddr} made its first onchain transaction on ${firstTxDate.toDateString()}.
This birth date on the blockchain makes them a ${zodiacSign} ${symbol}.
Give a personalized astrology reading for this onchain soul. Reference their ${zodiacSign} nature, how the stars have shaped their web3 journey, and what cosmic forces guide their transactions.`;

    const raw = await generateReading(prompt, langName);
    const interpretation = raw.replace(new RegExp(address, 'gi'), shortAddr);

    return NextResponse.json({
      firstTxDate: firstTxDate.toISOString(),
      zodiacSign,
      symbol,
      interpretation,
    });
  } catch (err) {
    console.error('[astrology]', err);
    return NextResponse.json({ error: 'Reading failed' }, { status: 500 });
  }
}
