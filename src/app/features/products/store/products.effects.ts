/**
 * Products NgRx Effects
 * Handles side effects for product actions (API calls)
 */

import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap, tap } from 'rxjs/operators';
import { ProductApiService } from '../services/product-api.service';
import * as ProductsActions from './products.actions';
import { MessageService } from 'primeng/api';

@Injectable()
export class ProductsEffects {
  private actions$ = inject(Actions);
  private productApi = inject(ProductApiService);
  private messageService = inject(MessageService);

  loadProducts$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProducts),
      switchMap(({ params }) =>
        this.productApi.getAllProducts(params).pipe(
          map(({ data }) => ProductsActions.loadProductsSuccess({ data })),
          catchError((error) => of(ProductsActions.loadProductsFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  loadProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.loadProduct),
      switchMap(({ id }) =>
        this.productApi.getProduct(id).pipe(
          map((product) => ProductsActions.loadProductSuccess({ product })),
          catchError((error) => of(ProductsActions.loadProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.createProduct),
      switchMap(({ dto }) =>
        this.productApi.createProduct(dto).pipe(
          map((product) => ProductsActions.createProductSuccess({ product })),
          catchError((error) => of(ProductsActions.createProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  createProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.createProductSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product created successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  updateProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.updateProduct),
      switchMap(({ id, dto }) =>
        this.productApi.updateProduct(id, dto).pipe(
          map((product) => ProductsActions.updateProductSuccess({ product })),
          catchError((error) => of(ProductsActions.updateProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  updateProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.updateProductSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product updated successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  deleteProduct$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.deleteProduct),
      switchMap(({ id }) =>
        this.productApi.deleteProduct(id).pipe(
          map(() => ProductsActions.deleteProductSuccess({ id })),
          catchError((error) => of(ProductsActions.deleteProductFailure({ error: error.message }))),
        ),
      ),
    ),
  );

  deleteProductSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.deleteProductSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product deleted successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  changeProductStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(ProductsActions.changeProductStatus),
      switchMap(({ id }) =>
        this.productApi.changeProductStatus(id).pipe(
          map((product) => ProductsActions.changeProductStatusSuccess({ product })),
          catchError((error) =>
            of(ProductsActions.changeProductStatusFailure({ error: error.message })),
          ),
        ),
      ),
    ),
  );

  changeProductStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ProductsActions.changeProductStatusSuccess),
        tap(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Product status changed successfully',
          });
        }),
      ),
    { dispatch: false },
  );

  handleError$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          ProductsActions.loadProductsFailure,
          ProductsActions.loadProductFailure,
          ProductsActions.createProductFailure,
          ProductsActions.updateProductFailure,
          ProductsActions.deleteProductFailure,
          ProductsActions.changeProductStatusFailure,
        ),
        tap(({ error }) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: error || 'An error occurred',
          });
        }),
      ),
    { dispatch: false },
  );
}
