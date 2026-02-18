/**
 * Validation utilities for expense data
 */

export const validateExpenseData = (data) => {
  const errors = [];

  // Validate amount
  if (data.amount === undefined || data.amount === null || data.amount === '') {
    errors.push('Amount is required');
  } else {
    const amount = Number(data.amount);
    if (isNaN(amount)) {
      errors.push('Amount must be a valid number');
    } else if (amount <= 0) {
      errors.push('Amount must be greater than 0');
    } else if (amount > 999999999.99) {
      errors.push('Amount exceeds maximum allowed value');
    }
  }

  // Validate category
  if (!data.category || typeof data.category !== 'string') {
    errors.push('Category is required and must be a string');
  } else if (data.category.trim().length === 0) {
    errors.push('Category cannot be empty');
  } else if (data.category.trim().length > 100) {
    errors.push('Category must be 100 characters or less');
  }

  // Validate description
  if (!data.description || typeof data.description !== 'string') {
    errors.push('Description is required and must be a string');
  } else if (data.description.trim().length === 0) {
    errors.push('Description cannot be empty');
  } else if (data.description.trim().length > 500) {
    errors.push('Description must be 500 characters or less');
  }

  // Validate date
  if (!data.date) {
    errors.push('Date is required');
  } else {
    const dateObj = new Date(data.date);
    if (isNaN(dateObj.getTime())) {
      errors.push('Date must be a valid date');
    } else if (dateObj > new Date()) {
      errors.push('Date cannot be in the future');
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize expense data to prevent injection attacks
 */
export const sanitizeExpenseData = (data) => {
  return {
    amount: Number(data.amount),
    category: String(data.category).trim(),
    description: String(data.description).trim(),
    date: new Date(data.date),
  };
};
