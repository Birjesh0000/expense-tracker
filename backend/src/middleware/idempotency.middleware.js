// Middleware to validate and track Idempotency-Key header
export const validateIdempotencyKey = (req, res, next) => {
  // Only validates for POST requests
  if (req.method === 'POST') {
    const idempotencyKey = req.headers['idempotency-key'] || req.body?.idempotencyKey;

    // Store for later use in the request lifecycle
    req.idempotencyKey = idempotencyKey;

    // Optional: Warn if no idempotency key provided
    if (!idempotencyKey) {
      console.warn('Request without Idempotency-Key:', {
        method: req.method,
        path: req.path,
        timestamp: new Date().toISOString(),
      });
    }
  }

  next();
};
