import React, { useState } from 'react';

function ExpenseForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
  });

  // Prevent multiple submissions with local state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitAttempts, setSubmitAttempts] = useState(0);

  // Combined disabled state
  const isDisabled = isLoading || isSubmitting;

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent changes while submitting
    if (isSubmitting) return;

    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting || isLoading) {
      console.warn('Form submission already in progress');
      return;
    }

    // Validation
    if (!formData.amount || !formData.category || !formData.description || !formData.date) {
      alert('Please fill in all fields');
      return;
    }

    // Track submission attempts
    setSubmitAttempts(prev => prev + 1);
    setIsSubmitting(true);

    try {
      await onSubmit(formData);

      // Reset form on success
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: '',
      });
      
      setSubmitAttempts(0);
    } catch (error) {
      console.error('Form submission error:', error);
      // Don't reset form on error, let user retry
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Expense</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {/* Amount Field */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isDisabled}
            required
          />
        </div>

        {/* Category Field */}
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
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
        </div>

        {/* Description Field */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter expense details"
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed resize-none"
            disabled={isDisabled}
            required
          />
        </div>

        {/* Date Field */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            disabled={isDisabled}
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isDisabled}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-md disabled:opacity-70 disabled:cursor-not-allowed transition duration-200 flex items-center justify-center space-x-2"
        >
          {isDisabled ? (
            <>
              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Adding...</span>
            </>
          ) : (
            <span>Add Expense</span>
          )}
        </button>

        {/* Submission Info */}
        {submitAttempts > 0 && (
          <p className="text-xs text-gray-500 text-center">
            Submission attempt #{submitAttempts}
          </p>
        )}
      </form>
    </div>
  );
}

export default ExpenseForm;
