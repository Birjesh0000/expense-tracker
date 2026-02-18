/**
 * API Error Codes and Response Format
 * 
 * All API responses follow a consistent format:
 * Success (2xx): { status: 'success', message: '...', data: {...} }
 * Error (4xx/5xx): { status: 'error', code: 'ERROR_CODE', message: '...', errors: [...] }
 */

export const errorCodes = {
  // Validation Errors (400)
  VALIDATION_ERROR: {
    status: 400,
    message: 'Input validation failed',
    example: {
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: ['Amount must be greater than 0', 'Description cannot be empty'],
    },
  },

  // Invalid JSON
  INVALID_JSON: {
    status: 400,
    message: 'Malformed JSON in request body',
    example: {
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body',
    },
  },

  // Invalid Idempotency Key
  INVALID_IDEMPOTENCY_KEY: {
    status: 400,
    message: 'Idempotency-Key header is invalid',
    example: {
      status: 'error',
      code: 'INVALID_IDEMPOTENCY_KEY',
      message: 'Idempotency-Key must be a non-empty string',
    },
  },

  // Invalid Filter
  INVALID_FILTER: {
    status: 400,
    message: 'Invalid query filter parameter',
    example: {
      status: 'error',
      code: 'INVALID_FILTER',
      message: 'Category filter must be a non-empty string',
    },
  },

  // Invalid ID
  INVALID_ID: {
    status: 400,
    message: 'Invalid MongoDB ObjectId format',
    example: {
      status: 'error',
      code: 'INVALID_ID',
      message: 'Invalid ID format',
    },
  },

  // Duplicate Entry (409)
  DUPLICATE_ENTRY: {
    status: 409,
    message: 'Duplicate entry on unique field',
    example: {
      status: 'error',
      code: 'DUPLICATE_ENTRY',
      message: 'A record with this idempotencyKey already exists',
      field: 'idempotencyKey',
    },
  },

  // Not Found (404)
  NOT_FOUND: {
    status: 404,
    message: 'Resource or endpoint not found',
    example: {
      status: 'error',
      code: 'NOT_FOUND',
      message: 'Route GET /api/invalid not found',
    },
  },

  // Internal Server Error (500)
  INTERNAL_SERVER_ERROR: {
    status: 500,
    message: 'Unexpected server error',
    example: {
      status: 'error',
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    },
  },
};

/**
 * Validation Rules for Expense Fields
 */
export const validationRules = {
  amount: {
    required: true,
    type: 'number',
    min: 0.01,
    max: 999999999.99,
    description: 'Expense amount in currency units',
  },
  category: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 100,
    description: 'Category name (e.g., Food, Transport)',
  },
  description: {
    required: true,
    type: 'string',
    minLength: 1,
    maxLength: 500,
    description: 'Detailed description of the expense',
  },
  date: {
    required: true,
    type: 'Date',
    constraint: 'Must not be in future',
    description: 'Date when expense occurred',
  },
};

/**
 * Success Response Examples
 */
export const successExamples = {
  createExpense: {
    status: 201,
    response: {
      status: 'success',
      message: 'Expense created successfully',
      isIdempotentResponse: false,
      data: {
        expense: {
          _id: '507f1f77bcf86cd799439011',
          amount: 1500,
          category: 'Food',
          description: 'Lunch with clients',
          date: '2024-02-18T00:00:00.000Z',
          idempotencyKey: 'uuid-here',
          createdAt: '2024-02-18T10:30:00.000Z',
          updatedAt: '2024-02-18T10:30:00.000Z',
        },
      },
    },
  },

  getExpenses: {
    status: 200,
    response: {
      status: 'success',
      message: 'Expenses retrieved successfully',
      data: {
        expenses: [
          {
            _id: '507f1f77bcf86cd799439011',
            amount: 1500,
            category: 'Food',
            description: 'Lunch',
            date: '2024-02-18T00:00:00.000Z',
            createdAt: '2024-02-18T10:30:00.000Z',
            updatedAt: '2024-02-18T10:30:00.000Z',
          },
        ],
        total: 1500,
        count: 1,
      },
    },
  },

  idempotentDuplicate: {
    status: 200,
    response: {
      status: 'success',
      message: 'Expense already created',
      isIdempotentResponse: true,
      data: {
        expense: {
          _id: '507f1f77bcf86cd799439011',
          amount: 1500,
          category: 'Food',
          description: 'Lunch',
          date: '2024-02-18T00:00:00.000Z',
          idempotencyKey: 'same-uuid',
          createdAt: '2024-02-18T10:30:00.000Z',
          updatedAt: '2024-02-18T10:30:00.000Z',
        },
      },
    },
  },
};
