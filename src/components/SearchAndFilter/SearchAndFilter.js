import React, { useState } from 'react';
import PropTypes from 'prop-types';

const SearchAndFilter = ({
  search,
  setSearch,
  filters,
  selectedFilters,
  toggleFilter,
  removeFilter,
  clearFilters,
}) => {
  const [collapsed, setCollapsed] = useState({
    dietaryRestrictions: true,
    cuisines: true,
    mealTypes: true,
  });

  const toggleCollapse = (category) => {
    setCollapsed((prevCollapsed) => ({
      ...prevCollapsed,
      [category]: !prevCollapsed[category],
    }));
  };

  const handleSearchClear = () => {
    setSearch('');
  };

  return (
    <div className="w-full lg:w-1/4 p-4 lg:max-h-[56vh] lg:overflow-y-auto">
      <input
        type="text"
        placeholder="Search recipes..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded-md mb-4"
      />
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Active Filters</h3>
        <button
          className="text-blue-500 text-sm"
          onClick={() => {
            clearFilters();
            handleSearchClear();
          }}
        >
          Clear
        </button>
      </div>
      {search && (
        <span
          className="inline-block bg-blue-400 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
          onClick={handleSearchClear}
        >
          {search} <i className="ml-1 fa fa-times"></i>
        </span>
      )}
      {Object.keys(selectedFilters).some(
        (category) => selectedFilters[category].length > 0
      ) ? (
        Object.keys(selectedFilters).map((category) =>
          selectedFilters[category].map((filter) => (
            <span
              key={filter}
              className="inline-block bg-blue-500 text-white rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 cursor-pointer"
              onClick={() => removeFilter(category, filter)}
            >
              {filter} <i className="ml-1 fa fa-times"></i>
            </span>
          ))
        )
      ) : (
        <p className="mb-4">None</p>
      )}
      {filters.map((filter) => (
        <div key={filter.title} className="mb-4">
          <h3
            className={`font-bold cursor-pointer p-2 ${
              collapsed[filter.category]
                ? 'bg-gray-200 rounded'
                : 'rounded-t bg-purple-100'
            } flex justify-between items-center`}
            onClick={() => toggleCollapse(filter.category)}
          >
            {filter.title}
            <i
              className={`fa ${
                collapsed[filter.category]
                  ? 'fa-chevron-right'
                  : 'fa-chevron-down'
              }`}
            ></i>
          </h3>
          {!collapsed[filter.category] && (
            <ul className="pl-4 bg-purple-100 rounded-b pb-2">
              {filter.items.map((item) => (
                <li key={item}>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedFilters[filter.category].includes(item)}
                      onChange={() => toggleFilter(filter.category, item)}
                      className="mr-2 cursor-pointer"
                    />
                    {item}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

SearchAndFilter.propTypes = {
  search: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  filters: PropTypes.array.isRequired,
  selectedFilters: PropTypes.object.isRequired,
  toggleFilter: PropTypes.func.isRequired,
  removeFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
};

export default SearchAndFilter;
