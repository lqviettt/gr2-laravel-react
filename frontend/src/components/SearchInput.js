import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';

const SearchInput = ({
  searchFields = [], // Array of search field configurations
  onSearch,
  placeholder = "Tìm kiếm...",
  className = '',
  debounceDelay = 300,
  showClearButton = true,
  size = 'medium', // small, medium, large
  useSearchButton = false // New prop: if true, show search button instead of auto-search
}) => {
  // State for search values
  const [searchValues, setSearchValues] = useState(() => {
    const initial = {};
    searchFields.forEach(field => {
      initial[field.key] = '';
    });
    return initial;
  });

  // Size classes
  const sizeClasses = {
    small: {
      container: 'px-3 py-2 text-sm',
      input: 'px-3 py-2 text-sm',
      button: 'p-2',
      icon: 'h-3 w-3'
    },
    medium: {
      container: 'px-4 py-3 text-base',
      input: 'px-4 py-3 text-base',
      button: 'p-3',
      icon: 'h-4 w-4'
    },
    large: {
      container: 'px-5 py-4 text-lg',
      input: 'px-5 py-4 text-lg',
      button: 'p-4',
      icon: 'h-5 w-5'
    }
  };

  const currentSize = sizeClasses[size] || sizeClasses.medium;

  // Memoize active search filters
  const activeSearchFilters = useMemo(() => {
    const result = {};
    searchFields.forEach(field => {
      const value = searchValues[field.key];
      if (value && value.trim()) {
        switch (field.type) {
          case 'text':
            result[field.key] = value.trim();
            break;
          case 'number':
            const numValue = Number.parseFloat(value);
            if (!Number.isNaN(numValue)) {
              result[field.key] = numValue;
            }
            break;
          case 'select':
            result[field.key] = value;
            break;
          default:
            result[field.key] = value.trim();
        }
      }
    });
    return result;
  }, [searchValues, searchFields]);

  // Debounced search effect (only if not using search button)
  useEffect(() => {
    if (useSearchButton) return; // Skip debounced search if using search button

    const timeoutId = setTimeout(() => {
      if (onSearch) {
        onSearch(activeSearchFilters);
      }
    }, debounceDelay);

    return () => clearTimeout(timeoutId);
  }, [activeSearchFilters, onSearch, debounceDelay, useSearchButton]);

  // Handle search button click
  const handleSearchClick = useCallback(() => {
    if (onSearch) {
      onSearch(activeSearchFilters);
    }
  }, [activeSearchFilters, onSearch]);

  // Handle input change
  const handleInputChange = useCallback((fieldKey, value) => {
    setSearchValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  // Clear all search inputs
  const handleClear = useCallback(() => {
    const cleared = {};
    searchFields.forEach(field => {
      cleared[field.key] = '';
    });
    setSearchValues(cleared);
  }, [searchFields]);

  // Check if there are active searches
  const hasActiveSearch = useMemo(() =>
    Object.values(searchValues).some(value =>
      value !== '' && value !== null && value !== undefined
    ), [searchValues]);

  // Render single search input
  const renderSearchInput = (field) => {
    const value = searchValues[field.key];

    switch (field.type) {
      case 'select':
        return (
          <select
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`${currentSize.input} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white w-full text-sm sm:text-base`}
          >
            <option value="">
              {field.placeholder || `Chọn ${field.label.toLowerCase()}`}
            </option>
            {(field.options || []).map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            placeholder={field.placeholder || `Nhập ${field.label.toLowerCase()}`}
            min={field.min || 0}
            max={field.max}
            step={field.step || 1}
            className={`${currentSize.input} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base`}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value}
            onChange={(e) => handleInputChange(field.key, e.target.value)}
            className={`${currentSize.input} border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base`}
          />
        );

      case 'text':
      default:
        return (
          <div className="relative w-full">
            <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 ${currentSize.icon}`} />
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(field.key, e.target.value)}
              placeholder={field.placeholder || placeholder}
              className={`${currentSize.input} pl-10 pr-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full text-sm sm:text-base`}
            />
          </div>
        );
    }
  };

  // If only one search field, render simple search input
  if (searchFields.length === 1) {
    const field = searchFields[0];
    return (
      <div className={`flex items-center bg-white border border-gray-300 rounded-md ${className}`}>
        {renderSearchInput(field)}
        {showClearButton && hasActiveSearch && (
          <button
            onClick={handleClear}
            className={`${currentSize.button} text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-r-md`}
            title="Xóa tìm kiếm"
          >
            <FaTimes className={currentSize.icon} />
          </button>
        )}
      </div>
    );
  }

  // If multiple search fields, render in a row
  return (
    <div className={`bg-white border border-gray-300 rounded-md ${className}`}>
      {/* Mobile: Stack fields vertically, Desktop: Horizontal layout */}
      <div className={`${currentSize.container} grid grid-cols-1 sm:grid-cols-2 lg:flex lg:items-center gap-3 lg:gap-4`}>
        {searchFields.map(field => (
          <div key={field.key} className="lg:flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {field.label}
            </label>
            {renderSearchInput(field)}
          </div>
        ))}

        {/* Action buttons - responsive layout */}
        <div className="flex items-end gap-2 sm:col-span-2 lg:col-span-1 lg:justify-end">
          {useSearchButton && (
            <button
              onClick={handleSearchClick}
              className={`${currentSize.button} bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-3 py-2 mt-5 sm:px-4 text-sm font-medium w-full sm:w-auto`}
              title="Tìm kiếm"
            >
              <FaSearch className="h-4 w-4 mr-2 inline" />
              <span className="hidden sm:inline">Tìm kiếm</span>
              <span className="sm:hidden">Tìm</span>
            </button>
          )}

          {showClearButton && hasActiveSearch && (
            <button
              onClick={handleClear}
              className={`${currentSize.button} text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md border border-gray-300`}
              title="Xóa tất cả tìm kiếm"
            >
              <FaTimes className={currentSize.icon} />
            </button>
          )}
        </div>
      </div>

      {/* Active search summary - responsive */}
      {hasActiveSearch && (
        <div className="px-3 sm:px-4 py-2 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-wrap gap-1 sm:gap-2 items-center text-xs sm:text-sm text-gray-600">
            <span className="font-medium">Đang tìm:</span>
            {searchFields.map(field => {
              const value = searchValues[field.key];
              if (!value || !value.trim()) return null;

              let displayValue = value;
              if (field.type === 'select' && field.options) {
                const option = field.options.find(opt => opt.value === value);
                displayValue = option ? option.label : value;
              }

              return (
                <span key={field.key} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  <span className="hidden sm:inline">{field.label}: </span>
                  {displayValue}
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchInput;