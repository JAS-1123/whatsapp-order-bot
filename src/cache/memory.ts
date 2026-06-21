import { CacheProvider } from './provider';

export class MemoryCacheProvider implements CacheProvider {
  private cache: Map<string, { value: string; expiry: number | null }> = new Map();

  public async get(key: string): Promise<string | null> {
    const item = this.cache.get(key);
    if (!item) return null;

    if (item.expiry !== null && Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.value;
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    const expiry = ttlSeconds ? Date.now() + ttlSeconds * 1000 : null;
    this.cache.set(key, { value, expiry });
  }

  public async delete(key: string): Promise<void> {
    this.cache.delete(key);
  }

  public async exists(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  public async keys(pattern: string): Promise<string[]> {
    // Basic regex conversion from glob-like pattern (e.g. "cart:*")
    const regex = new RegExp(`^${pattern.replace(/\*/g, '.*')}$`);
    const result: string[] = [];
    for (const [key, item] of this.cache.entries()) {
      if (regex.test(key)) {
        if (item.expiry === null || Date.now() <= item.expiry) {
          result.push(key);
        } else {
          this.cache.delete(key);
        }
      }
    }
    return result;
  }

  public async close(): Promise<void> {
    this.cache.clear();
  }
}
