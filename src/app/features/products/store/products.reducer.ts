/**
 * Products NgRx Reducer
 * Manages product state based on dispatched actions
 */

import { createReducer, on } from '@ngrx/store';
import { Product } from '../models/product.model';
import * as ProductsActions from './products.actions';

export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  loading: boolean;
  error: string | null;
}

export const initialState: ProductsState = {
  products: [],
  selectedProduct: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 0,
  loading: false,
  error: null,
};

export const productsReducer = createReducer(
  initialState,

  // Load Products
  on(ProductsActions.loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.loadProductsSuccess, (state, { data }) => ({
    ...state,
    products: data.items,
    totalItems: data.totalItems,
    currentPage: data.currentPage,
    totalPages: data.totalPages,
    loading: false,
  })),

  on(ProductsActions.loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Load Single Product
  on(ProductsActions.loadProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.loadProductSuccess, (state, { product }) => ({
    ...state,
    selectedProduct: product,
    loading: false,
  })),

  on(ProductsActions.loadProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Create Product
  on(ProductsActions.createProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.createProductSuccess, (state, { product }) => ({
    ...state,
    products: [product, ...state.products],
    totalItems: state.totalItems + 1,
    loading: false,
  })),

  on(ProductsActions.createProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Update Product
  on(ProductsActions.updateProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.updateProductSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    selectedProduct: state.selectedProduct?.id === product.id ? product : state.selectedProduct,
    loading: false,
  })),

  on(ProductsActions.updateProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Delete Product
  on(ProductsActions.deleteProduct, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.deleteProductSuccess, (state, { id }) => ({
    ...state,
    products: state.products.filter((p) => p.id !== id),
    totalItems: state.totalItems - 1,
    loading: false,
  })),

  on(ProductsActions.deleteProductFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Change Product Status
  on(ProductsActions.changeProductStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(ProductsActions.changeProductStatusSuccess, (state, { product }) => ({
    ...state,
    products: state.products.map((p) => (p.id === product.id ? product : p)),
    selectedProduct: state.selectedProduct?.id === product.id ? product : state.selectedProduct,
    loading: false,
  })),

  on(ProductsActions.changeProductStatusFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Clear Selected Product
  on(ProductsActions.clearSelectedProduct, (state) => ({
    ...state,
    selectedProduct: null,
  })),

  // Clear Error
  on(ProductsActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
