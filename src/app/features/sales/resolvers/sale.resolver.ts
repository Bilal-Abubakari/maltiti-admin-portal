/**
 * Sale Resolver
 * Loads sale data before the route activates in edit mode
 */

import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, switchMap, take } from 'rxjs/operators';
import { of } from 'rxjs';
import { Sale } from '../models/sale.model';
import { loadSale } from '../store/sales.actions';
import { selectCurrentSale, selectLoading } from '../store/sales.selectors';

export const saleResolver: ResolveFn<Sale | null> = (route) => {
  const store = inject(Store);
  const saleId = route.paramMap.get('id');

  if (!saleId) {
    return of(null);
  }

  // Dispatch the load action
  store.dispatch(loadSale({ id: saleId }));

  // Wait for loading to complete and return the sale
  return store.select(selectLoading).pipe(
    filter((loading) => !loading),
    take(1),
    switchMap(() => store.select(selectCurrentSale)),
    take(1),
  );
};
