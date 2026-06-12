/**
 * GHN (Giao Hàng Nhanh) API Client with Caching
 * 
 * Caches province, district, and ward data for 1 hour
 * to avoid excessive API calls during checkout flow
 */

import axios from 'axios';

const GHN_TOKEN = process.env.REACT_APP_GHN_TOKEN;
const GHN_BASE_URL = 'https://online-gateway.ghn.vn/shiip/public-api/master-data';
const GHN_CACHE_DURATION = 60 * 60 * 1000; // 1 hour

const ghnCache = new Map();

/**
 * Get cached GHN data if still valid
 */
const getCachedGHNData = (key) => {
  const cached = ghnCache.get(key);
  if (cached && Date.now() - cached.timestamp < GHN_CACHE_DURATION) {
    console.log(`[GHN Cache Hit] ${key}`);
    return cached.data;
  }
  
  // Remove expired cache
  if (cached) {
    ghnCache.delete(key);
  }
  
  return null;
};

/**
 * Store data in GHN cache
 */
const setCachedGHNData = (key, data) => {
  ghnCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

/**
 * Clear all GHN cache
 */
export const clearGHNCache = () => {
  ghnCache.clear();
};

/**
 * Fetch provinces from GHN
 * @returns {Promise<Array>} Array of provinces
 */
export const getProvinces = async () => {
  const cacheKey = 'ghn_provinces';
  
  // Check cache first
  const cached = getCachedGHNData(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(
      `${GHN_BASE_URL}/province`,
      {
        headers: {
          Token: GHN_TOKEN,
        },
      }
    );
    
    const provinces = response.data.data || [];
    setCachedGHNData(cacheKey, provinces);
    return provinces;
  } catch (error) {
    console.error('Error fetching GHN provinces:', error);
    return [];
  }
};

/**
 * Fetch districts for a specific province
 * @param {number} provinceId - Province ID from GHN
 * @returns {Promise<Array>} Array of districts
 */
export const getDistricts = async (provinceId) => {
  if (!provinceId) return [];
  
  const cacheKey = `ghn_districts_${provinceId}`;
  
  // Check cache first
  const cached = getCachedGHNData(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(
      `${GHN_BASE_URL}/district?province_id=${provinceId}`,
      {
        headers: {
          Token: GHN_TOKEN,
        },
      }
    );
    
    const districts = response.data.data || [];
    setCachedGHNData(cacheKey, districts);
    return districts;
  } catch (error) {
    console.error('Error fetching GHN districts:', error);
    return [];
  }
};

/**
 * Fetch wards for a specific district
 * @param {number} districtId - District ID from GHN
 * @returns {Promise<Array>} Array of wards
 */
export const getWards = async (districtId) => {
  if (!districtId) return [];
  
  const cacheKey = `ghn_wards_${districtId}`;
  
  // Check cache first
  const cached = getCachedGHNData(cacheKey);
  if (cached) {
    return cached;
  }

  try {
    const response = await axios.get(
      `${GHN_BASE_URL}/ward?district_id=${districtId}`,
      {
        headers: {
          Token: GHN_TOKEN,
        },
      }
    );
    
    const wards = response.data.data || [];
    setCachedGHNData(cacheKey, wards);
    return wards;
  } catch (error) {
    console.error('Error fetching GHN wards:', error);
    return [];
  }
};

export default {
  getProvinces,
  getDistricts,
  getWards,
  clearGHNCache,
};
