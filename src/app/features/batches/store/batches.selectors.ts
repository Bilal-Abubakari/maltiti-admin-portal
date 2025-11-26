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
  (state) => state.selectedBatch
);

export const selectBatchesLoading = createSelector(selectBatchesState, (state) => state.loading);

export const selectBatchesError = createSelector(selectBatchesState, (state) => state.error);

export const selectBatchById = (id: string) =>
  createSelector(selectAllBatches, (batches) => batches.find((b) => b.id === id));

export const selectBatchesByStatus = (status: string) =>
  createSelector(selectAllBatches, (batches) =>
    batches.filter((b) => b.qualityCheckStatus === status)
  );
