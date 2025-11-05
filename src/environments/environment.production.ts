/**
 * Production Environment Configuration
 * Used for production deployment
 */
export const environment = {
  production: true,
  environment: 'production',
  apiUrl: 'https://maltiti-backend-lx4o.onrender.com',
  enableDebug: false,
  enableDevTools: false,
  logLevel: 'error',
} as const;

