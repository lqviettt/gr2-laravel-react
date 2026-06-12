/**
 * Custom Hook: useCategoryProductsCache
 * Manages category products with localStorage persistence
 * 
 * Benefits:
 * - Fetch once per category (never repeated)
 * - Persists across page reloads
 * - Cleared on logout
 * - Memory efficient
 */

import { useState, useCallback, useEffect } from 'react';
import { api } from './apiClient';

const STORAGE_KEY = 'categoryProducts';
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

export const useCategoryProductsCache = () => {
  const [categoryProducts, setCategoryProducts] = useState({});

  // Load from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);
          setCategoryProducts(data);
          console.log('[Cache] Loaded category products from localStorage:', Object.keys(data).length);
        }
      } catch (error) {
        console.error('Error loading category products from storage:', error);
        localStorage.removeItem(STORAGE_KEY);
      }
    };
    
    loadFromStorage();
  }, []);

  // Fetch and cache product for specific category
  const fetchCategoryProducts = useCallback(async (categoryId) => {
    // Return if already cached
    if (categoryProducts[categoryId]) {
      console.log(`[Cache Hit] Category ${categoryId}`);
      return categoryProducts[categoryId];
    }

    try {
      console.log(`[Fetching] Category ${categoryId} products...`);
      const response = await api.get(
        `/product?category_id=${categoryId}&perPage=10`,
        { cacheDuration: CACHE_DURATION }
      );

      if (response.data?.data?.data) {
        const products = response.data.data.data;
        
        // Update both state and localStorage using setState callback
        setCategoryProducts(prevProducts => {
          const updated = {
            ...prevProducts,
            [categoryId]: products
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        
        console.log(`[Cached] Category ${categoryId}: ${products.length} products saved`);
        return products;
      }
    } catch (error) {
      console.error(`Error loading category ${categoryId} products:`, error);
      return [];
    }
  }, []);

  // Clear all cached products
  const clearCache = useCallback(() => {
    setCategoryProducts({});
    localStorage.removeItem(STORAGE_KEY);
    console.log('[Cache] Cleared all category products');
  }, []);

  // Get cached products for category (without fetching)
  const getCachedProducts = useCallback((categoryId) => {
    return categoryProducts[categoryId] || null;
  }, [categoryProducts]);

  // Check if category products are cached
  const isCached = useCallback((categoryId) => {
    return !!categoryProducts[categoryId];
  }, [categoryProducts]);

  return {
    categoryProducts,
    fetchCategoryProducts,
    getCachedProducts,
    isCached,
    clearCache
  };
};

export default useCategoryProductsCache;
