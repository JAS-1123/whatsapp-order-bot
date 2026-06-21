import { app } from './app';
import { config } from './config';
import { logger } from './utils/logger';
import { database } from './database/prisma';
import { cache } from './cache';
import { queue } from './queue';
import { startWorkers, stopWorkers } from './workers';
import './events/register'; // Register event handlers

const startServer = async () => {
  try {
    await database.connect();
    logger.info('Starting worker queues...');
    await startWorkers();

    const server = app.listen(config.PORT, () => {
      console.log('\n==================================');
      console.log('      WhatsApp Ordering Bot       ');
      console.log('==================================\n');
      console.log(`Server: http://localhost:${config.PORT}`);
      console.log('\nNgrok: Starting...');
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('\n==================================\n');
      
      console.log(`WHATSAPP_TOKEN loaded: ${!!config.WHATSAPP_TOKEN}`);
      console.log(`WHATSAPP_TOKEN length: ${config.WHATSAPP_TOKEN?.length || 0}`);
      console.log(`WHATSAPP_PHONE_NUMBER_ID: ${config.WHATSAPP_PHONE_NUMBER_ID || 'missing'}`);
    });

    const shutdown = async (signal: string) => {
      logger.info(`${signal} received: closing HTTP server and resources`);
      server.close(async () => {
        logger.info('HTTP server closed');
        try {
          await stopWorkers();
          await queue.close();
          await cache.close();
          await database.close();
          logger.info('All resources closed gracefully');
          process.exit(0);
        } catch (error) {
          logger.error('Error during graceful shutdown', error);
          process.exit(1);
        }
      });

      // Force shutdown after 10 seconds if graceful shutdown fails
      setTimeout(() => {
        logger.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
};

startServer();
