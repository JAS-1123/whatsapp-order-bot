import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger';

class Database {
  private static instance: Database;
  public prisma: PrismaClient;

  private constructor() {
    this.prisma = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async connect(): Promise<void> {
    try {
      await this.prisma.$connect();
      logger.info('Connected to database via Prisma successfully');
    } catch (error) {
      logger.error('Failed to connect to database', error);
      throw error;
    }
  }

  public async close(): Promise<void> {
    try {
      await this.prisma.$disconnect();
      logger.info('Database connection closed gracefully');
    } catch (error) {
      logger.error('Error closing database connection', error);
      throw error;
    }
  }
}

export const database = Database.getInstance();
export const prisma = database.prisma;
