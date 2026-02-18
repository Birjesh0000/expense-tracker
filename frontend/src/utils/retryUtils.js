/**
 * Retry utility with exponential backoff
 * Handles network failures and retries with configurable backoff strategy
 */

/**
 * Execute a function with automatic retry on failure
 * @param {Function} fn - Async function to retry
 * @param {Object} options - Configuration
 * @param {number} options.maxRetries - Maximum number of retries (default: 3)
 * @param {number} options.initialDelay - Initial delay in ms (default: 1000)
 * @param {number} options.maxDelay - Max delay in ms (default: 10000)
 * @param {number} options.backoffMultiplier - Multiplier for exponential backoff (default: 2)
 * @param {Function} options.onRetry - Callback fired on each retry attempt
 * @returns {Promise} Result of successful execution
 */
export async function retryWithBackoff(fn, options = {}) {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    maxDelay = 10000,
    backoffMultiplier = 2,
    onRetry = null,
  } = options;

  let lastError;
  let delay = initialDelay;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry if it's an AbortError
      if (error.name === 'AbortError') {
        throw error;
      }

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Only retry on network-like errors
      if (!isRetryableError(error)) {
        throw error;
      }

      // Call retry callback if provided
      if (onRetry) {
        onRetry({
          attempt: attempt + 1,
          maxRetries,
          delay,
          error,
        });
      }

      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay));

      // Increase delay for next attempt (exponential backoff)
      delay = Math.min(delay * backoffMultiplier, maxDelay);
    }
  }

  throw lastError;
}

/**
 * Determine if an error is retryable (network-related)
 */
function isRetryableError(error) {
  // Network errors
  if (error instanceof TypeError) {
    return ['Failed to fetch', 'Network request failed', 'timeout'].some(
      msg => error.message.includes(msg)
    );
  }

  // HTTP status codes that are retryable
  if (error.status) {
    // 408: Request Timeout
    // 429: Too Many Requests
    // 500: Internal Server Error
    // 502: Bad Gateway
    // 503: Service Unavailable
    // 504: Gateway Timeout
    return [408, 429, 500, 502, 503, 504].includes(error.status);
  }

  return false;
}

/**
 * Example of how to use retryWithBackoff:
 * 
 * try {
 *   const result = await retryWithBackoff(
 *     () => fetch('/api/expenses', { signal: abortSignal }),
 *     {
 *       maxRetries: 3,
 *       initialDelay: 1000,
 *       maxDelay: 10000,
 *       onRetry: ({ attempt, maxRetries, delay, error }) => {
 *         console.log(`Retry attempt ${attempt}/${maxRetries}. Waiting ${delay}ms...`);
 *       },
 *     }
 *   );
 * } catch (error) {
 *   console.error('Failed after retries:', error);
 * }
 */

export default {
  retryWithBackoff,
  isRetryableError,
};
