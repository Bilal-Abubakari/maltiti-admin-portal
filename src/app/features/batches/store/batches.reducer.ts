/**
 * Batches NgRx Reducer
 * Manages batch state based on dispatched actions
 */

import { createReducer, on } from '@ngrx/store';
import { Batch } from '../models/batch.model';
import * as BatchesActions from './batches.actions';

export interface BatchesState {
  batches: Batch[];
  selectedBatch: Batch | null;
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
}

export const initialState: BatchesState = {
  batches: [],
  selectedBatch: null,
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 0,
};

export const batchesReducer = createReducer(
  initialState,

  // Load Batches
  on(BatchesActions.loadBatches, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BatchesActions.loadBatchesSuccess, (state, { response }) => ({
    ...state,
    batches: response.data.items,
    totalItems: response.data.totalItems,
    currentPage: response.data.currentPage,
    totalPages: response.data.totalPages,
    loading: false,
  })),

  on(BatchesActions.loadBatchesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Batch
  on(BatchesActions.loadBatch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BatchesActions.loadBatchSuccess, (state, { batch }) => ({
    ...state,
    selectedBatch: batch,
    loading: false,
  })),

  on(BatchesActions.loadBatchFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Batch
  on(BatchesActions.createBatch, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(BatchesActions.createBatchSuccess, (state, { batch }) => ({
    ...state,
    batches: [batch, ...state.batches],
    loading: false,
  })),

  on(BatchesActions.createBatchFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected Batch
  on(BatchesActions.clearSelectedBatch, (state) => ({
    ...state,
    selectedBatch: null,
  })),

  // Clear Error
  on(BatchesActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
