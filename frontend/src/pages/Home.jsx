import React, { useState, useEffect, useRef } from 'react';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TotalBar from '../components/TotalBar.jsx';
import CategorySummary from '../components/CategorySummary.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import SuccessAlert from '../components/SuccessAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import expenseApi from '../api/expenseApi.js';

// Retry configuration
const RETRY_CONFIG = {
  maxRetries: 3,
  initialDelay: 1000,
  maxDelay: 10000,
  backoffMultiplier: 2,
};

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('date_desc');
  const [retryAttempt, setRetryAttempt] = useState(0);

  // Reference for abort controllers
  const fetchAbortControllerRef = useRef(null);
  const addAbortControllerRef = useRef(null);

  // Fetch expenses on mount and when filters change
  useEffect(() => {
    fetchExpenses({
      category: selectedCategory || undefined,
      sort: selectedSort,
    });
  }, [selectedCategory, selectedSort]);

  const fetchExpenses = async (options = {}) => {
    // Cancel previous fetch if still in progress
    if (fetchAbortControllerRef.current) {
      fetchAbortControllerRef.current.abort();
    }

    fetchAbortControllerRef.current = new AbortController();

    setIsFetching(true);
    setError(null);
    setRetryAttempt(0);

    try {
      const response = await expenseApi.getExpenses({
        category: options.category || selectedCategory,
        sort: options.sort || selectedSort,
        signal: fetchAbortControllerRef.current.signal,
        ...RETRY_CONFIG,
        onRetry: ({ attempt, maxRetries }) => {
          setRetryAttempt(attempt);
          console.log(`Retrying fetch: attempt ${attempt}/${maxRetries}`);
        },
      });

      if (response.status === 'success') {
        setExpenses(response.data.expenses || []);
      } else {
        setError('Failed to fetch expenses');
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (err.name === 'AbortError') {
        console.log('Fetch cancelled');
        return;
      }

      console.error('Error fetching expenses:', err);

      // Build error message with retry info
      let errorMessage = err.message || 'Failed to load expenses. Please try again.';
      if (retryAttempt > 0) {
        errorMessage += ` (Attempted retries: ${retryAttempt}/${RETRY_CONFIG.maxRetries})`;
      }

      setError(errorMessage);
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddExpense = async (formData) => {
    // Cancel previous add if still in progress
    if (addAbortControllerRef.current) {
      addAbortControllerRef.current.abort();
    }

    addAbortControllerRef.current = new AbortController();

    setIsLoading(true);
    setError(null);
    setSuccess(null);
    setRetryAttempt(0);

    try {
      const response = await expenseApi.createExpense(
        {
          amount: Number(formData.amount),
          category: formData.category,
          description: formData.description,
          date: formData.date,
        },
        {
          signal: addAbortControllerRef.current.signal,
          ...RETRY_CONFIG,
          onRetry: ({ attempt, maxRetries }) => {
            setRetryAttempt(attempt);
            console.log(`Retrying add: attempt ${attempt}/${maxRetries}`);
          },
        }
      );

      if (response.status === 'success') {
        setSuccess('Expense added successfully!');
        // Refresh the expenses list
        await fetchExpenses({
          category: selectedCategory || undefined,
          sort: selectedSort,
        });
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError('Failed to create expense');
      }
    } catch (err) {
      // Don't show error if request was aborted
      if (err.name === 'AbortError') {
        console.log('Add cancelled');
        return;
      }

      console.error('Error adding expense:', err);

      // Build error message with retry info
      let errorMessage = err.message || 'Failed to add expense. Please try again.';
      if (retryAttempt > 0) {
        errorMessage += ` (Attempted retries: ${retryAttempt}/${RETRY_CONFIG.maxRetries})`;
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    // Filtering is handled by useEffect dependency
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    // Sorting is handled by useEffect dependency
  };

  // Calculate total from current expenses
  const total = expenses.reduce((sum, expense) => {
    const amount = typeof expense.amount === 'object' ? expense.amount.$numberDecimal : expense.amount;
    return sum + Number(amount);
  }, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-slate-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with gradient background */}
        <div className="mb-8 pb-6 border-b-2 border-indigo-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">₹</span>
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Expense Tracker</h1>
          </div>
          <p className="text-slate-600 mt-2">Track and manage your personal expenses with ease</p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="mb-6">
            <SuccessAlert 
              message={success} 
              onDismiss={() => setSuccess(null)}
            />
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6">
            <ErrorAlert 
              message={error} 
              onDismiss={() => setError(null)}
            />
          </div>
        )}

        {/* Layout: Form on left, List on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleAddExpense} isLoading={isLoading} />
          </div>

          {/* Right Column: List, Total, Filter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Bar */}
            {expenses.length > 0 && !isFetching && (
              <TotalBar total={total} count={expenses.length} />
            )}

            {/* Filter Bar */}
            <FilterBar 
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
            />

            {/* Category Summary */}
            {expenses.length > 0 && !isFetching && !selectedCategory && (
              <CategorySummary expenses={expenses} />
            )}

            {/* Loading State */}
            {isFetching && (
              <div className="bg-white shadow rounded-lg">
                <LoadingSpinner message="Loading expenses..." />
              </div>
            )}

            {/* Expenses Table */}
            {!isFetching && <ExpenseTable expenses={expenses} />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
