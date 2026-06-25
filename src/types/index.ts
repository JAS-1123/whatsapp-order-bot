export interface User {
  id: string;
  phoneNumber: string;
  name?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  price: number;
  available: boolean;
}

export interface OrderItem {
  productId: string;
  quantity: number;
  priceAtTime: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
}

export interface ConversationSession {
  userId: string;
  state: string;
  context: Record<string, any>;
  lastInteractionAt: Date;
}
