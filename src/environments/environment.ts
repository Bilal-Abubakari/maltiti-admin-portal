/**
 * Local Environment Configuration
 * Used for testing/staging environment
 */
export const environment = {
  production: false,
  environment: 'local',
  apiUrl: 'http://localhost:3000',
  enableDebug: true,
  enableDevTools: true,
  logLevel: 'info',
} as const;

