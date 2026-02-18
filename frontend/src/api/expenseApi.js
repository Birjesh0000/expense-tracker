/**
 * API Service for Expense Tracker
 * Handles all communication with the backend API
 */

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
 * Create a new expense
 * @param {Object} expenseData - { amount, category, description, date }
 * @param {AbortSignal} signal - For request cancellation
 * @returns {Promise<Object>} Response from server
 */
export const createExpense = async (expenseData, signal) => {
  try {
    const idempotencyKey = generateIdempotencyKey();
    
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': idempotencyKey,
      },
      body: JSON.stringify(expenseData),
      signal, // Allow request cancellation
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create expense');
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      throw error;
    }
    console.error('Error creating expense:', error);
    throw error;
  }
};

/**
 * Get all expenses with optional filtering and sorting
 * @param {Object} options - { category, sort }
 * @param {AbortSignal} signal - For request cancellation
 * @returns {Promise<Object>} List of expenses and total
 */
export const getExpenses = async (options = {}, signal) => {
  try {
    const params = new URLSearchParams();
    
    if (options.category) {
      params.append('category', options.category);
    }
    
    if (options.sort) {
      params.append('sort', options.sort);
    }

    const queryString = params.toString();
    const url = queryString ? `${API_BASE_URL}/expenses?${queryString}` : `${API_BASE_URL}/expenses`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      signal, // Allow request cancellation
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to fetch expenses');
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Request was cancelled');
      throw error;
    }
    console.error('Error fetching expenses:', error);
    throw error;
  }
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
