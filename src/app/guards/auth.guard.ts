import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsAuthenticated } from '../auth/store/auth.selectors';
import { RouteHelper } from '../config/routes.config';

export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);

  const isAuthenticated = store.selectSignal(selectIsAuthenticated);

  if (!isAuthenticated()) {
    void router.navigate([RouteHelper.Login]);
    return false;
  }

  return true;
};

