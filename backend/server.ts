import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { Pool, PoolClient } from 'pg';
import authRoutes from './routes/auth';
import productsRoutes from './routes/products';
import cartRoutes from './routes/cart';
import paymentsRoutes from './routes/payments';
import ordersRoutes from './routes/orders';
import reviewsRoutes from './routes/reviews';
import wishlistRoutes from './routes/wishlist';
import { exec } from 'child_process';
import path from 'path';
import { verifyToken, isAdmin } from './middleware/auth';

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
    
    // Check snapshot status
    const snapshotResult = await pgPool.query('SELECT version, updated_at FROM products_snapshot WHERE id = 1');
    const metricsResult = await pgPool.query('SELECT * FROM snapshot_metrics ORDER BY created_at DESC LIMIT 1');

    res.json({
      status: 'API is running',
      database: 'connected',
      snapshot: {
        last_version: snapshotResult.rows[0]?.version,
        last_updated: snapshotResult.rows[0]?.updated_at,
        last_metrics: metricsResult.rows[0],
      },
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
// ADMIN ROUTES
// ============================================================================

app.post('/api/admin/build-snapshot', verifyToken, isAdmin, (req: Request, res: Response) => {
  const scriptPath = path.join(__dirname, 'supabase-edge', 'snapshot-builder', 'ci-run.js');
  
  console.log(`Triggering snapshot build: node ${scriptPath}`);
  
  exec(`node ${scriptPath}`, {
    env: { ...process.env, FORCE: '1' }
  }, (error, stdout, stderr) => {
    if (error) {
      console.error(`Build error: ${error.message}`);
      return res.status(500).json({ error: 'Build failed', details: stderr });
    }
    console.log(`Build success: ${stdout}`);
    res.json({ message: 'Snapshot build triggered successfully', output: stdout });
  });
});

// ============================================================================
// ROUTES
// ============================================================================

app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/wishlist', wishlistRoutes);

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
