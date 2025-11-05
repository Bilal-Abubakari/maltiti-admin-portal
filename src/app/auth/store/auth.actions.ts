import { createAction, props } from '@ngrx/store';
import { User } from '../../models/user.model';
import { LoginRequest } from '../../models/login-request.model';

export const authLogin = createAction(
  '[Auth] Login',
  props<LoginRequest>()
);

export const authLoginSuccess = createAction(
  '[Auth] Login Success',
  props<{ user: User }>()
);

export const authLoginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()
);

export const authLogout = createAction('[Auth] Logout');

export const authLogoutSuccess = createAction('[Auth] Logout Success');

export const sessionExpired = createAction(
  '[Auth] Session Expired',
);

export const restoreUserFromStorage = createAction(
  '[Auth] Restore User From Storage',
  props<{ user: User }>()
);

export const noUserInStorage = createAction('[Auth] No User In Storage');

