import { createAction, props } from '@ngrx/store';
import { CreateCustomerDto, Customer } from '@models/customer.model';
import { IPagination } from '@models/response.model';

export const loadCustomers = createAction(
  '[Customers] Load Customers',
  props<{
    page?: number;
    limit?: number;
    search?: string;
  }>(),
);

export const loadCustomersSuccess = createAction(
  '[Customers] Load Customers Success',
  props<{ response: IPagination<Customer> }>(),
);

export const loadCustomersFailure = createAction(
  '[Customers] Load Customers Failure',
  props<{ error: string }>(),
);

export const createCustomer = createAction(
  '[Customers] Create Customer',
  props<{ customerData: CreateCustomerDto }>(),
);

export const createCustomerSuccess = createAction(
  '[Customers] Create Customer Success',
  props<{ customer: Customer }>(),
);

export const createCustomerFailure = createAction(
  '[Customers] Create Customer Failure',
  props<{ error: string }>(),
);

export const clearError = createAction('[Customers] Clear Error');
