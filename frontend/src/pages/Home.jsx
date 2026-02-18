import React, { useState } from 'react';
import ExpenseForm from '../components/ExpenseForm.jsx';
import ExpenseTable from '../components/ExpenseTable.jsx';
import FilterBar from '../components/FilterBar.jsx';
import TotalBar from '../components/TotalBar.jsx';

function Home() {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSort, setSelectedSort] = useState('date_desc');

  // Mock data for demonstration (will be replaced with API calls in next phase)
  React.useEffect(() => {
    // This will be replaced with API call to GET /expenses
    console.log('Home component mounted');
  }, []);

  const handleAddExpense = (formData) => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const newExpense = {
        _id: Date.now().toString(),
        ...formData,
        createdAt: new Date().toISOString(),
      };
      
      setExpenses(prev => [newExpense, ...prev]);
      setIsLoading(false);
      
      console.log('Expense added:', newExpense);
    }, 500);
  };

  const handleFilterChange = (category) => {
    setSelectedCategory(category);
    // Will implement actual filtering in next phase
  };

  const handleSortChange = (sort) => {
    setSelectedSort(sort);
    // Will implement actual sorting in next phase
  };

  // Calculate total from expenses
  const total = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-600 mt-2">Track and manage your personal expenses</p>
        </div>

        {/* Layout: Form on left, List on right */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Form */}
          <div className="lg:col-span-1">
            <ExpenseForm onSubmit={handleAddExpense} isLoading={isLoading} />
          </div>

          {/* Right Column: List, Total, Filter */}
          <div className="lg:col-span-2 space-y-6">
            {/* Total Bar */}
            {expenses.length > 0 && (
              <TotalBar total={total} count={expenses.length} />
            )}

            {/* Filter Bar */}
            <FilterBar 
              onFilterChange={handleFilterChange}
              onSortChange={handleSortChange}
              selectedCategory={selectedCategory}
              selectedSort={selectedSort}
            />

            {/* Expenses Table */}
            <ExpenseTable expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
