import axios from 'axios';

// Simple cache for GET requests
const requestCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

// Request deduplication - prevent duplicate requests
const pendingRequests = new Map();

// Create axios instance with default configuration
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true'
  }
});

// Request interceptor to add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('token');
      localStorage.setItem('isLoggedIn', 'false');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Cache helper functions
const getCacheKey = (url) => `GET_${url}`;

const getCachedData = (url) => {
  const cacheKey = getCacheKey(url);
  const cached = requestCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  // Remove expired cache
  if (cached) {
    requestCache.delete(cacheKey);
  }
  
  return null;
};

const setCachedData = (url, data) => {
  const cacheKey = getCacheKey(url);
  requestCache.set(cacheKey, {
    data,
    timestamp: Date.now()
  });
};

const clearCache = () => {
  requestCache.clear();
};

// API methods
export const api = {
  // GET request with caching and deduplication
  get: async (url, config = {}) => {
    // Skip cache for specific queries if needed
    const skipCache = config.skipCache === true;
    
    // Remove skipCache from config to avoid passing to axios
    const axiosConfig = { ...config };
    delete axiosConfig.skipCache;
    
    // Check cache first
    if (!skipCache) {
      const cached = getCachedData(url);
      if (cached) {
        console.log(`[Cache Hit] ${url}`);
        return Promise.resolve(cached);
      }
    }
    
    // Check if same request is already pending
    if (pendingRequests.has(url)) {
      console.log(`[Pending] ${url}`);
      return pendingRequests.get(url);
    }
    
    // Create new request promise
    const requestPromise = (async () => {
      try {
        const response = await apiClient.get(url, axiosConfig);
        setCachedData(url, response);
        pendingRequests.delete(url);
        return response;
      } catch (error) {
        pendingRequests.delete(url);
        throw error;
      }
    })();
    
    // Store pending request
    pendingRequests.set(url, requestPromise);
    
    return requestPromise;
  },

  // POST request
  post: (url, data = {}, config = {}) => apiClient.post(url, data, config),

  // PUT request
  put: (url, data = {}, config = {}) => apiClient.put(url, data, config),

  // DELETE request
  delete: (url, config = {}) => apiClient.delete(url, config),

  // PATCH request
  patch: (url, data = {}, config = {}) => apiClient.patch(url, data, config),
  
  // Clear cache
  clearCache,
};

export default apiClient;