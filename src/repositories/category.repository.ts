import { BaseRepository } from './base.repository';
import { Category } from '@prisma/client';

export interface ICategoryRepository {
  findAll(): Promise<Category[]>;
  findById(id: string): Promise<Category | null>;
}

export class CategoryRepository extends BaseRepository<Category> implements ICategoryRepository {
  public async findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  public async findById(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  public async create(data: Omit<Category, 'id'>): Promise<Category> {
    return this.prisma.category.create({ data });
  }

  public async update(id: string, data: Partial<Category>): Promise<Category> {
    return this.prisma.category.update({ where: { id }, data });
  }

  public async delete(id: string): Promise<Category> {
    return this.prisma.category.delete({ where: { id } });
  }
}
