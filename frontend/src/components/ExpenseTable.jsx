import React from 'react';
import { formatCurrency } from '../utils/currencyUtils.js';

function ExpenseTable({ expenses }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!expenses || expenses.length === 0) {
    return (
      <div className="bg-white shadow-lg rounded-xl p-8 border border-indigo-200">
        <div className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold">📋</div>
          <h2 className="text-2xl font-bold text-slate-900">Expenses</h2>
        </div>
        <div className="text-center py-16">
          <svg
            className="mx-auto h-16 w-16 text-indigo-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="text-lg font-medium text-slate-900 mb-2">No expenses yet</h3>
          <p className="text-slate-500">Get started by adding your first expense using the form.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-indigo-200">
      <div className="px-6 py-4 border-b border-indigo-200 bg-gradient-to-r from-indigo-50 to-blue-50">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white font-bold text-sm">📋</div>
          <h2 className="text-2xl font-bold text-slate-900">Expenses</h2>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-indigo-50 to-blue-50 border-b border-indigo-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-indigo-900 uppercase tracking-wider">
                Amount
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-indigo-100">
            {expenses.map((expense) => (
              <tr key={expense._id} className="hover:bg-indigo-50 transition">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-900">
                  {formatDate(expense.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-200 text-indigo-800">
                    {expense.category}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-900">
                  {expense.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-right text-slate-900">
                  {formatCurrency(typeof expense.amount === 'object' ? Number(expense.amount.$numberDecimal) : Number(expense.amount))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;
