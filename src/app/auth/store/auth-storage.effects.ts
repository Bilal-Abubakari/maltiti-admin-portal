import { inject } from '@angular/core';
import { Actions, createEffect, ofType, ROOT_EFFECTS_INIT } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import * as AuthActions from './auth.actions';
import { User } from '../../models/user.model';

const AUTH_STORAGE_KEY = 'auth_user';

export class StorageService {
  public saveUser(user: User): void {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  }

  public getUser(): User | null {
    try {
      const userJson = localStorage.getItem(AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Error reading user from localStorage:', error);
      return null;
    }
  }

  public clearUser(): void {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing user from localStorage:', error);
    }
  }
}

export class AuthStorageEffects {
  private readonly actions$ = inject(Actions);
  private readonly storage = new StorageService();

  // Save user to localStorage on successful login
  public readonly saveUserOnLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLoginSuccess),
        tap(({ user }) => {
          this.storage.saveUser(user);
        })
      ),
    { dispatch: false }
  );

  // Clear user from localStorage on logout
  public readonly clearUserOnLogout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.authLogoutSuccess),
        tap(() => {
          this.storage.clearUser();
        })
      ),
    { dispatch: false }
  );

  // Clear user from localStorage on session expiration
  public readonly clearUserOnSessionExpired$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.sessionExpired),
        tap(() => {
          this.storage.clearUser();
        })
      ),
    { dispatch: false }
  );

  // Restore user from localStorage on app initialization
  public readonly restoreUserOnInit$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ROOT_EFFECTS_INIT),
      map(() => {
        const user = this.storage.getUser();
        if (user) {
          return AuthActions.restoreUserFromStorage({ user });
        }
        return AuthActions.noUserInStorage();
      })
    )
  );
}

