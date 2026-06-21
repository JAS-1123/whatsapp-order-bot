import { z } from 'zod';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string(),
  REDIS_HOST: z.string().optional(),
  REDIS_PORT: z.string().transform(Number).optional(),
  WHATSAPP_TOKEN: z.string().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  VERIFY_TOKEN: z.string().optional(),
  ADMIN_API_KEY: z.string().optional(),
  ENABLE_DEV_ROUTES: z.string().transform((val) => val === 'true').default('false'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format());
  process.exit(1);
}

export const config = _env.data;

if (!config.WHATSAPP_TOKEN || !config.WHATSAPP_PHONE_NUMBER_ID || !config.VERIFY_TOKEN) {
  logger.warn('WhatsApp integration disabled - credentials not configured');
} else {
  logger.info('Webhook verification enabled');
}

if (!config.ADMIN_API_KEY) {
  logger.warn('ADMIN_API_KEY is not configured! Admin endpoints will reject all requests.');
}
