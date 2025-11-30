/**
 * Batches NgRx Actions
 * Defines all actions for batch state management
 */

import { createAction, props } from '@ngrx/store';
import { Batch, BatchQueryParams, CreateBatchDto } from '../models/batch.model';
import { IPaginationResponse } from '../../../models/response.model';

// Load Batches List
export const loadBatches = createAction(
  '[Batches] Load Batches',
  props<{ params?: BatchQueryParams }>(),
);

export const loadBatchesSuccess = createAction(
  '[Batches] Load Batches Success',
  props<{ response: IPaginationResponse<Batch> }>(),
);

export const loadBatchesFailure = createAction(
  '[Batches] Load Batches Failure',
  props<{ error: string }>(),
);

// Load Single Batch
export const loadBatch = createAction('[Batches] Load Batch', props<{ id: string }>());

export const loadBatchSuccess = createAction(
  '[Batches] Load Batch Success',
  props<{ batch: Batch }>(),
);

export const loadBatchFailure = createAction(
  '[Batches] Load Batch Failure',
  props<{ error: string }>(),
);

// Create Batch
export const createBatch = createAction('[Batches] Create Batch', props<{ dto: CreateBatchDto }>());

export const createBatchSuccess = createAction(
  '[Batches] Create Batch Success',
  props<{ batch: Batch }>(),
);

export const createBatchFailure = createAction(
  '[Batches] Create Batch Failure',
  props<{ error: string }>(),
);

// Clear Selected Batch
export const clearSelectedBatch = createAction('[Batches] Clear Selected Batch');

// Clear Error
export const clearError = createAction('[Batches] Clear Error');
