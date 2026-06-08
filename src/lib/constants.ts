import type { TarotCard, ZodiacSign } from '@/types';

export const USDC_ADDRESS_BASE = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as const;
export const BASE_CHAIN_ID = 8453;

export const READING_PRICES = {
  numerology: 0n,
  astrology: 100_000n,  // $0.10 USDC (6 decimals)
  tarot: 500_000n,      // $0.50 USDC (6 decimals)
} as const;

export const ZODIAC_SIGNS: { sign: ZodiacSign; from: [number, number]; to: [number, number] }[] = [
  { sign: 'Capricorn',   from: [12, 22], to: [1,  19] },
  { sign: 'Aquarius',    from: [1,  20], to: [2,  18] },
  { sign: 'Pisces',      from: [2,  19], to: [3,  20] },
  { sign: 'Aries',       from: [3,  21], to: [4,  19] },
  { sign: 'Taurus',      from: [4,  20], to: [5,  20] },
  { sign: 'Gemini',      from: [5,  21], to: [6,  20] },
  { sign: 'Cancer',      from: [6,  21], to: [7,  22] },
  { sign: 'Leo',         from: [7,  23], to: [8,  22] },
  { sign: 'Virgo',       from: [8,  23], to: [9,  22] },
  { sign: 'Libra',       from: [9,  23], to: [10, 22] },
  { sign: 'Scorpio',     from: [10, 23], to: [11, 21] },
  { sign: 'Sagittarius', from: [11, 22], to: [12, 21] },
];

export const ZODIAC_SYMBOLS: Record<ZodiacSign, string> = {
  Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋',
  Leo: '♌', Virgo: '♍', Libra: '♎', Scorpio: '♏',
  Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓',
};

export const MAJOR_ARCANA: Omit<TarotCard, 'reversed'>[] = [
  { name: 'The Fool',          arcana: 'major', number: 0,  imageSymbol: '🃏' },
  { name: 'The Magician',      arcana: 'major', number: 1,  imageSymbol: '🪄' },
  { name: 'The High Priestess',arcana: 'major', number: 2,  imageSymbol: '🌙' },
  { name: 'The Empress',       arcana: 'major', number: 3,  imageSymbol: '🌿' },
  { name: 'The Emperor',       arcana: 'major', number: 4,  imageSymbol: '👑' },
  { name: 'The Hierophant',    arcana: 'major', number: 5,  imageSymbol: '⛪' },
  { name: 'The Lovers',        arcana: 'major', number: 6,  imageSymbol: '💞' },
  { name: 'The Chariot',       arcana: 'major', number: 7,  imageSymbol: '🏆' },
  { name: 'Strength',          arcana: 'major', number: 8,  imageSymbol: '🦁' },
  { name: 'The Hermit',        arcana: 'major', number: 9,  imageSymbol: '🔦' },
  { name: 'Wheel of Fortune',  arcana: 'major', number: 10, imageSymbol: '🎡' },
  { name: 'Justice',           arcana: 'major', number: 11, imageSymbol: '⚖️' },
  { name: 'The Hanged Man',    arcana: 'major', number: 12, imageSymbol: '🙃' },
  { name: 'Death',             arcana: 'major', number: 13, imageSymbol: '💀' },
  { name: 'Temperance',        arcana: 'major', number: 14, imageSymbol: '🌊' },
  { name: 'The Devil',         arcana: 'major', number: 15, imageSymbol: '😈' },
  { name: 'The Tower',         arcana: 'major', number: 16, imageSymbol: '⚡' },
  { name: 'The Star',          arcana: 'major', number: 17, imageSymbol: '⭐' },
  { name: 'The Moon',          arcana: 'major', number: 18, imageSymbol: '🌕' },
  { name: 'The Sun',           arcana: 'major', number: 19, imageSymbol: '☀️' },
  { name: 'Judgement',         arcana: 'major', number: 20, imageSymbol: '📯' },
  { name: 'The World',         arcana: 'major', number: 21, imageSymbol: '🌍' },
];

const SUITS = ['Wands', 'Cups', 'Swords', 'Pentacles'] as const;
const SUIT_SYMBOLS: Record<string, string> = {
  Wands: '🔥', Cups: '💧', Swords: '⚔️', Pentacles: '🪙',
};
const RANKS = ['Ace','2','3','4','5','6','7','8','9','10','Page','Knight','Queen','King'];

export const MINOR_ARCANA: Omit<TarotCard, 'reversed'>[] = SUITS.flatMap((suit, si) =>
  RANKS.map((rank, ri) => ({
    name: `${rank} of ${suit}`,
    arcana: 'minor' as const,
    suit,
    number: si * 14 + ri + 22,
    imageSymbol: SUIT_SYMBOLS[suit],
  }))
);

export const FULL_DECK: Omit<TarotCard, 'reversed'>[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export const TAROT_IMAGES: Record<string, string> = {
  // Major Arcana
  'The Fool':           'https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg',
  'The Magician':       'https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg',
  'The High Priestess': 'https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg',
  'The Empress':        'https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg',
  'The Emperor':        'https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg',
  'The Hierophant':     'https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg',
  'The Lovers':         'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_06_Lovers.jpg',
  'The Chariot':        'https://upload.wikimedia.org/wikipedia/commons/9/9b/RWS_Tarot_07_Chariot.jpg',
  'Strength':           'https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg',
  'The Hermit':         'https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg',
  'Wheel of Fortune':   'https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg',
  'Justice':            'https://upload.wikimedia.org/wikipedia/commons/e/e0/RWS_Tarot_11_Justice.jpg',
  'The Hanged Man':     'https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg',
  'Death':              'https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg',
  'Temperance':         'https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg',
  'The Devil':          'https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg',
  'The Tower':          'https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg',
  'The Star':           'https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg',
  'The Moon':           'https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg',
  'The Sun':            'https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg',
  'Judgement':          'https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg',
  'The World':          'https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg',
  // Wands
  'Ace of Wands':    'https://upload.wikimedia.org/wikipedia/commons/e/e5/Ace_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '2 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/9/97/Two_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '3 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/3/31/Three_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '4 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/0/0c/Four_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '5 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/4/42/Five_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '6 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/0/0e/Six_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '7 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/7/7f/Seven_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '8 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/0/0a/Eight_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '9 of Wands':      'https://upload.wikimedia.org/wikipedia/commons/b/b7/Nine_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  '10 of Wands':     'https://upload.wikimedia.org/wikipedia/commons/7/7c/Ten_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Page of Wands':   'https://upload.wikimedia.org/wikipedia/commons/3/34/Page_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Knight of Wands': 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Knight_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Queen of Wands':  'https://upload.wikimedia.org/wikipedia/commons/8/8b/Queen_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  'King of Wands':   'https://upload.wikimedia.org/wikipedia/commons/e/e1/King_of_Wands_%28Rider-Waite_Smith_tarot_deck%29.png',
  // Cups
  'Ace of Cups':    'https://upload.wikimedia.org/wikipedia/commons/8/86/Ace_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '2 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/7/7b/Two_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '3 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/9/9e/Three_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '4 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/c/cd/Four_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '5 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/3/34/Five_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '6 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/f/f7/Six_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '7 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/5/5e/Seven_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '8 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/0/0b/Eight_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '9 of Cups':      'https://upload.wikimedia.org/wikipedia/commons/8/86/Nine_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  '10 of Cups':     'https://upload.wikimedia.org/wikipedia/commons/9/9c/Ten_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Page of Cups':   'https://upload.wikimedia.org/wikipedia/commons/5/5e/Page_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Knight of Cups': 'https://upload.wikimedia.org/wikipedia/commons/1/16/Knight_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Queen of Cups':  'https://upload.wikimedia.org/wikipedia/commons/a/a4/Queen_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  'King of Cups':   'https://upload.wikimedia.org/wikipedia/commons/4/4e/King_of_Cups_%28Rider-Waite_Smith_tarot_deck%29.png',
  // Swords (Ace filed as "One_of_Swords" on Wikimedia Commons)
  'Ace of Swords':    'https://upload.wikimedia.org/wikipedia/commons/f/fd/One_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '2 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/7/7d/Two_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '3 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/9/9f/Three_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '4 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/6/61/Four_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '5 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/4/42/Five_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '6 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/f/f4/Six_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '7 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/0/04/Seven_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '8 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/b/be/Eight_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '9 of Swords':      'https://upload.wikimedia.org/wikipedia/commons/1/1f/Nine_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  '10 of Swords':     'https://upload.wikimedia.org/wikipedia/commons/6/62/Ten_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Page of Swords':   'https://upload.wikimedia.org/wikipedia/commons/e/ef/Page_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Knight of Swords': 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Knight_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Queen of Swords':  'https://upload.wikimedia.org/wikipedia/commons/b/b1/Queen_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  'King of Swords':   'https://upload.wikimedia.org/wikipedia/commons/8/85/King_of_Swords_%28Rider-Waite_Smith_tarot_deck%29.png',
  // Pentacles (Ace filed as "One_of_Pentacles" on Wikimedia Commons)
  'Ace of Pentacles':    'https://upload.wikimedia.org/wikipedia/commons/5/54/One_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '2 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/1/14/Two_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '3 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/e/ea/Three_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '4 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/c/c9/Four_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '5 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/e/e7/Five_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '6 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/c/cf/Six_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '7 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/1/10/Seven_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '8 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/4/45/Eight_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '9 of Pentacles':      'https://upload.wikimedia.org/wikipedia/commons/5/55/Nine_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  '10 of Pentacles':     'https://upload.wikimedia.org/wikipedia/commons/f/f3/Ten_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Page of Pentacles':   'https://upload.wikimedia.org/wikipedia/commons/8/86/Page_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Knight of Pentacles': 'https://upload.wikimedia.org/wikipedia/commons/d/d8/Knight_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  'Queen of Pentacles':  'https://upload.wikimedia.org/wikipedia/commons/1/1d/Queen_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
  'King of Pentacles':   'https://upload.wikimedia.org/wikipedia/commons/a/a5/King_of_Pentacles_%28Rider-Waite_Smith_tarot_deck%29.png',
};

export const LIFE_PATH_MEANINGS: Record<number, string> = {
  1:  'The Leader — pioneering, independent, original',
  2:  'The Diplomat — cooperative, sensitive, intuitive',
  3:  'The Communicator — creative, expressive, social',
  4:  'The Builder — practical, disciplined, reliable',
  5:  'The Freedom Seeker — adventurous, versatile, curious',
  6:  'The Nurturer — responsible, loving, protective',
  7:  'The Seeker — analytical, spiritual, introspective',
  8:  'The Powerhouse — ambitious, authoritative, material',
  9:  'The Humanitarian — compassionate, wise, idealistic',
  11: 'Master Number — visionary, inspirational, psychic',
  22: 'Master Number — master builder, visionary achiever',
  33: 'Master Number — master teacher, enlightened healer',
};
