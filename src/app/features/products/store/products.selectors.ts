/**
 * Products NgRx Selectors with Angular Signals
 * Signal-based selectors for reactive UI updates
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProductsState } from './products.reducer';

export const selectProductsState = createFeatureSelector<ProductsState>('products');

export const selectAllProducts = createSelector(selectProductsState, (state) => state.products);

export const selectSelectedProduct = createSelector(
  selectProductsState,
  (state) => state.selectedProduct,
);

export const selectProductsLoading = createSelector(selectProductsState, (state) => state.loading);

export const selectProductsError = createSelector(selectProductsState, (state) => state.error);

export const selectTotalProducts = createSelector(
  selectProductsState,
  ({ totalItems }) => totalItems,
);

export const selectProductsPagination = createSelector(selectProductsState, (state) => ({
  totalItems: state.totalItems,
  currentPage: state.currentPage,
  totalPages: state.totalPages,
}));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectProductById = (id: string) =>
  createSelector(selectAllProducts, (products) => products.find((p) => p.id === id));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectProductsByCategory = (category: string) =>
  createSelector(selectAllProducts, (products) => products.filter((p) => p.category === category));

export const selectActiveProducts = createSelector(selectAllProducts, (products) =>
  products.filter((p) => p.status === 'active'),
);

export const selectFeaturedProducts = createSelector(selectAllProducts, (products) =>
  products.filter((p) => p.isFeatured),
);
