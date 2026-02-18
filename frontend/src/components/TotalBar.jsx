import React from 'react';

function TotalBar({ total, count }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-700 shadow rounded-lg p-6 text-white">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-blue-100 text-sm uppercase tracking-wide">Total Expenses</p>
          <p className="text-4xl font-bold">{formatCurrency(total)}</p>
        </div>
        <div className="text-right">
          <p className="text-blue-100 text-sm uppercase tracking-wide">Total Entries</p>
          <p className="text-4xl font-bold">{count}</p>
        </div>
      </div>
    </div>
  );
}

export default TotalBar;
