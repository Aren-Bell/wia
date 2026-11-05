/**
 * Client-side debounce function for search inputs, autocomplete, and live filters.
 * Ensures the wrapped function is only executed after `delay` ms of silence.
 */
export function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay = 300
): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
      timer = null;
    }, delay);
  };
}

/**
 * Server-side idempotency / anti-double-click guard.
 * Prevents duplicate submissions within `cooldownMs` window (e.g. rapid double-clicking 'Post' or 'Vote').
 */
const activeLocks = new Map<string, number>();

export function isDuplicateRequest(lockKey: string, cooldownMs = 1500): boolean {
  const now = Date.now();
  const lastTime = activeLocks.get(lockKey);

  if (lastTime && now - lastTime < cooldownMs) {
    return true; // Duplicate / double click detected!
  }

  activeLocks.set(lockKey, now);

  // Auto clean up after cooldown expires
  const t = setTimeout(() => activeLocks.delete(lockKey), cooldownMs + 500);
  t.unref?.();

  return false;
}
