import React from 'react';

function FilterBar({ onFilterChange, onSortChange, selectedCategory, selectedSort }) {
  const categories = [
    'All',
    'Food',
    'Transport',
    'Entertainment',
    'Shopping',
    'Utilities',
    'Health',
    'Education',
    'Other',
  ];

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-200 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-6 w-6 rounded bg-gradient-to-br from-indigo-600 to-blue-600 flex items-center justify-center text-white text-xs">⚙</div>
        <h3 className="text-lg font-semibold text-slate-900">Filter & Sort</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-semibold text-slate-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-gradient-to-br from-indigo-50 to-white"
          >
            {categories.map((category) => (
              <option key={category} value={category === 'All' ? '' : category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Options */}
        <div>
          <label htmlFor="sort-option" className="block text-sm font-semibold text-slate-700 mb-2">
            Sort By
          </label>
          <select
            id="sort-option"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-4 py-2 border-2 border-indigo-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition bg-gradient-to-br from-indigo-50 to-white"
          >
            <option value="date_desc">Newest First</option>
            <option value="date_asc">Oldest First</option>
            <option value="created_desc">Recently Added</option>
          </select>
        </div>
      </div>
    </div>
  );
}

export default FilterBar;
