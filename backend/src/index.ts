import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { connectDatabase } from './config/db.js';
import { errorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/apiRouter.js';

const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS configuration
app.use(cors({
  origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests created from this IP, please try again after 15 minutes.'
  }
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Mount API router
app.use('/api', apiRouter);

// Central error handling
app.use(errorHandler);

// Start server
async function bootstrap() {
  await connectDatabase();
  app.listen(config.port, () => {
    console.log(`[ASL Bridge Backend] Server running in ${config.nodeEnv} mode on port ${config.port}`);
    console.log(`[ASL Bridge Backend] API Gateway endpoint: http://localhost:${config.port}/api`);
  });
}

bootstrap().catch(err => {
  console.error('[ASL Bridge Backend] Fatal startup error:', err);
});

export default app;
