/**
 * Users NgRx Reducer
 * Manages user state based on dispatched actions
 */

import { createReducer, on } from '@ngrx/store';
import { User } from '../../../models/user.model';
import * as UsersActions from './users.actions';

export interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};

export const usersReducer = createReducer(
  initialState,

  // Load Users
  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, { users }) => ({
    ...state,
    users,
    loading: false,
  })),

  on(UsersActions.loadUsersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single User
  on(UsersActions.loadUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUserSuccess, (state, { user }) => ({
    ...state,
    selectedUser: user,
    loading: false,
  })),

  on(UsersActions.loadUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update User
  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: user,
    loading: false,
  })),

  on(UsersActions.updateUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete User
  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    loading: false,
  })),

  on(UsersActions.deleteUserFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Change User Status
  on(UsersActions.changeUserStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.changeUserStatusSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: user,
    loading: false,
  })),

  on(UsersActions.changeUserStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Change User Role
  on(UsersActions.changeUserRole, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.changeUserRoleSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: user,
    loading: false,
  })),

  on(UsersActions.changeUserRoleFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Admin
  on(UsersActions.createAdmin, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.createAdminSuccess, (state, { user }) => ({
    ...state,
    users: [user, ...state.users],
    loading: false,
  })),

  on(UsersActions.createAdminFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected User
  on(UsersActions.clearSelectedUser, (state) => ({
    ...state,
    selectedUser: null,
  })),

  // Clear Error
  on(UsersActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
