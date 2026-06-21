import { Event } from './bus';

export interface MessageReceivedEvent extends Event {
  eventName: 'MessageReceived';
  payload: {
    messageId: string;
    phoneNumber: string;
    message: string;
  };
}

export interface CartUpdatedEvent extends Event {
  eventName: 'CartUpdated';
  payload: {
    phoneNumber: string;
    totalAmount: number;
    itemCount: number;
  };
}

export interface CartAbandonedEvent extends Event {
  eventName: 'CartAbandoned';
  payload: {
    phoneNumber: string;
  };
}

export interface OrderCreatedEvent extends Event {
  eventName: 'OrderCreated';
  payload: {
    orderId: string;
    userId: string;
    totalAmount: number;
  };
}

export interface OrderStatusChangedEvent extends Event {
  eventName: 'OrderStatusChanged';
  payload: {
    orderId: string;
    status: string;
  };
}
