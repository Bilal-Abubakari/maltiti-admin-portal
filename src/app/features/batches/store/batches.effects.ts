/**
 * Batches NgRx Effects
 * Handles side effects for batch actions (API calls)
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { BatchApiService } from '../services/batch-api.service';
import * as BatchesActions from './batches.actions';
import { MessageService } from 'primeng/api';

@Injectable()
export class BatchesEffects {
  private actions$ = inject(Actions);
  private batchApi = inject(BatchApiService);
  private messageService = inject(MessageService);

  loadBatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.loadBatches),
      switchMap(() =>
        this.batchApi.getAllBatches().pipe(
          map((batches) => BatchesActions.loadBatchesSuccess({ batches })),
          catchError((error) => of(BatchesActions.loadBatchesFailure({ error: error.message })))
        )
      )
    )
  );

  loadBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.loadBatch),
      switchMap(({ id }) =>
        this.batchApi.getBatch(id).pipe(
          map((batch) => BatchesActions.loadBatchSuccess({ batch })),
          catchError((error) => of(BatchesActions.loadBatchFailure({ error: error.message })))
        )
      )
    )
  );

  createBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.createBatch),
      switchMap(({ dto }) =>
        this.batchApi.createBatch(dto).pipe(
          map((batch) => BatchesActions.createBatchSuccess({ batch })),
          catchError((error) => of(BatchesActions.createBatchFailure({ error: error.message })))
        )
      )
    )
  );

  createBatchSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BatchesActions.createBatchSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch created successfully',
          });
        })
      ),
    { dispatch: false }
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BatchesActions.loadBatchesFailure,
          BatchesActions.loadBatchFailure,
          BatchesActions.createBatchFailure
        ),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error || 'An error occurred',
          });
        })
      ),
    { dispatch: false }
  );
}
