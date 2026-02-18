import React from 'react';
import { formatCurrency } from '../utils/currencyUtils.js';

function CategorySummary({ expenses }) {
  // Group expenses by category and calculate totals
  const categoryTotals = expenses.reduce((acc, expense) => {
    const category = expense.category;
    const amount = typeof expense.amount === 'object' 
      ? parseFloat(expense.amount.$numberDecimal) 
      : parseFloat(expense.amount);
    
    if (!acc[category]) {
      acc[category] = {
        total: 0,
        count: 0,
      };
    }
    
    acc[category].total += amount;
    acc[category].count += 1;
    
    return acc;
  }, {});

  // Convert to sorted array (by total descending)
  const sortedCategories = Object.entries(categoryTotals)
    .map(([category, data]) => ({
      category,
      total: data.total,
      count: data.count,
    }))
    .sort((a, b) => b.total - a.total);

  if (!expenses || expenses.length === 0) {
    return null;
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">📊</div>
        <h3 className="text-lg font-bold text-slate-900">Spending by Category</h3>
      </div>
      
      <div className="space-y-3">
        {sortedCategories.map((item) => {
          // Calculate percentage of total
          const grandTotal = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);
          const percentage = ((item.total / grandTotal) * 100).toFixed(1);
          
          return (
            <div key={item.category}>
              {/* Category Header */}
              <div className="flex justify-between items-center mb-2 p-3 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.category}</p>
                  <p className="text-xs text-indigo-600">{item.count} {item.count === 1 ? 'entry' : 'entries'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-indigo-700">{formatCurrency(item.total)}</p>
                  <p className="text-xs text-indigo-600">{percentage}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-indigo-100 rounded-full h-2.5 mb-3">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default CategorySummary;
