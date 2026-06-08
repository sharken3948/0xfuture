export type Module = 'numerology' | 'astrology' | 'tarot';

export interface NumerologyReading {
  walletAddress: string;
  digits: number[];
  lifePathNumber: number;
  interpretation: string;
}

export interface AstrologyReading {
  walletAddress: string;
  firstTxDate: string;
  zodiacSign: ZodiacSign;
  interpretation: string;
}

export interface TarotReading {
  walletAddress: string;
  cards: TarotCard[];
  positions: ['past', 'present', 'future'];
  interpretation: string;
}

export interface TarotCard {
  name: string;
  arcana: 'major' | 'minor';
  suit?: string;
  number: number;
  reversed: boolean;
  imageSymbol: string;
}

export type ZodiacSign =
  | 'Aries'
  | 'Taurus'
  | 'Gemini'
  | 'Cancer'
  | 'Leo'
  | 'Virgo'
  | 'Libra'
  | 'Scorpio'
  | 'Sagittarius'
  | 'Capricorn'
  | 'Aquarius'
  | 'Pisces';

export interface PaymentResult {
  txHash: string;
  success: boolean;
}

export type ReadingState = 'idle' | 'paying' | 'loading' | 'done' | 'error';
