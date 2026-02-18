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
    <div className="bg-white shadow-lg rounded-lg p-6 border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Filter & Sort</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Category Filter */}
        <div>
          <label htmlFor="category-filter" className="block text-sm font-medium text-slate-700 mb-2">
            Category
          </label>
          <select
            id="category-filter"
            value={selectedCategory}
            onChange={(e) => onFilterChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
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
          <label htmlFor="sort-option" className="block text-sm font-medium text-slate-700 mb-2">
            Sort By
          </label>
          <select
            id="sort-option"
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 transition"
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
