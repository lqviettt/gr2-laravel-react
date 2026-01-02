/**
 * Custom Hook: useDebounce
 * Delays value updates by specified ms
 * 
 * Usage:
 * const debouncedSearchQuery = useDebounce(searchQuery, 500);
 * 
 * useEffect(() => {
 *   if (debouncedSearchQuery) {
 *     fetchSearch(debouncedSearchQuery);
 *   }
 * }, [debouncedSearchQuery]);
 */

import { useState, useEffect } from 'react';

export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Set up the timeout
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Clean up the timeout if value changes before delay finishes
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
