/**
 * Request Throttler
 * 
 * Limits the number of concurrent HTTP requests to prevent
 * overwhelming the backend and avoid "Too Many Requests" errors
 * 
 * Usage:
 * import { requestThrottler } from '../utils/requestThrottler';
 * 
 * await requestThrottler.execute(async () => {
 *   return await api.get('/some-endpoint');
 * });
 */

class RequestThrottler {
  constructor(maxConcurrentRequests = 5) {
    this.maxConcurrentRequests = maxConcurrentRequests;
    this.activeRequests = 0;
    this.queue = [];
  }

  /**
   * Execute a function with request throttling
   * @param {Function} fn - Async function to execute
   * @returns {Promise} Result of the function
   */
  async execute(fn) {
    // Wait if we've reached max concurrent requests
    if (this.activeRequests >= this.maxConcurrentRequests) {
      await new Promise(resolve => this.queue.push(resolve));
    }

    this.activeRequests++;
    
    try {
      return await fn();
    } finally {
      this.activeRequests--;
      
      // Execute next queued request
      const resolve = this.queue.shift();
      if (resolve) resolve();
    }
  }

  /**
   * Get current number of active requests
   */
  getActiveRequestCount() {
    return this.activeRequests;
  }

  /**
   * Get current queue length
   */
  getQueueLength() {
    return this.queue.length;
  }

  /**
   * Reset the throttler
   */
  reset() {
    this.activeRequests = 0;
    this.queue = [];
  }
}

// Export singleton instance
export const requestThrottler = new RequestThrottler(5); // Max 5 concurrent requests

export default RequestThrottler;
