import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwtSecret: process.env.JWT_SECRET || 'dev_secret_asl_bridge_jwt_token_key_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '10', 10),
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/asl_bridge_ai',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  aiServiceUrl: process.env.AI_SERVICE_URL || 'http://localhost:8000',
  rateLimitWindowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 mins
  rateLimitMax: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '1000', 10),
};
