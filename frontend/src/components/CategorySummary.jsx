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
    <div className="bg-white shadow-lg rounded-lg p-6 border border-slate-200">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Spending by Category</h3>
      
      <div className="space-y-3">
        {sortedCategories.map((item) => {
          // Calculate percentage of total
          const grandTotal = sortedCategories.reduce((sum, cat) => sum + cat.total, 0);
          const percentage = ((item.total / grandTotal) * 100).toFixed(1);
          
          return (
            <div key={item.category}>
              {/* Category Header */}
              <div className="flex justify-between items-center mb-1">
                <div>
                  <p className="text-sm font-medium text-slate-900">{item.category}</p>
                  <p className="text-xs text-slate-500">{item.count} {item.count === 1 ? 'entry' : 'entries'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-slate-900">{formatCurrency(item.total)}</p>
                  <p className="text-xs text-slate-500">{percentage}%</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
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
