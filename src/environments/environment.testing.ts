/**
 * Testing Environment Configuration
 * Used for testing/staging environment
 */
export const environment = {
  production: false,
  environment: 'testing',
  apiUrl: 'https://maltiti-backend-testing.onrender.com',
  enableDebug: true,
  enableDevTools: true,
  logLevel: 'info',
} as const;

