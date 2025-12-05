import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { MessageService } from 'primeng/api';
import { CustomersApiService } from '../services/customers-api.service';
import {
  createCustomer,
  createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess,
} from './customers.actions';

@Injectable()
export class CustomersEffects {
  private readonly customersApi = inject(CustomersApiService);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);

  public loadCustomers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadCustomers),
      mergeMap(({ page, limit, search }) =>
        this.customersApi.getCustomers(page, limit, search).pipe(
          map(({ data }) => loadCustomersSuccess({ response: data })),
          catchError((error) =>
            of(loadCustomersFailure({ error: error.message || 'Failed to load customers' })),
          ),
        ),
      ),
    ),
  );

  public createCustomer$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomer),
      mergeMap(({ customerData }) =>
        this.customersApi.createCustomer(customerData).pipe(
          map((customer) => createCustomerSuccess({ customer })),
          catchError((error) =>
            of(createCustomerFailure({ error: error.message || 'Failed to create customer' })),
          ),
        ),
      ),
    ),
  );

  // Reload customers after successful creation
  public reloadCustomersAfterCreate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createCustomerSuccess),
      map(() => loadCustomers({ page: 1, limit: 20 })),
    ),
  );

  public createCustomerSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(createCustomerSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Customer created successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  public handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loadCustomersFailure, createCustomerFailure),
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
