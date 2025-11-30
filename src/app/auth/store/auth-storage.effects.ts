import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { map, tap } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { StorageService } from '../../services/storage.service';

export class AuthStorageEffects {
  private readonly actions$ = inject(Actions);

  // Save user to localStorage on successful login
  public readonly saveUserOnLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLoginSuccess, AuthActions.changePasswordSuccess),
        tap(({ user }) => {
          StorageService.saveUser(user);
        }),
      ),
    { dispatch: false },
  );

  // Clear user from localStorage on logout
  public readonly clearUserOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogoutSuccess),
        tap(() => {
          StorageService.clearUser();
        }),
      ),
    { dispatch: false },
  );

  // Clear user from localStorage on session expiration
  public readonly clearUserOnSessionExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => {
          StorageService.clearUser();
        }),
      ),
    { dispatch: false },
  );

  // Restore user from localStorage on app initialization
  public readonly restoreUserOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const user = StorageService.getUser();
        if (user) {
          return AuthActions.restoreUserFromStorage({ user });
        }
        return AuthActions.noUserInStorage();
      }),
    ),
  );
}
