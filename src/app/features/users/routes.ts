/**
 * Users Feature Routes
 * Lazy-loaded routes for the users feature module
 */

import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { roleGuard } from '../../guards/role.guard';
import { Role } from '../../models/user.model';

export const USERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/users-list/users-list.component').then((m) => m.UsersListComponent),
    canActivate: [authGuard, roleGuard([Role.SuperAdmin])],
  },
];
