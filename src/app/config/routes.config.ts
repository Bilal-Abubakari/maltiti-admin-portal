/**
 * Type-safe route configuration
 * This defines all application routes in a centralized location
 * with full TypeScript support for route parameters and navigation
 */

export const APP_ROUTES = {
  auth: {
    login: {
      path: 'login',
      fullPath: '/login',
    },
  },
  dashboard: {
    path: 'dashboard',
    fullPath: '/dashboard',
  },
  root: {
    path: '',
    fullPath: '/',
  },
} as const;

/**
 * Type-safe route paths extracted from APP_ROUTES
 */
export type AppRoutePath =
  | typeof APP_ROUTES.auth.login.fullPath
  | typeof APP_ROUTES.dashboard.fullPath
  | typeof APP_ROUTES.root.fullPath;

/**
 * Helper function to get route path with type safety
 */
export function getRoutePath(route: keyof typeof APP_ROUTES, subRoute?: string): string {
  const routeConfig = APP_ROUTES[route];

  if (subRoute && routeConfig && typeof routeConfig === 'object' && subRoute in routeConfig) {
    return (routeConfig as any)[subRoute].fullPath;
  }

  if (routeConfig && 'fullPath' in routeConfig) {
    return routeConfig.fullPath;
  }

  return '/';
}

/**
 * Route helper for common navigation patterns
 */
export class RouteHelper {
  public static readonly Login = APP_ROUTES.auth.login.fullPath;
  public static readonly Dashboard = APP_ROUTES.dashboard.fullPath;
  public static readonly Root = APP_ROUTES.root.fullPath;
}

