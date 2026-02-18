export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      error: 'Validation failed',
      details: Object.values(err.errors).map(e => e.message),
    });
  }

  // Duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate entry',
      message: 'This entry already exists',
    });
  }

  // Cast errors (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({
      error: 'Invalid ID format',
    });
  }

  // Default error response
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
};
