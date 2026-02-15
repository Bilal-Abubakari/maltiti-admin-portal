/**
 * Batches NgRx Selectors with Angular Signals
 * Signal-based selectors for reactive UI updates
 */

import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BatchesState } from './batches.reducer';

export const selectBatchesState = createFeatureSelector<BatchesState>('batches');

export const selectAllBatches = createSelector(selectBatchesState, (state) => state.batches);

export const selectSelectedBatch = createSelector(
  selectBatchesState,
  (state) => state.selectedBatch,
);

export const selectBatchesLoading = createSelector(selectBatchesState, (state) => state.loading);

export const selectBatchesError = createSelector(selectBatchesState, (state) => state.error);

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectBatchById = (id: string) =>
  createSelector(selectAllBatches, (batches) => batches.find((b) => b.id === id));

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const selectBatchesByStatus = (status: string) =>
  createSelector(selectAllBatches, (batches) =>
    batches.filter((b) => b.qualityCheckStatus === status),
  );

export const selectBatchesTotalItems = createSelector(
  selectBatchesState,
  (state) => state.totalItems,
);

export const selectBatchesCurrentPage = createSelector(
  selectBatchesState,
  (state) => state.currentPage,
);

export const selectBatchesTotalPages = createSelector(
  selectBatchesState,
  (state) => state.totalPages,
);
