import { createReducer, on } from '@ngrx/store';
import { Customer } from '@models/customer.model';
import {
  clearError,
  createCustomer,
  createCustomerFailure,
  createCustomerSuccess,
  loadCustomers,
  loadCustomersFailure,
  loadCustomersSuccess,
} from './customers.actions';

export interface CustomersState {
  customers: Customer[];
  loading: boolean;
  error: string | null;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  limit: number;
  search: string;
}

export const initialState: CustomersState = {
  customers: [],
  loading: false,
  error: null,
  totalItems: 0,
  currentPage: 1,
  totalPages: 0,
  limit: 20,
  search: '',
};

export const customersReducer = createReducer(
  initialState,
  on(loadCustomers, (state, { page, limit, search }) => ({
    ...state,
    loading: true,
    error: null,
    currentPage: page ?? state.currentPage,
    limit: limit ?? state.limit,
    search: search ?? state.search,
  })),
  on(loadCustomersSuccess, (state, { response }) => ({
    ...state,
    customers: response.items,
    totalItems: response.totalItems,
    currentPage: response.currentPage,
    totalPages: response.totalPages,
    loading: false,
  })),
  on(loadCustomersFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(createCustomer, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(createCustomerSuccess, (state, { customer }) => ({
    ...state,
    customers: [customer, ...state.customers],
    loading: false,
  })),
  on(createCustomerFailure, (state, { error }) => ({
    ...state,
    error,
    loading: false,
  })),
  on(clearError, (state) => ({
    ...state,
    error: null,
  })),
);
