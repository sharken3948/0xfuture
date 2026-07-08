import type { ChainKey, ZodiacSign } from '@/types';
import { CHAIN_CONFIGS, ZODIAC_SIGNS } from './constants';

export function dateToZodiac(date: Date): ZodiacSign {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  for (const { sign, from, to } of ZODIAC_SIGNS) {
    const [fromMonth, fromDay] = from;
    const [toMonth, toDay] = to;

    if (fromMonth > toMonth) {
      // sign wraps year-end (Capricorn: Dec 22 – Jan 19)
      if ((month === fromMonth && day >= fromDay) || (month === toMonth && day <= toDay)) {
        return sign;
      }
    } else {
      if (
        (month === fromMonth && day >= fromDay) ||
        (month > fromMonth && month < toMonth) ||
        (month === toMonth && day <= toDay)
      ) {
        return sign;
      }
    }
  }

  return 'Capricorn';
}

export async function getFirstTransactionDate(
  address: string,
  chainKey: ChainKey,
): Promise<Date> {
  const cfg = CHAIN_CONFIGS[chainKey];
  const url = new URL(cfg.explorerApi);
  url.searchParams.set('module', 'account');
  url.searchParams.set('action', 'txlist');
  url.searchParams.set('address', address);
  url.searchParams.set('startblock', '0');
  url.searchParams.set('endblock', '99999999');
  url.searchParams.set('page', '1');
  url.searchParams.set('offset', '1');
  url.searchParams.set('sort', 'asc');

  // Basescan requires an API key; Soneium Blockscout does not.
  if (chainKey === 'base') {
    const apiKey = process.env.BASESCAN_API_KEY;
    if (apiKey) url.searchParams.set('apikey', apiKey);
  }

  const res = await fetch(url.toString(), { next: { revalidate: 3600 } });
  const data = await res.json();

  if (data.status === '1' && data.result?.length > 0) {
    return new Date(parseInt(data.result[0].timeStamp) * 1000);
  }

  // Fallback: derive pseudo-date from address bytes
  const hex = address.toLowerCase().replace(/^0x/, '');
  const month = (parseInt(hex.slice(0, 2), 16) % 12) + 1;
  const day = (parseInt(hex.slice(2, 4), 16) % 28) + 1;
  const year = 2020 + (parseInt(hex.slice(4, 6), 16) % 4);
  return new Date(year, month - 1, day);
}
