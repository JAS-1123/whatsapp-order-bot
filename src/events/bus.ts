export interface Event {
  id: string;
  eventName: string;
  timestamp: Date;
  payload: unknown;
}

export interface EventBus {
  publish(event: Event): Promise<void>;
  subscribe(eventName: string, handler: (event: Event) => Promise<void>): void;
}
