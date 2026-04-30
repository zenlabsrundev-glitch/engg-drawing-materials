/**
 * Centralized Environment Configuration for Frontend
 * 
 * In Create React App, environment variables must start with REACT_APP_
 * Access them here to provide a single point of entry and type safety.
 */

export const ENV = {
  API_URL: process.env.REACT_APP_API_URL || 'https://stationary-pre-pack-order-hub-backend.vercel.app',
  NODE_ENV: process.env.NODE_ENV || 'development',
  IS_PROD: process.env.NODE_ENV === 'production',
};

// Helper for logging config (only in dev)
if (!ENV.IS_PROD) {
  console.log('[CONFIG] Environment loaded:', {
    API_URL: ENV.API_URL,
    NODE_ENV: ENV.NODE_ENV
  });
}
