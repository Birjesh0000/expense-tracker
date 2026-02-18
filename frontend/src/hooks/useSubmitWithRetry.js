import { useState, useCallback, useRef } from 'react';
import { retryWithBackoff } from '../utils/retryUtils.js';

/**
 * Custom hook for handling form submission with retry capability
 * Manages submission state, errors, and retry attempts
 */
function useSubmitWithRetry() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [maxRetries, setMaxRetries] = useState(3);
  
  const abortControllerRef = useRef(null);
  const lastSubmitTimeRef = useRef(0);
  const debounceMs = 300;

  const submit = useCallback(async (submitFn, options = {}) => {
    const {
      retryEnabled = true,
      maxRetries: customMaxRetries = 3,
      onRetryAttempt = null,
      debounce = true,
    } = options;

    // Debounce check
    if (debounce) {
      const now = Date.now();
      if (now - lastSubmitTimeRef.current < debounceMs) {
        console.warn(`Please wait ${debounceMs}ms before retrying`);
        return;
      }
      lastSubmitTimeRef.current = now;
    }

    // Prevent concurrent submissions
    if (isSubmitting) {
      console.warn('Submission already in progress');
      return;
    }

    // Cancel any previous submission
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    setRetryCount(0);
    setMaxRetries(customMaxRetries);

    try {
      // Create abort controller for this submission
      abortControllerRef.current = new AbortController();

      const result = retryEnabled
        ? await retryWithBackoff(
            () => submitFn(abortControllerRef.current.signal),
            {
              maxRetries: customMaxRetries,
              initialDelay: 1000,
              maxDelay: 10000,
              backoffMultiplier: 2,
              onRetry: ({ attempt, maxRetries: max, delay, error: err }) => {
                setRetryCount(attempt);
                console.warn(
                  `Retry attempt ${attempt}/${max} after ${err?.message || 'error'}. Waiting ${delay}ms...`
                );
                if (onRetryAttempt) {
                  onRetryAttempt({ attempt, maxRetries: max, delay, error: err });
                }
              },
            }
          )
        : await submitFn(abortControllerRef.current.signal);

      setSuccess(result?.message || 'Submission successful');
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Submission cancelled');
        return;
      }

      setError(err.message || 'Submission failed. Please try again.');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting]);

  const cancel = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsSubmitting(false);
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
    setRetryCount(0);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    retryCount,
    maxRetries,
    submit,
    cancel,
    reset,
  };
}

export default useSubmitWithRetry;
