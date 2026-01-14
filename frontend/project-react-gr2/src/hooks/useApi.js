import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(async (url, options = {}) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('auth_token');

      const defaultHeaders = {
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      };

      const config = {
        headers: {
          ...defaultHeaders,
          ...options.headers,
        },
        ...options,
      };

      // Stringify body if it's an object and content-type is json
      if (config.body && typeof config.body === 'object' && config.headers['Content-Type']?.includes('json')) {
        config.body = JSON.stringify(config.body);
      }

      const response = await fetch(url, config);

      // Handle different response types
      let data;
      const contentType = response.headers.get('content-type');

      if (contentType?.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return { data, success: true };
    } catch (err) {
      const errorMessage = err.message || 'Có lỗi xảy ra';
      setError(errorMessage);

      // Don't show toast for certain errors (handled by components)
      if (!options.silent) {
        toast.error(errorMessage);
      }

      return { error: errorMessage, success: false };
    } finally {
      setLoading(false);
    }
  }, []);

  const get = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'GET' });
  }, [makeRequest]);

  const post = useCallback((url, data, options = {}) => {
    return makeRequest(url, { ...options, method: 'POST', body: data });
  }, [makeRequest]);

  const put = useCallback((url, data, options = {}) => {
    return makeRequest(url, { ...options, method: 'PUT', body: data });
  }, [makeRequest]);

  const patch = useCallback((url, data, options = {}) => {
    return makeRequest(url, { ...options, method: 'PATCH', body: data });
  }, [makeRequest]);

  const del = useCallback((url, options = {}) => {
    return makeRequest(url, { ...options, method: 'DELETE' });
  }, [makeRequest]);

  return {
    loading,
    error,
    get,
    post,
    put,
    patch,
    delete: del,
    makeRequest,
  };
};

export default useApi;