const windows = new Map<string, number[]>();

export type RateLimitResult =
  | { ok: true }
  | { ok: false; retryAfterSeconds: number };

export function slidingWindow(
  key: string,
  limit: number,
  windowMs: number,
  now: number = Date.now(),
): RateLimitResult {
  const cutoff = now - windowMs;
  const timestamps = (windows.get(key) ?? []).filter((t) => t > cutoff);
  if (timestamps.length >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((timestamps[0] + windowMs - now) / 1000),
    );
    windows.set(key, timestamps);
    return { ok: false, retryAfterSeconds };
  }
  timestamps.push(now);
  windows.set(key, timestamps);
  return { ok: true };
}
