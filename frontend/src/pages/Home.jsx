import React, { useState, useEffect } from 'react';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TotalBar from '../components/TotalBar.jsx';
import ErrorAlert from '../components/ErrorAlert.jsx';
import SuccessAlert from '../components/SuccessAlert.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import expenseApi from '../api/expenseApi.js';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('date_desc');

  // Fetch expenses on mount and when filters change
  useEffect(() => {
    fetchExpenses({
      category: selectedCategory || undefined,
      sort: selectedSort,
    });
  }, [selectedCategory, selectedSort]);

  const fetchExpenses = async (options = {}) => {
    setIsFetching(true);
    setError(null);
    try {
      const response = await expenseApi.getExpenses(options);
      
      if (response.status === 'success') {
        setExpenses(response.data.expenses || []);
      } else {
        setError('Failed to fetch expenses');
      }
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError(err.message || 'Failed to load expenses. Please try again.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleAddExpense = async (formData) => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await expenseApi.createExpense({
        amount: Number(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
      });

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
      console.error('Error adding expense:', err);
      setError(err.message || 'Failed to add expense. Please try again.');
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
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-2">Track and manage your personal expenses</p>
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
