import { CacheProvider } from './provider';
import { MemoryCacheProvider } from './memory';
import { RedisCacheProvider } from './redis';
import { config } from '../config';
import { logger } from '../utils/logger';

let cache: CacheProvider;

if (config.REDIS_HOST && config.REDIS_PORT) {
  cache = new RedisCacheProvider(config.REDIS_HOST, config.REDIS_PORT);
} else {
  logger.info('Using MemoryCacheProvider');
  cache = new MemoryCacheProvider();
}

export { cache };
