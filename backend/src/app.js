import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expense.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { validateIdempotencyKey } from './middleware/idempotency.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '1mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Idempotency middleware for request tracking
app.use(validateIdempotencyKey);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success',
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/expenses', expenseRoutes);

// 404 Not Found handler
app.use((req, res) => {
  res.status(404).json({
    status: 'error',
    code: 'NOT_FOUND',
    message: `Route ${req.method} ${req.path} not found`,
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
