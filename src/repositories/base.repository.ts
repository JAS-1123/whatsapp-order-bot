import { PrismaClient } from '@prisma/client';
import { prisma } from '../database/prisma';

export abstract class BaseRepository<T> {
  protected prisma: PrismaClient;

  constructor() {
    // Repository layer must depend on Prisma
    this.prisma = prisma;
  }
}
