'use client';

type ModuleKey = 'astrology' | 'tarot';

function cacheKey(module: ModuleKey, address: string): string {
  return `0xfuture:reading:${module}:${address.toLowerCase()}`;
}

function utcDateStr(d: Date = new Date()): string {
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
}

export function readCachedReading<T>(
  module: ModuleKey,
  address: string | null,
): T | null {
  if (!address) return null;
  try {
    const key = cacheKey(module, address);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { utcDate?: unknown; result?: unknown };
    if (parsed.utcDate !== utcDateStr()) {
      localStorage.removeItem(key);
      return null;
    }
    if (!parsed.result || typeof parsed.result !== 'object') {
      localStorage.removeItem(key);
      return null;
    }
    return parsed.result as T;
  } catch {
    return null;
  }
}

export function writeCachedReading<T>(
  module: ModuleKey,
  address: string,
  result: T,
): void {
  try {
    localStorage.setItem(
      cacheKey(module, address),
      JSON.stringify({ utcDate: utcDateStr(), result }),
    );
  } catch {
    // storage disabled or quota exceeded — module still works from state alone
  }
}

export function clearCachedReading(
  module: ModuleKey,
  address: string | null,
): void {
  if (!address) return;
  try {
    localStorage.removeItem(cacheKey(module, address));
  } catch {
    // ignore
  }
}
