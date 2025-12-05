/**
 * Sales API Service - Feature-local service for Sales
 * Handles all HTTP calls to the Sales endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  AddLineItemDto,
  AssignBatchesDto,
  CreateSaleDto,
  Sale,
  SaleStatus,
  UpdateSaleDto,
  UpdateSaleStatusDto,
} from '../models/sale.model';
import { IPaginationResponse } from '@models/response.model';

@Injectable({
  providedIn: 'root',
})
export class SalesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/sales`;

  /**
   * Create a new sale
   * POST /sales
   */
  public createSale(dto: CreateSaleDto): Observable<Sale> {
    return this.http.post<Sale>(this.baseUrl, dto);
  }

  /**
   * List sales with filters
   * GET /sales
   */
  public getSales(
    status?: SaleStatus,
    customerId?: string,
    page = 1,
    limit = 10,
  ): Observable<IPaginationResponse<Sale>> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());

    if (status) {
      params = params.set('status', status);
    }
    if (customerId) {
      params = params.set('customer_id', customerId);
    }

    return this.http.get<IPaginationResponse<Sale>>(this.baseUrl, { params });
  }

  /**
   * Get sale details
   * GET /sales/{id}
   */
  public getSale(id: string): Observable<Sale> {
    return this.http.get<Sale>(`${this.baseUrl}/${id}`);
  }

  /**
   * Update sale
   * PATCH /sales/{id}
   */
  public updateSale(id: string, dto: UpdateSaleDto): Observable<Sale> {
    return this.http.patch<Sale>(`${this.baseUrl}/${id}`, dto);
  }

  /**
   * Update sale status
   * PUT /sales/{id}/status
   */
  public updateSaleStatus(id: string, dto: UpdateSaleStatusDto): Observable<Sale> {
    return this.http.put<Sale>(`${this.baseUrl}/${id}/status`, dto);
  }

  /**
   * Add line item to sale
   * POST /sales/{id}/line-items
   */
  public addLineItem(id: string, dto: AddLineItemDto): Observable<Sale> {
    return this.http.post<Sale>(`${this.baseUrl}/${id}/line-items`, dto);
  }

  /**
   * Assign batches to line item
   * PUT /sales/{id}/batches
   */
  public assignBatches(id: string, dto: AssignBatchesDto): Observable<Sale> {
    return this.http.put<Sale>(`${this.baseUrl}/${id}/batches`, dto);
  }

  /**
   * Cancel sale
   * DELETE /sales/{id}
   */
  public cancelSale(id: string): Observable<Sale> {
    return this.http.delete<Sale>(`${this.baseUrl}/${id}`);
  }
}
