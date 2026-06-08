const MASTER_NUMBERS = new Set([11, 22, 33]);

function reduceToSingle(n: number): number {
  if (n <= 9 || MASTER_NUMBERS.has(n)) return n;
  const sum = String(n).split('').reduce((acc, d) => acc + parseInt(d), 0);
  return reduceToSingle(sum);
}

export function calculateLifePath(address: string): { digits: number[]; lifePathNumber: number } {
  const hex = address.toLowerCase().replace(/^0x/, '');
  const digits = hex.split('').map((c) => parseInt(c, 16) % 9 || 9);
  const rawSum = digits.reduce((a, b) => a + b, 0);
  const lifePathNumber = reduceToSingle(rawSum);
  return { digits, lifePathNumber };
}
