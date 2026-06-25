import { EventEmitter } from 'events';
import { QueueProvider } from './provider';
import { logger } from '../utils/logger';

export class MemoryQueueProvider implements QueueProvider {
  private emitter = new EventEmitter();

  public async publish(queueName: string, jobName: string, data: any): Promise<void> {
    setImmediate(() => {
      this.emitter.emit(queueName, { name: jobName, data });
    });
  }

  public async subscribe(
    queueName: string,
    handler: (job: { name: string; data: any }) => Promise<void>,
  ): Promise<void> {
    this.emitter.on(queueName, async (job) => {
      try {
        await handler(job);
      } catch (error) {
        logger.error(`Error processing job in memory queue ${queueName}:`, error);
      }
    });
  }

  public async close(): Promise<void> {
    this.emitter.removeAllListeners();
  }
}
