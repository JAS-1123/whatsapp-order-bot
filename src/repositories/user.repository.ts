import { BaseRepository } from './base.repository';
import { User, Prisma } from '@prisma/client';

export interface IUserRepository {
  create(data: Prisma.UserCreateInput): Promise<User>;
  findByPhone(phoneNumber: string): Promise<User | null>;
  findById(id: string): Promise<User | null>;
  update(id: string, data: Prisma.UserUpdateInput): Promise<User>;
}

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  public async create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  public async findByPhone(phoneNumber: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phoneNumber } });
  }

  public async findById(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { id } });
  }

  public async findAllWithOrderCount() {
    const users = await this.prisma.user.findMany({
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
    return users.map(u => ({
      id: u.id,
      phoneNumber: u.phoneNumber,
      totalOrders: u._count.orders
    }));
  }

  public async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
}
