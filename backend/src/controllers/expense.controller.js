import Expense from '../models/Expense.js';

// POST /api/expenses - Create a new expense
export const createExpense = async (req, res, next) => {
  try {
    const { amount, category, description, date, idempotencyKey } = req.body;

    // Validate required fields
    if (!amount || !category || !description || !date) {
      return res.status(400).json({
        error: 'Missing required fields: amount, category, description, date',
      });
    }

    // Check for duplicate submission using idempotency key
    if (idempotencyKey) {
      const existingExpense = await Expense.findOne({ idempotencyKey });
      if (existingExpense) {
        return res.status(200).json({
          message: 'Expense already exists (duplicate request)',
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
      idempotencyKey,
    });

    const savedExpense = await newExpense.save();

    res.status(201).json({
      message: 'Expense created successfully',
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
