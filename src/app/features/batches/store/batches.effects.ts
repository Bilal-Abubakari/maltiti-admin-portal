/**
 * Batches NgRx Effects
 * Handles side effects for batch actions (API calls)
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BatchApiService } from '../services/batch-api.service';
import * as BatchesActions from './batches.actions';
import { MessageService } from 'primeng/api';
import { SERVER_ERROR } from '@shared/constants';
import { BatchQueryParams } from '@features/batches/models/batch.model';

@Injectable()
export class BatchesEffects {
  private actions$ = inject(Actions);
  private batchApi = inject(BatchApiService);
  private messageService = inject(MessageService);

  public loadBatches$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.createBatchSuccess, BatchesActions.loadBatches),
      switchMap((data) => {
        let params: BatchQueryParams | undefined;
        if (data.type === BatchesActions.loadBatches.type) {
          params = data.params;
        }
        return this.batchApi.getAllBatches(params).pipe(
          map((response) => BatchesActions.loadBatchesSuccess({ response })),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load batches',
            });
            return of(BatchesActions.loadBatchesFailure({ error: error.error.message }));
          }),
        );
      }),
    ),
  );

  public loadBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.loadBatch),
      switchMap(({ id }) =>
        this.batchApi.getBatch(id).pipe(
          map((batch) => BatchesActions.loadBatchSuccess({ batch })),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to load batch',
            });
            return of(BatchesActions.loadBatchFailure({ error: error.message }));
          }),
        ),
      ),
    ),
  );

  public createBatch$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BatchesActions.createBatch),
      switchMap(({ dto }) =>
        this.batchApi.createBatch(dto).pipe(
          tap(() =>
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Batch created successfully',
            }),
          ),
          map((batch) => BatchesActions.createBatchSuccess({ batch })),
          catchError((error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create batch',
            });
            return of(
              BatchesActions.createBatchFailure({ error: error.error.error ?? SERVER_ERROR }),
            );
          }),
        ),
      ),
    ),
  );

  public createBatchSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BatchesActions.createBatchSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Batch created successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  public handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BatchesActions.loadBatchesFailure,
          BatchesActions.loadBatchFailure,
          BatchesActions.createBatchFailure,
        ),
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
