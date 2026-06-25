import { QueueProvider } from './provider';
import { MemoryQueueProvider } from './memory';
import { BullMQQueueProvider } from './bullmq';
import { config } from '../config';
import { logger } from '../utils/logger';

let queue: QueueProvider;

if (config.REDIS_HOST && config.REDIS_PORT) {
  queue = new BullMQQueueProvider(config.REDIS_HOST, config.REDIS_PORT);
} else {
  logger.info('Using MemoryQueueProvider');
  queue = new MemoryQueueProvider();
}

export { queue };
