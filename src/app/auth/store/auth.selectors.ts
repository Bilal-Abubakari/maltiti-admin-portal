import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.reducer';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectUser = createSelector(selectAuthState, (state) => state.user);

export const selectAuthLoading = createSelector(selectAuthState, (state) => state.loading);

export const selectAuthError = createSelector(selectAuthState, (state) => state.error);

export const selectIsAuthenticated = createSelector(selectUser, (user) => !!user);

export const selectMustChangePassword = createSelector(
  selectUser,
  (user) => !!user?.mustChangePassword,
);

export const selectUserId = createSelector(selectUser, (user) => user?.id);

export const selectUserAvatarUrl = createSelector(selectUser, (user) => user?.avatarUrl);

export const selectUserName = createSelector(selectUser, (user) => user?.name);

export const selectUserInitialsFromName = createSelector(selectUserName, (fullName) =>
  fullName
    ?.trim()
    .split(/\s+/) // split by one or more spaces
    .map((name) => name[0].toUpperCase())
    .join(''),
);
