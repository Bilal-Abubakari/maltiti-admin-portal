/**
 * Users NgRx Selectors with Angular Signals
 * Signal-based selectors for reactive UI updates
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { User } from '../../../models/user.model';
import { UsersState } from './users.reducer';

export const selectUsersState = createFeatureSelector<UsersState>('users');

export const selectAllUsers = createSelector(selectUsersState, (state) => state.users);

export const selectSelectedUser = createSelector(selectUsersState, (state) => state.selectedUser);

export const selectUsersLoading = createSelector(selectUsersState, (state) => state.loading);

export const selectUsersError = createSelector(selectUsersState, (state) => state.error);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectUserById = (id: string) =>
  createSelector(selectAllUsers, (users: User[]) => users.find((u: User) => u.id === id));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectUsersByRole = (role: string) =>
  createSelector(selectAllUsers, (users: User[]) => users.filter((u: User) => u.userType === role));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectUsersByStatus = (status: string) =>
  createSelector(selectAllUsers, (users: User[]) => users.filter((u: User) => u.status === status));
