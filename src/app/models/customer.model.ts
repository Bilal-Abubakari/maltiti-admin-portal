export interface Customer {
  id: string;
  name: string;
  phone?: string;
  email?: string;
  address?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCustomerDto {
  name: string;
  phone?: string;
  email?: string;
  address?: string;
}

export interface UpdateCustomerDto {
  id: string;
  name?: string;
  phone?: string;
  email?: string;
  address?: string;
}
