import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SalesState } from './sales.reducer';

export const selectSalesState = createFeatureSelector<SalesState>('sales');

export const selectSales = createSelector(selectSalesState, (state) => state.sales);

export const selectCurrentSale = createSelector(selectSalesState, (state) => state.currentSale);

export const selectLoading = createSelector(selectSalesState, (state) => state.loading);

export const selectError = createSelector(selectSalesState, (state) => state.error);

export const selectTotal = createSelector(selectSalesState, (state) => state.total);

export const selectPage = createSelector(selectSalesState, (state) => state.page);

export const selectLimit = createSelector(selectSalesState, (state) => state.limit);

export const selectFilters = createSelector(selectSalesState, (state) => state.filters);

export const selectTotalPages = createSelector(selectTotal, selectLimit, (total, limit) =>
  Math.ceil(total / limit),
);

export const selectHasNextPage = createSelector(
  selectPage,
  selectTotalPages,
  (page, totalPages) => page < totalPages,
);

export const selectHasPrevPage = createSelector(selectPage, (page) => page > 1);
