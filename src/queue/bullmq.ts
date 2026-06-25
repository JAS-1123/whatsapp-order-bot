import { Queue, Worker } from 'bullmq';
import { QueueProvider } from './provider';
import { logger } from '../utils/logger';

export class BullMQQueueProvider implements QueueProvider {
  private queues: Map<string, Queue> = new Map();
  private workers: Map<string, Worker> = new Map();
  private connection: { host: string; port: number };

  constructor(host: string, port: number) {
    this.connection = { host, port };
  }

  private getQueue(queueName: string): Queue {
    if (!this.queues.has(queueName)) {
      this.queues.set(queueName, new Queue(queueName, { connection: this.connection }));
    }
    return this.queues.get(queueName)!;
  }

  public async publish(queueName: string, jobName: string, data: any): Promise<void> {
    const queue = this.getQueue(queueName);
    await queue.add(jobName, data);
  }

  public async subscribe(
    queueName: string,
    handler: (job: { name: string; data: any }) => Promise<void>,
  ): Promise<void> {
    if (!this.workers.has(queueName)) {
      const worker = new Worker(
        queueName,
        async (job) => {
          await handler({ name: job.name, data: job.data });
        },
        { connection: this.connection },
      );

      worker.on('error', (err) => {
        logger.error(`BullMQ worker error on ${queueName}:`, err);
      });

      this.workers.set(queueName, worker);
    }
  }

  public async close(): Promise<void> {
    for (const worker of this.workers.values()) {
      await worker.close();
    }
    for (const queue of this.queues.values()) {
      await queue.close();
    }
  }
}
