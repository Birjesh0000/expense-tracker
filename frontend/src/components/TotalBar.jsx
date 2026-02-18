import React from 'react';
import { formatCurrency } from '../utils/currencyUtils.js';

function TotalBar({ total, count }) {
  return (
    <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 shadow-2xl rounded-xl p-8 text-white border border-indigo-400 hover:shadow-indigo-300/50 transition-shadow">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-indigo-100 text-xs font-semibold uppercase tracking-widest">Total Expenses</p>
          <p className="text-5xl font-black text-white mt-2">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-indigo-100 text-xs font-semibold uppercase tracking-widest">Total Entries</p>
          <p className="text-5xl font-black text-white mt-2">{count}</p>
        </div>
      </div>
    </div>
  );
}

export default TotalBar;
