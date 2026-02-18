import React from 'react';
import { formatCurrency } from '../utils/currencyUtils.js';

function TotalBar({ total, count }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-lg rounded-lg p-6 text-white border border-indigo-400">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-indigo-100 text-sm uppercase tracking-wide">Total Expenses</p>
          <p className="text-4xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-100 text-sm uppercase tracking-wide">Total Entries</p>
          <p className="text-4xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
}

export default TotalBar;
