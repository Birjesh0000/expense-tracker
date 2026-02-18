import Expense from '../models/Expense.js';
import { validateExpenseData, sanitizeExpenseData } from '../utils/validation.utils.js';

// POST /api/expenses - Create a new expense
export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;

    // Get idempotency key from header (standard) or request body
    const idempotencyKey = req.headers['idempotency-key'] || req.body?.idempotencyKey;

    // Validate input data
    const validation = validateExpenseData({ amount, category, description, date });
    if (!validation.isValid) {
      return res.status(400).json({
        status: 'error',
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors: validation.errors,
      });
    }

    // Validate idempotency key if provided
    if (idempotencyKey) {
      if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          code: 'INVALID_IDEMPOTENCY_KEY',
          message: 'Idempotency-Key must be a non-empty string',
        });
      }

      // Check if expense with this idempotency key already exists
      const existingExpense = await Expense.findOne({ idempotencyKey });
      if (existingExpense) {
        // Return existing response (idempotent behavior)
        return res.status(200).json({
          status: 'success',
          message: 'Expense already created',
          isIdempotentResponse: true,
          data: {
            expense: existingExpense,
          },
        });
      }
    }

    // Sanitize input data
    const sanitizedData = sanitizeExpenseData({ amount, category, description, date });

    // Create new expense
    const newExpense = new Expense({
      amount: sanitizedData.amount,
      category: sanitizedData.category,
      description: sanitizedData.description,
      date: sanitizedData.date,
      idempotencyKey: idempotencyKey ? idempotencyKey.trim() : null,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      status: 'success',
      message: 'Expense created successfully',
      isIdempotentResponse: false,
      data: {
        expense: savedExpense,
      },
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/expenses - Get all expenses with optional filtering and sorting
export const getExpenses = async (req, res, next) => {
  try {
    const { category, sort } = req.query;

    // Build filter object
    let filter = {};
    if (category) {
      // Validate and sanitize category parameter
      if (typeof category !== 'string' || category.trim().length === 0) {
        return res.status(400).json({
          status: 'error',
          code: 'INVALID_FILTER',
          message: 'Category filter must be a non-empty string',
        });
      }
      filter.category = category.trim();
    }

    // Build sort object
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'date_desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'date_asc') {
      sortOptions = { date: 1 };
    } else if (sort && sort !== 'created_desc') {
      // Warn about invalid sort parameter
      console.warn('Invalid sort parameter:', sort);
    }

    // Query expenses
    const expenses = await Expense.find(filter).sort(sortOptions);

    // Calculate total using aggregation
    const totalResult = await Expense.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          total: {
            $sum: { $convert: { input: '$amount', to: 'double' } },
          },
        },
      },
    ]);

    const total = totalResult[0]?.total || 0;

    res.status(200).json({
      status: 'success',
      message: 'Expenses retrieved successfully',
      data: {
        expenses,
        total,
        count: expenses.length,
      },
    });
  } catch (error) {
    next(error);
  }
};
