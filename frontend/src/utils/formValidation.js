/**
 * Form validation rules and utilities
 */

export const validationRules = {
  amount: {
    required: 'Amount is required',
    minValue: 'Amount must be greater than 0',
    maxValue: 'Amount cannot exceed 999,999,999.99',
  },
  category: {
    required: 'Category is required',
    minLength: 'Category must be at least 1 character',
    maxLength: 'Category must be 100 characters or less',
  },
  description: {
    required: 'Description is required',
    minLength: 'Description must be at least 1 character',
    maxLength: 'Description must be 500 characters or less',
  },
  date: {
    required: 'Date is required',
    invalidDate: 'Please enter a valid date',
    futureDate: 'Date cannot be in the future',
  },
};

/**
 * Validate individual form fields
 */
export const validateField = (name, value) => {
  switch (name) {
    case 'amount': {
      if (!value || value === '') {
        return validationRules.amount.required;
      }
      const amount = Number(value);
      if (isNaN(amount)) {
        return 'Amount must be a valid number';
      }
      if (amount <= 0) {
        return validationRules.amount.minValue;
      }
      if (amount > 999999999.99) {
        return validationRules.amount.maxValue;
      }
      return '';
    }

    case 'category': {
      if (!value || !value.trim()) {
        return validationRules.category.required;
      }
      if (value.trim().length > 100) {
        return validationRules.category.maxLength;
      }
      return '';
    }

    case 'description': {
      if (!value || !value.trim()) {
        return validationRules.description.required;
      }
      if (value.trim().length > 500) {
        return validationRules.description.maxLength;
      }
      return '';
    }

    case 'date': {
      if (!value) {
        return validationRules.date.required;
      }
      const dateObj = new Date(value);
      if (isNaN(dateObj.getTime())) {
        return validationRules.date.invalidDate;
      }
      if (dateObj > new Date()) {
        return validationRules.date.futureDate;
      }
      return '';
    }

    default:
      return '';
  }
};

/**
 * Validate entire form
 */
export const validateForm = (formData) => {
  const errors = {};

  Object.keys(formData).forEach(field => {
    const error = validateField(field, formData[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
