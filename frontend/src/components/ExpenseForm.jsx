import React, { useState } from 'react';
import ValidationError from './ValidationError.jsx';
import { validateField, validateForm } from '../utils/formValidation.js';
import usePersistentFormState from '../hooks/usePersistentFormState.js';

function ExpenseForm({ onSubmit, isLoading }) {
  const initialFormData = {
    amount: '',
    category: '',
    description: '',
    date: '',
  };

  // Use persistent form state to survive page refreshes
  const { formData, updateFormData, clearFormData } = usePersistentFormState(
    'expenseFormData',
    initialFormData
  );

  // Form validation state
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Prevent multiple submissions with local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // Combined disabled state
  const isDisabled = isLoading || isSubmitting;

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Prevent changes while submitting
    if (isSubmitting) return;

    // Update form data (automatically persists to localStorage)
    updateFormData({
      [name]: value,
    });

    // Validate field on change if it was touched
    if (touchedFields[name]) {
      const error = validateField(name, value);
      setFieldErrors(prev => ({
        ...prev,
        [name]: error,
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Mark field as touched
    setTouchedFields(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate field
    const error = validateField(name, value);
    setFieldErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent double submission
    if (isSubmitting || isLoading) {
      console.warn('Form submission already in progress');
      return;
    }

    // Mark all fields as touched
    setTouchedFields({
      amount: true,
      category: true,
      description: true,
      date: true,
    });

    // Validate entire form
    const validation = validateForm(formData);

    if (!validation.isValid) {
      setFieldErrors(validation.errors);
      return;
    }

    // Track submission attempts
    setSubmitAttempts(prev => prev + 1);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);

      // Clear form on success (also clears from localStorage)
      clearFormData();
      setFieldErrors({});
      setTouchedFields({});
      setSubmitAttempts(0);
    } catch (error) {
      console.error('Form submission error:', error);
      // Don't reset form on error, let user retry (form data is preserved in localStorage)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 border border-slate-200">
      <h2 className="text-2xl font-bold text-slate-900 mb-8">Add New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition ${
              touchedFields.amount && fieldErrors.amount
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            disabled={isDisabled}
            required
          />
          {touchedFields.amount && (
            <ValidationError message={fieldErrors.amount} />
          )}
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition ${
              touchedFields.category && fieldErrors.category
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            disabled={isDisabled}
            required
          >
            <option value="">Select a category</option>
            <option value="Food">Food</option>
            <option value="Transport">Transport</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Shopping">Shopping</option>
            <option value="Utilities">Utilities</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Other">Other</option>
          </select>
          {touchedFields.category && (
            <ValidationError message={fieldErrors.category} />
          )}
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Enter expense details"
            rows="3"
            className={`w-full px-3 py-2 border rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed resize-none transition ${
              touchedFields.description && fieldErrors.description
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            disabled={isDisabled}
            required
          />
          {touchedFields.description && (
            <ValidationError message={fieldErrors.description} />
          )}
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-slate-700 mb-2">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:bg-slate-100 disabled:cursor-not-allowed transition ${
              touchedFields.date && fieldErrors.date
                ? 'border-red-500'
                : 'border-slate-300'
            }`}
            disabled={isDisabled}
            required
          />
          {touchedFields.date && (
            <ValidationError message={fieldErrors.date} />
          )}
        </div>

        {/* Submit Button - Disabled if form is invalid or loading */}
        <button
          type="submit"
          disabled={isDisabled || Object.values(fieldErrors).some(e => e)}
          className="w-full bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 disabled:bg-slate-400 text-white font-medium py-2 px-4 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2 mt-8"
        >
          {isDisabled ? (
            <>
              <svg
                className="animate-spin h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <span>Add Expense</span>
          )}
        </button>

        {/* Submission Info */}
        {submitAttempts > 0 && (
          <p className="text-xs text-slate-500 text-center">
            Submission attempt #{submitAttempts}
          </p>
        )}
      </form>
    </div>
  );
}

export default ExpenseForm;
