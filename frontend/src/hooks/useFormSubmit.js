import { useState, useCallback, useRef } from 'react';

/**
 * Custom hook to prevent multiple form submissions
 * Handles debouncing, submission state, and idempotency
 */
function useFormSubmit(onSubmit, debounceMs = 300) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Track the last submission to prevent rapid successive calls
  const lastSubmitTimeRef = useRef(0);
  const submissionAbortControllerRef = useRef(null);

  const handleSubmit = useCallback(async (formData) => {
    // Check if already submitting
    if (isSubmitting) {
      console.warn('Form submission already in progress');
      return;
    }

    // Check for rapid successive submissions (debounce)
    const now = Date.now();
    if (now - lastSubmitTimeRef.current < debounceMs) {
      console.warn(`Please wait ${debounceMs}ms between submissions`);
      return;
    }

    // Cancel any previous submission
    if (submissionAbortControllerRef.current) {
      submissionAbortControllerRef.current.abort();
    }

    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    lastSubmitTimeRef.current = now;

    try {
      // Create new abort controller for this submission
      submissionAbortControllerRef.current = new AbortController();

      const result = await onSubmit(formData, submissionAbortControllerRef.current.signal);
      
      setSuccess(result?.message || 'Submission successful');
      
      return result;
    } catch (err) {
      if (err.name === 'AbortError') {
        console.log('Submission was cancelled');
        return;
      }
      
      setError(err.message || 'Submission failed');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSubmitting, debounceMs, onSubmit]);

  const reset = useCallback(() => {
    setError(null);
    setSuccess(null);
    setIsSubmitting(false);
  }, []);

  const cancel = useCallback(() => {
    if (submissionAbortControllerRef.current) {
      submissionAbortControllerRef.current.abort();
    }
    setIsSubmitting(false);
  }, []);

  return {
    isSubmitting,
    error,
    success,
    handleSubmit,
    reset,
    cancel,
  };
}

export default useFormSubmit;
