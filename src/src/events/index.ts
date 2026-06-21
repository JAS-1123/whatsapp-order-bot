import { MemoryEventBus } from './memory';
import { EventBus } from './bus';

export const eventBus: EventBus = new MemoryEventBus();

// Expose types for consumers
export * from './bus';
export * from './types';
