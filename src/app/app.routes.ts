import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { APP_ROUTES } from './config/routes.config';

export const routes: Routes = [
  {
    path: APP_ROUTES.root.path,
    redirectTo: APP_ROUTES.auth.login.fullPath,
    pathMatch: 'full',
  },
  {
    path: APP_ROUTES.auth.login.path,
    loadComponent: () =>
      import('./auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: APP_ROUTES.dashboard.path,
    loadComponent: () =>
      import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: APP_ROUTES.auth.login.fullPath,
  },
];
