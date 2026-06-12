import { useState, useEffect, useCallback } from 'react';
import { api } from '../utils/apiClient';
import { toast } from 'react-toastify';

/**
 * Custom Hook: useFetchData
 * Handles data fetching with caching bypass capability
 * 
 * Usage:
 * const { data, loading, error, refetch } = useFetchData('/endpoint', filters, currentPage);
 * 
 * @param {string} endpoint - API endpoint (e.g., '/category', '/product', '/order')
 * @param {object} filters - Search/filter parameters
 * @param {number} currentPage - Current page number
 * @param {object} options - Additional options (e.g., transformData, errorMessage)
 */
export const useFetchData = (
  endpoint,
  filters = {},
  currentPage = 1,
  options = {}
) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});

  const {
    transformData = null,
    errorMessage = 'Không thể tải dữ liệu',
    showErrorToast = true,
    useSkipCache = false // Use skipCache when refetching
  } = options;

  // Main fetch function
  const fetchData = useCallback(async (filtersParam = filters, pageParam = currentPage, skipCache = false) => {
    try {
      setLoading(true);
      setError(null);

      const queryParams = new URLSearchParams();
      const effectiveFilters = { ...filtersParam };
      
      Object.entries(effectiveFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, value);
        }
      });
      queryParams.append('page', pageParam);

      const config = {};
      if (skipCache) {
        config.skipCache = true;
      }

      const queryString = queryParams.toString();
      const response = await api.get(
        `${endpoint}${queryString ? `?${queryString}` : ''}`,
        config
      );

      let resultData = [];
      let paginationData = {};

      // Handle different response structures
      if (Array.isArray(response.data.data)) {
        resultData = response.data.data;
        paginationData = {};
      } else if (Array.isArray(response.data.data?.data)) {
        resultData = response.data.data.data;
        paginationData = response.data.data;
      } else if (Array.isArray(response.data)) {
        resultData = response.data;
        paginationData = {};
      }

      // Apply transformation if provided
      if (transformData && typeof transformData === 'function') {
        resultData = transformData(resultData);
      }

      console.log(`[Fetch] ${endpoint}:`, resultData);
      setData(resultData);
      setPagination(paginationData);
    } catch (err) {
      console.error(`Error fetching from ${endpoint}:`, err);
      setError(errorMessage);
      if (showErrorToast) {
        toast.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, [endpoint, errorMessage, showErrorToast, transformData]);

  // Refetch function - used after add/update operations
  const refetch = useCallback(async (skipCacheOverride = false) => {
    await fetchData(filters, currentPage, skipCacheOverride || useSkipCache);
  }, [fetchData, filters, currentPage, useSkipCache]);

  // Initial fetch when filters or page changes
  useEffect(() => {
    fetchData(filters, currentPage, false);
  }, [filters, currentPage]);

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    setData, // Allow manual data updates if needed
    setPagination // Allow manual pagination updates if needed
  };
};

export default useFetchData;
