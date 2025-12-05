/**
 * Customers API Service
 * Handles all HTTP calls to the Customers endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CreateCustomerDto, Customer, UpdateCustomerDto } from '@models/customer.model';
import { IPaginationResponse } from '@models/response.model';

@Injectable({
  providedIn: 'root',
})
export class CustomersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/customers`;

  /**
   * Get all customers with pagination and optional search
   * GET /customers
   */
  public getCustomers(
    page = 1,
    limit = 10,
    search?: string,
  ): Observable<IPaginationResponse<Customer>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<IPaginationResponse<Customer>>(this.baseUrl, { params });
  }

  /**
   * Get customer by ID
   * GET /customers/{id}
   */
  public getCustomer(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new customer
   * POST /customers
   */
  public createCustomer(dto: CreateCustomerDto): Observable<Customer> {
    return this.http.post<Customer>(this.baseUrl, dto);
  }

  /**
   * Update an existing customer
   * PATCH /customers
   */
  public updateCustomer(dto: UpdateCustomerDto): Observable<Customer> {
    return this.http.patch<Customer>(this.baseUrl, dto);
  }

  /**
   * Delete a customer (soft delete)
   * DELETE /customers/{id}
   */
  public deleteCustomer(id: string): Observable<Customer> {
    return this.http.delete<Customer>(`${this.baseUrl}/${id}`);
  }
}
