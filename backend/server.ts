import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 4000;

// Database connection pool (proper typing)
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const pool = pgPool;

(pgPool as any).on('error', (err: Error) => {
  console.error('Unexpected error on idle client', err);
});

(pgPool as any).on('connect', () => {
  console.log('Database connected');
});

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ============================================================================
// HEALTH CHECK ENDPOINT
// ============================================================================

app.get('/health', async (req: Request, res: Response) => {
  try {
    const client: PoolClient = await pgPool.connect();
    await client.query('SELECT NOW()');
    client.release();
    
    res.json({
      status: 'API is running',
      database: 'connected',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(503).json({
      status: 'Service unavailable',
      database: 'disconnected',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// ============================================================================
// ROUTES (Will be added as we build them)
// ============================================================================

app.get('/api', (req: Request, res: Response) => {
  res.json({
    message: 'E-commerce API v1',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth/*',
      products: '/api/products/*',
      orders: '/api/orders/*',
      cart: '/api/cart/*',
      customers: '/api/customers/*',
      admin: '/api/admin/*',
    },
  });
});

// ============================================================================
// ERROR HANDLING MIDDLEWARE
// ============================================================================

interface CustomError extends Error {
  status?: number;
}

app.use((err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  
  console.error(`[ERROR] ${status} ${message}`);
  
  res.status(status).json({
    error: {
      status,
      message,
      timestamp: new Date().toISOString(),
    },
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: {
      status: 404,
      message: `Route ${req.method} ${req.path} not found`,
    },
  });
});

// ============================================================================
// SERVER STARTUP
// ============================================================================

const server = app.listen(port, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 E-COMMERCE API SERVER                 ║
║  Running on http://localhost:${port}       ║
║  Environment: ${process.env.NODE_ENV || 'development'}            ║
╚════════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, closing server gracefully...');
  server.close(() => {
    pgPool.end(() => {
      console.log('Database connection closed');
      process.exit(0);
    });
  });
});

export default app;
