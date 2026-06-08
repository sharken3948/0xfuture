import type { TarotCard } from '@/types';
import { FULL_DECK } from './constants';

// Seeded LCG for deterministic shuffle from wallet address
function seededRandom(seed: bigint): () => number {
  let state = seed;
  return () => {
    state = (state * 6364136223846793005n + 1442695040888963407n) & 0xffffffffffffffffn;
    return Number(state & 0x7fffffffn) / 0x7fffffff;
  };
}

function fisherYates<T>(arr: T[], random: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function stringToSeed(s: string): bigint {
  let h = 0n;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31n + BigInt(s.charCodeAt(i))) & 0xffffffffffffffffn;
  }
  return h;
}

export function drawThreeCards(address: string): TarotCard[] {
  const seed = stringToSeed(address.toLowerCase() + new Date().toISOString().slice(0, 10));
  const random = seededRandom(seed);

  const shuffled = fisherYates(FULL_DECK, random);
  return shuffled.slice(0, 3).map((card) => ({
    ...card,
    reversed: random() > 0.5,
  }));
}
