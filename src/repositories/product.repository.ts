import { BaseRepository } from './base.repository';
import { Product } from '@prisma/client';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findByCategory(categoryId: string): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
}

export class ProductRepository extends BaseRepository<Product> implements IProductRepository {
  public async findAll(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  public async findAllWithOrderCount() {
    return this.prisma.product.findMany({
      include: {
        _count: {
          select: { orderItems: true }
        }
      }
    });
  }

  public async findByCategory(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { categoryId } });
  }

  public async findAvailableProducts(): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { isActive: true } });
  }

  public async findAvailableByCategory(categoryId: string): Promise<Product[]> {
    return this.prisma.product.findMany({ where: { categoryId, isActive: true } });
  }

  public async findById(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({ where: { id } });
  }

  public async create(data: Omit<Product, 'id'>): Promise<Product> {
    return this.prisma.product.create({ data });
  }

  public async update(id: string, data: Partial<Product>): Promise<Product> {
    return this.prisma.product.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<Product> {
    return this.prisma.product.delete({ where: { id } });
  }
}
