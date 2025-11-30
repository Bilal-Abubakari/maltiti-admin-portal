import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectUser } from '../auth/store/auth.selectors';
import { RouteHelper } from '../config/routes.config';
import { Role } from '../models/user.model';

export const roleGuard = (allowedRoles: Role[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    const user = store.selectSignal(selectUser);

    if (!user() || !allowedRoles.includes(user()!.userType)) {
      void router.navigate([RouteHelper.Dashboard]);
      return false;
    }

    return true;
  };
};
