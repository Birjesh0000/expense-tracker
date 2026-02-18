/**
 * API Service for Expense Tracker
 * Handles all communication with the backend API
 * Supports retry logic with exponential backoff
 */

import { retryWithBackoff } from '../utils/retryUtils.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Generate a UUID v4 for idempotency
 */
function generateIdempotencyKey() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Create a new expense with retry support
 * @param {Object} expenseData - { amount, category, description, date }
 * @param {AbortSignal} signal - For request cancellation
 * @param {Object} retryOptions - Retry configuration
 * @returns {Promise<Object>} Response from server
 */
export const createExpense = async (expenseData, options = {}) => {
  const { signal, maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffMultiplier = 2, onRetry } = options;
  
  const idempotencyKey = generateIdempotencyKey();

  const makeRequest = async () => {
    try {
      const fetchOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey,
        },
        body: JSON.stringify(expenseData),
      };

      // Only add signal if provided and is a valid AbortSignal
      if (signal instanceof AbortSignal) {
        fetchOptions.signal = signal;
      }

      const response = await fetch(`${API_BASE_URL}/expenses`, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to create expense');
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      throw error;
    }
  };

  // Use retry logic
  return retryWithBackoff(() => makeRequest(), {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    onRetry,
  });
};

/**
 * Get all expenses with optional filtering and sorting, with retry support
 * @param {Object} options - { category, sort }
 * @param {AbortSignal} signal - For request cancellation
 * @param {Object} retryOptions - Retry configuration
 * @returns {Promise<Object>} List of expenses and total
 */
export const getExpenses = async (options = {}) => {
  const { category, sort, signal, maxRetries = 3, initialDelay = 1000, maxDelay = 10000, backoffMultiplier = 2, onRetry } = options;

  const makeRequest = async () => {
    try {
      const params = new URLSearchParams();

      if (category) {
        params.append('category', category);
      }

      if (sort) {
        params.append('sort', sort);
      }

      const queryString = params.toString();
      const url = queryString
        ? `${API_BASE_URL}/expenses?${queryString}`
        : `${API_BASE_URL}/expenses`;

      const fetchOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      };

      // Only add signal if provided and is a valid AbortSignal
      if (signal instanceof AbortSignal) {
        fetchOptions.signal = signal;
      }

      const response = await fetch(url, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        const error = new Error(errorData.message || 'Failed to fetch expenses');
        error.status = response.status;
        throw error;
      }

      return await response.json();
    } catch (error) {
      if (error.name === 'AbortError') {
        throw error;
      }
      throw error;
    }
  };

  // Use retry logic
  return retryWithBackoff(() => makeRequest(), {
    maxRetries,
    initialDelay,
    maxDelay,
    backoffMultiplier,
    onRetry,
  });
};

/**
 * Health check - verify backend is running
 * @returns {Promise<Object>} Health status
 */
export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`);
    return await response.json();
  } catch (error) {
    console.error('Error checking health:', error);
    throw error;
  }
};

export default {
  createExpense,
  getExpenses,
  checkHealth,
  generateIdempotencyKey,
};
