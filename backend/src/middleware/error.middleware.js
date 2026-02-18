/**
 * Error handling middleware
 * Catches and formats all errors consistently across the API
 */

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
      status: 'error',
      code: 'VALIDATION_ERROR',
      message: 'Validation failed',
      errors: messages,
    });
  }

  // Mongoose cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_ID',
      message: 'Invalid ID format',
    });
  }

  // Duplicate key errors (MongoDB unique constraint)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      status: 'error',
      code: 'DUPLICATE_ENTRY',
      message: `A record with this ${field} already exists`,
      field,
    });
  }

  // JSON parse errors (malformed request body)
  if (err instanceof SyntaxError && err.status === 400) {
    return res.status(400).json({
      status: 'error',
      code: 'INVALID_JSON',
      message: 'Invalid JSON in request body',
    });
  }

  // Custom application errors with status code
  if (err.status) {
    return res.status(err.status).json({
      status: 'error',
      code: err.code || 'ERROR',
      message: err.message,
    });
  }

  // Default error response
  res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: process.env.NODE_ENV === 'production' 
      ? 'Internal server error' 
      : err.message || 'An unexpected error occurred',
  });
};
