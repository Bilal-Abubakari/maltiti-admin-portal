/**
 * Products Feature Routes
 * Lazy-loaded routes for the products feature module
 */

import { Routes } from '@angular/router';
import { authGuard } from '@guards/auth.guard';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/products-list/products-list.component').then((m) => m.ProductsListComponent),
    canActivate: [authGuard],
  },
];
