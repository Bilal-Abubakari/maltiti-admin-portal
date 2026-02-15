/**
 * Users NgRx Actions
 * Defines all actions for user state management
 */

import { createAction, props } from '@ngrx/store';
import { User } from '../../../models/user.model';

// Load Users List
export const loadUsers = createAction('[Users] Load Users');

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{ users: User[] }>(),
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{ error: string }>(),
);

// Load Single User
export const loadUser = createAction('[Users] Load User', props<{ id: string }>());

export const loadUserSuccess = createAction('[Users] Load User Success', props<{ user: User }>());

export const loadUserFailure = createAction(
  '[Users] Load User Failure',
  props<{ error: string }>(),
);

// Update User
export const updateUser = createAction(
  '[Users] Update User',
  props<{ id: string; dto: Partial<User> }>(),
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{ user: User }>(),
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{ error: string }>(),
);

// Delete User
export const deleteUser = createAction('[Users] Delete User', props<{ id: string }>());

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{ id: string }>(),
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{ error: string }>(),
);

// Change User Status
export const changeUserStatus = createAction(
  '[Users] Change User Status',
  props<{ id: string; status: string }>(),
);

export const changeUserStatusSuccess = createAction(
  '[Users] Change User Status Success',
  props<{ user: User }>(),
);

export const changeUserStatusFailure = createAction(
  '[Users] Change User Status Failure',
  props<{ error: string }>(),
);

// Change User Role
export const changeUserRole = createAction(
  '[Users] Change User Role',
  props<{ id: string; role: string }>(),
);

export const changeUserRoleSuccess = createAction(
  '[Users] Change User Role Success',
  props<{ user: User }>(),
);

export const changeUserRoleFailure = createAction(
  '[Users] Change User Role Failure',
  props<{ error: string }>(),
);

// Create Admin (Invite Admin)
export const createAdmin = createAction(
  '[Users] Create Admin',
  props<{ dto: { email: string; name: string } }>(),
);

export const createAdminSuccess = createAction(
  '[Users] Create Admin Success',
  props<{ user: User }>(),
);

export const createAdminFailure = createAction(
  '[Users] Create Admin Failure',
  props<{ error: string }>(),
);

// Clear Selected User
export const clearSelectedUser = createAction('[Users] Clear Selected User');

// Clear Error
export const clearError = createAction('[Users] Clear Error');
