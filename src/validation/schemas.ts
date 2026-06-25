import { z } from 'zod';
import { ConversationState } from '../conversation/states';
import { OrderStatus } from '../conversation/states'; // Re-use the same enum file or separate

export const userSchema = z.object({
  phoneNumber: z.string().min(10).max(15),
  name: z.string().optional(),
});

export const categorySchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

export const productSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  stock: z.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  quantity: z.number().int().positive(),
  unitPrice: z.number().positive(),
});

export const orderSchema = z.object({
  userId: z.string().uuid(),
  items: z.array(orderItemSchema).min(1),
  totalAmount: z.number().positive(),
  status: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
});
