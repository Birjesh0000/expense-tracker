/**
 * Idempotency Utilities
 * 
 * Idempotency ensures that requests with the same Idempotency-Key
 * always return the same result, even if the request is retried.
 * 
 * This is critical for handling:
 * - Network timeouts and retries
 * - Browser page refreshes after form submission
 * - User double-clicks on submit button
 * - Any other duplicate request scenarios in real-world conditions
 */

/**
 * Generate a UUID v4 for use as Idempotency-Key
 * This should be generated on the client side before sending the request
 */
export const generateIdempotencyKey = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * How to use Idempotency-Key with the API:
 * 
 * Example POST request:
 * ```
 * POST /api/expenses
 * Headers: {
 *   'Content-Type': 'application/json',
 *   'Idempotency-Key': 'uuid-generated-on-client'  // Client generates this
 * }
 * Body: {
 *   "amount": 1500,
 *   "category": "Food",
 *   "description": "Lunch",
 *   "date": "2024-02-18"
 * }
 * ```
 * 
 * Response on first request (201 Created):
 * ```
 * {
 *   "message": "Expense created successfully",
 *   "isIdempotentResponse": false,
 *   "expense": { ... }
 * }
 * ```
 * 
 * Response on retry with same Idempotency-Key (200 OK):
 * ```
 * {
 *   "message": "Expense already created",
 *   "isIdempotentResponse": true,
 *   "expense": { ... } // Same expense as first request
 * }
 * ```
 */

export const idempotencyHowto = {
  generateKey: generateIdempotencyKey,
  headerName: 'Idempotency-Key',
  description: 'Prevents duplicate expense creation on retries and page refreshes',
};
