import mongoose from 'mongoose';

/**
 * Expense Schema
 * 
 * Idempotency Support:
 * - The `idempotencyKey` field ensures that duplicate POST requests 
 *   (due to retries, network issues, or page reloads) don't create duplicate expenses
 * - Set as unique with sparse index so optional requests work fine
 * - When a request with the same idempotencyKey is received, 
 *   the existing expense is returned instead of creating a new one
 */
const expenseSchema = new mongoose.Schema(
  {
    amount: {
      type: mongoose.Decimal128,
      required: true,
      min: 0.01,
      description: 'Expense amount in cents (for precision)',
    },
    category: {
      type: String,
      required: true,
      trim: true,
      description: 'Expense category (e.g., Food, Transport, Entertainment)',
    },
    description: {
      type: String,
      required: true,
      trim: true,
      description: 'Detailed description of the expense',
    },
    date: {
      type: Date,
      required: true,
      description: 'Date when the expense occurred',
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      description: 'Unique key for idempotency - prevents duplicate submissions on retries',
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries on category
expenseSchema.index({ category: 1 });

// Index for sorting by date
expenseSchema.index({ date: -1 });

const Expense = mongoose.model('Expense', expenseSchema);

export default Expense;
