/**
 * Users NgRx Effects
 * Handles side effects for user actions (API calls)
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { UsersApiService } from '../services/users-api.service';
import * as UsersActions from './users.actions';
import { MessageService } from 'primeng/api';
import { SERVER_ERROR } from '../../../shared/constants';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);
  private usersApi = inject(UsersApiService);
  private messageService = inject(MessageService);

  public loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),
      switchMap(() =>
        this.usersApi.getAllUsers().pipe(
          map(({ data }) => UsersActions.loadUsersSuccess({ users: data })),
          catchError((error) => of(UsersActions.loadUsersFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  public loadUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUser),
      switchMap(({ id }) =>
        this.usersApi.getUser(id).pipe(
          map((user) => UsersActions.loadUserSuccess({ user })),
          catchError((error) => of(UsersActions.loadUserFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  public updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),
      switchMap(({ id, dto }) =>
        this.usersApi.updateUser(id, dto).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),
          catchError((error) => of(UsersActions.updateUserFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  public deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),
      switchMap(({ id }) =>
        this.usersApi.deleteUser(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),
          catchError((error) => of(UsersActions.deleteUserFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  public changeUserStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.changeUserStatus),
      switchMap(({ id, status }) =>
        this.usersApi.changeUserStatus(id, status).pipe(
          map((user) => UsersActions.changeUserStatusSuccess({ user })),
          catchError((error) => of(UsersActions.changeUserStatusFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  public changeUserRole$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.changeUserRole),
      switchMap(({ id, role }) =>
        this.usersApi.changeUserRole(id, role).pipe(
          map((user) => UsersActions.changeUserRoleSuccess({ user })),
          catchError((error) =>
            of(UsersActions.changeUserRoleFailure({ error: error.error.error ?? SERVER_ERROR })),
          ),
        ),
      ),
    ),
  );

  public createAdmin$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createAdmin),
      switchMap(({ dto }) =>
        this.usersApi.createAdmin(dto).pipe(
          map((user) => UsersActions.createAdminSuccess({ user })),
          catchError((error) =>
            of(UsersActions.createAdminFailure({ error: error.error.error ?? SERVER_ERROR })),
          ),
        ),
      ),
    ),
  );

  public createAdminSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.createAdminSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Admin invited successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  public updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          UsersActions.updateUserSuccess,
          UsersActions.changeUserStatusSuccess,
          UsersActions.changeUserRoleSuccess,
        ),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  public deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUserSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  public handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          UsersActions.loadUsersFailure,
          UsersActions.loadUserFailure,
          UsersActions.updateUserFailure,
          UsersActions.deleteUserFailure,
          UsersActions.changeUserStatusFailure,
          UsersActions.changeUserRoleFailure,
          UsersActions.createAdminFailure,
        ),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error,
          });
        }),
      ),
    { dispatch: false },
  );
}
