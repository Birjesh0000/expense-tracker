import express from 'express';
import cors from 'cors';
import expenseRoutes from './routes/expense.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import { validateIdempotencyKey } from './middleware/idempotency.middleware.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Idempotency middleware for request tracking
app.use(validateIdempotencyKey);

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running' });
});

// API routes
app.use('/api/expenses', expenseRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

export default app;
