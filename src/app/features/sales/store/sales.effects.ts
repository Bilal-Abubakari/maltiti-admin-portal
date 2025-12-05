import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { SalesApiService } from '../services/sales-api.service';
import * as SalesActions from './sales.actions';

@Injectable()
export class SalesEffects {
  private readonly salesApi = inject(SalesApiService);
  private readonly actions$ = inject(Actions);

  public loadSales$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSales),
      mergeMap(({ page, limit, status, customerId }) =>
        this.salesApi.getSales(status, customerId, page, limit).pipe(
          map((response) => SalesActions.loadSalesSuccess({ response })),
          catchError((error) =>
            of(SalesActions.loadSalesFailure({ error: error.message || 'Failed to load sales' })),
          ),
        ),
      ),
    ),
  );

  public loadSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.loadSale),
      mergeMap(({ id }) =>
        this.salesApi.getSale(id).pipe(
          map((sale) => SalesActions.loadSaleSuccess({ sale })),
          catchError((error) =>
            of(SalesActions.loadSaleFailure({ error: error.message || 'Failed to load sale' })),
          ),
        ),
      ),
    ),
  );

  public createSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.createSale),
      mergeMap(({ saleData }) =>
        this.salesApi.createSale(saleData).pipe(
          map((sale) => SalesActions.createSaleSuccess({ sale })),
          catchError((error) =>
            of(SalesActions.createSaleFailure({ error: error.message || 'Failed to create sale' })),
          ),
        ),
      ),
    ),
  );

  public updateSale$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.updateSale),
      mergeMap(({ id, saleData }) =>
        this.salesApi.updateSale(id, saleData).pipe(
          map((sale) => SalesActions.updateSaleSuccess({ sale })),
          catchError((error) =>
            of(SalesActions.updateSaleFailure({ error: error.message || 'Failed to update sale' })),
          ),
        ),
      ),
    ),
  );

  public updateSaleStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SalesActions.updateSaleStatus),
      mergeMap(({ id, status }) =>
        this.salesApi.updateSaleStatus(id, { status }).pipe(
          map((sale) => SalesActions.updateSaleStatusSuccess({ sale })),
          catchError((error) =>
            of(
              SalesActions.updateSaleStatusFailure({
                error: error.message || 'Failed to update sale status',
              }),
            ),
          ),
        ),
      ),
    ),
  );
}
