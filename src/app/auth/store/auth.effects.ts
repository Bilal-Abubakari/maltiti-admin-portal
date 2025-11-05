import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, exhaustMap, tap } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import * as AuthActions from './auth.actions';
import {APP_ROUTES} from '../../config/routes.config';

@Injectable()
export class AuthEffects {
  private readonly actions$ = inject(Actions);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public readonly login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authLogin),
      exhaustMap((credentials) =>
        this.authService.login(credentials).pipe(
          map(({ user }) => AuthActions.authLoginSuccess({ user })),
          catchError((error) => {
            const errorMessage =
              error?.error?.message || 'Login failed. Please try again.';
            return of(AuthActions.authLoginFailure({ error: errorMessage }));
          })
        )
      )
    )
  );

  public readonly loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLoginSuccess),
        tap(() => {
          void this.router.navigate([APP_ROUTES.dashboard]);
        })
      ),
    { dispatch: false }
  );

  public readonly logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.authLogout),
      exhaustMap(() =>
        this.authService.logout().pipe(
          map(() => AuthActions.authLogoutSuccess()),
          catchError(() => of(AuthActions.authLogoutSuccess()))
        )
      )
    )
  );

  public readonly logoutSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogoutSuccess, AuthActions.sessionExpired),
        tap(() => {
          void this.router.navigate([APP_ROUTES.auth.login]);
        })
      ),
    { dispatch: false }
  );
}

