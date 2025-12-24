/**
 * Reports Feature Routes
 * Lazy-loaded routes for the reports feature module
 */

import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const REPORTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/reports-home/reports-home.component').then((m) => m.ReportsHomeComponent),
    canActivate: [authGuard],
  },
  {
    path: 'sales',
    loadComponent: () =>
      import('./pages/sales-reports/sales-reports.component').then((m) => m.SalesReportsComponent),
    canActivate: [authGuard],
  },
  {
    path: 'product-performance',
    loadComponent: () =>
      import('./pages/product-performance/product-performance.component').then(
        (m) => m.ProductPerformanceComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'batch-production',
    loadComponent: () =>
      import('./pages/batch-production/batch-production.component').then(
        (m) => m.BatchProductionComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'inventory',
    loadComponent: () =>
      import('./pages/inventory-reports/inventory-reports.component').then(
        (m) => m.InventoryReportsComponent,
      ),
    canActivate: [authGuard],
  },
  {
    path: 'comparative',
    loadComponent: () =>
      import('./pages/comparative-reports/comparative-reports.component').then(
        (m) => m.ComparativeReportsComponent,
      ),
    canActivate: [authGuard],
  },
];
