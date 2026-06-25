export interface QueueProvider {
  publish(queueName: string, jobName: string, data: any): Promise<void>;
  subscribe(
    queueName: string,
    handler: (job: { name: string; data: any }) => Promise<void>,
  ): Promise<void>;
  close(): Promise<void>;
}
