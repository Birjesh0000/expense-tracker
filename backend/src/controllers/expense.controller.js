import Expense from '../models/Expense.js';

// POST /api/expenses - Create a new expense
export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date } = req.body;

    // Get idempotency key from header (standard) or request body
    const idempotencyKey = req.headers['idempotency-key'] || req.body.idempotencyKey;

    // Validate required fields
    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        error: 'Missing required fields: amount, category, description, date',
      });
    }

    // Validate amount is positive
    if (Number(amount) <= 0) {
      return res.status(400).json({
        error: 'Amount must be greater than 0',
      });
    }

    // Handle idempotency - check for duplicate submission
    if (idempotencyKey) {
      // Validate idempotency key format (UUID or string)
      if (typeof idempotencyKey !== 'string' || idempotencyKey.trim().length === 0) {
        return res.status(400).json({
          error: 'Idempotency-Key must be a non-empty string',
        });
      }

      // Check if expense with this idempotency key already exists
      const existingExpense = await Expense.findOne({ idempotencyKey });
      if (existingExpense) {
        // Return existing response (idempotent behavior)
        return res.status(200).json({
          message: 'Expense already created',
          isIdempotentResponse: true,
          expense: existingExpense,
        });
      }
    }

    // Create new expense
    const newExpense = new Expense({
      amount,
      category,
      description,
      date,
      idempotencyKey: idempotencyKey || null,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: 'Expense created successfully',
      isIdempotentResponse: false,
      expense: savedExpense,
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
      filter.category = category;
    }

    // Build sort object
    let sortOptions = { createdAt: -1 }; // Default: newest first
    if (sort === 'date_desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'date_asc') {
      sortOptions = { date: 1 };
    }

    // Query expenses
    const expenses = await Expense.find(filter).sort(sortOptions);

    // Calculate total
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
      expenses,
      total,
      count: expenses.length,
    });
  } catch (error) {
    next(error);
  }
};
