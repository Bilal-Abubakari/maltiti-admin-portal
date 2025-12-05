import { createReducer, on } from '@ngrx/store';
import { Sale, SaleStatus } from '../models/sale.model';
import * as SalesActions from './sales.actions';

export interface SalesState {
  sales: Sale[];
  currentSale: Sale | null;
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  limit: number;
  filters: {
    status?: SaleStatus;
    customerId?: string;
  };
}

export const initialState: SalesState = {
  sales: [],
  currentSale: null,
  loading: false,
  error: null,
  total: 0,
  page: 1,
  limit: 10,
  filters: {},
};

export const salesReducer = createReducer(
  initialState,
  on(SalesActions.loadSales, (state, { page, limit, status, customerId }) => ({
    ...state,
    loading: true,
    error: null,
    page: page ?? state.page,
    limit: limit ?? state.limit,
    filters: {
      status: status ?? state.filters.status,
      customerId: customerId ?? state.filters.customerId,
    },
  })),
  on(SalesActions.loadSalesSuccess, (state, { response }) => ({
    ...state,
    sales: response.data.items,
    total: response.data.totalItems,
    loading: false,
  })),
  on(SalesActions.loadSalesFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(SalesActions.loadSale, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SalesActions.loadSaleSuccess, (state, { sale }) => ({
    ...state,
    currentSale: sale,
    loading: false,
  })),
  on(SalesActions.loadSaleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(SalesActions.createSale, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SalesActions.createSaleSuccess, (state, { sale }) => ({
    ...state,
    sales: [sale, ...state.sales],
    currentSale: sale,
    loading: false,
  })),
  on(SalesActions.createSaleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(SalesActions.updateSale, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SalesActions.updateSaleSuccess, (state, { sale }) => ({
    ...state,
    sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
    currentSale: state.currentSale?.id === sale.id ? sale : state.currentSale,
    loading: false,
  })),
  on(SalesActions.updateSaleFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(SalesActions.updateSaleStatus, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(SalesActions.updateSaleStatusSuccess, (state, { sale }) => ({
    ...state,
    sales: state.sales.map((s) => (s.id === sale.id ? sale : s)),
    currentSale: state.currentSale?.id === sale.id ? sale : state.currentSale,
    loading: false,
  })),
  on(SalesActions.updateSaleStatusFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(SalesActions.clearCurrentSale, (state) => ({
    ...state,
    currentSale: null,
  })),
  on(SalesActions.clearError, (state) => ({
    ...state,
    error: null,
  })),
);
