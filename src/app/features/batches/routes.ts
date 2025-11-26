/**
 * Batches Feature Routes
 * Lazy-loaded routes for the batches feature module
 */

import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';

export const BATCHES_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/batches-list/batches-list.component').then((m) => m.BatchesListComponent),
    canActivate: [authGuard],
  },
];
