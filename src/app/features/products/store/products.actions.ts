/**
 * Products NgRx Actions
 * Defines all actions for product state management
 */

import { createAction, props } from '@ngrx/store';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductQueryParams,
} from '../models/product.model';
import { IPagination } from '../../../models/response.model';

// Load Products List
export const loadProducts = createAction(
  '[Products] Load Products',
  props<{ params?: ProductQueryParams }>(),
);

export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ data: IPagination<Product> }>(),
);

export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>(),
);

// Load Single Product
export const loadProduct = createAction('[Products] Load Product', props<{ id: string }>());

export const loadProductSuccess = createAction(
  '[Products] Load Product Success',
  props<{ product: Product }>(),
);

export const loadProductFailure = createAction(
  '[Products] Load Product Failure',
  props<{ error: string }>(),
);

// Create Product
export const createProduct = createAction(
  '[Products] Create Product',
  props<{ dto: CreateProductDto }>(),
);

export const createProductSuccess = createAction(
  '[Products] Create Product Success',
  props<{ product: Product }>(),
);

export const createProductFailure = createAction(
  '[Products] Create Product Failure',
  props<{ error: string }>(),
);

// Update Product
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: string; dto: UpdateProductDto }>(),
);

export const updateProductSuccess = createAction(
  '[Products] Update Product Success',
  props<{ product: Product }>(),
);

export const updateProductFailure = createAction(
  '[Products] Update Product Failure',
  props<{ error: string }>(),
);

// Delete Product
export const deleteProduct = createAction('[Products] Delete Product', props<{ id: string }>());

export const deleteProductSuccess = createAction(
  '[Products] Delete Product Success',
  props<{ id: string }>(),
);

export const deleteProductFailure = createAction(
  '[Products] Delete Product Failure',
  props<{ error: string }>(),
);

// Change Product Status
export const changeProductStatus = createAction(
  '[Products] Change Product Status',
  props<{ id: string }>(),
);

export const changeProductStatusSuccess = createAction(
  '[Products] Change Product Status Success',
  props<{ product: Product }>(),
);

export const changeProductStatusFailure = createAction(
  '[Products] Change Product Status Failure',
  props<{ error: string }>(),
);

// Clear Selected Product
export const clearSelectedProduct = createAction('[Products] Clear Selected Product');

// Clear Error
export const clearError = createAction('[Products] Clear Error');
