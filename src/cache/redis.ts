import Redis from 'ioredis';
import { CacheProvider } from './provider';
import { logger } from '../utils/logger';

export class RedisCacheProvider implements CacheProvider {
  public client: Redis;

  constructor(host: string, port: number) {
    this.client = new Redis({
      host,
      port,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
      maxRetriesPerRequest: null,
    });

    this.client.on('connect', () => {
      logger.info('Connected to Redis successfully');
    });

    this.client.on('error', (err) => {
      logger.error('Redis Client Error', err);
    });
  }

  public async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
    if (ttlSeconds) {
      await this.client.set(key, value, 'EX', ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  public async delete(key: string): Promise<void> {
    await this.client.del(key);
  }

  public async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key);
    return result > 0;
  }

  public async keys(pattern: string): Promise<string[]> {
    return this.client.keys(pattern);
  }

  public async close(): Promise<void> {
    try {
      await this.client.quit();
      logger.info('Redis connection closed gracefully');
    } catch (error) {
      logger.error('Error closing Redis connection', error);
      throw error;
    }
  }
}
