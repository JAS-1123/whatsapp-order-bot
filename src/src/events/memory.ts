import { EventEmitter } from 'events';
import { EventBus, Event } from './bus';
import { logger } from '../utils/logger';

export class MemoryEventBus implements EventBus {
  private emitter = new EventEmitter();

  public async publish(event: Event): Promise<void> {
    setImmediate(() => {
      this.emitter.emit(event.eventName, event);
    });
  }

  public subscribe(eventName: string, handler: (event: Event) => Promise<void>): void {
    this.emitter.on(eventName, async (event) => {
      try {
        await handler(event);
      } catch (error) {
        logger.error(`Error processing event ${eventName}:`, error);
      }
    });
  }
}
