/** How many document uploads may be in flight at once. */
export const UPLOAD_CONCURRENCY = 3;

/**
 * Run `worker` over `items` with a fixed number of concurrent tasks.
 * The returned array matches the input order, even when later items finish first.
 */
export async function mapWithConcurrency<T, R>(
  items: readonly T[],
  limit: number,
  worker: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new Error("concurrency limit must be at least 1");
  }

  const results = new Array<R>(items.length);
  let cursor = 0;

  const run = async () => {
    while (cursor < items.length) {
      const index = cursor;
      cursor += 1;
      results[index] = await worker(items[index] as T, index);
    }
  };

  const workers = Math.min(limit, items.length);
  await Promise.all(Array.from({ length: workers }, () => run()));
  return results;
}
