/**
 * Batch API Service - Feature-local service for Batches
 * Handles all HTTP calls to the Batches endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Batch, CreateBatchDto } from '../models/batch.model';

@Injectable({
  providedIn: 'root',
})
export class BatchApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/products/batches`;

  /**
   * Get all batches
   * GET /products/batches
   */
  public getAllBatches(): Observable<Batch[]> {
    return this.http.get<Batch[]>(this.baseUrl);
  }

  /**
   * Get single batch by ID with associated products
   * GET /products/batches/:id
   */
  public getBatch(id: string): Observable<Batch> {
    return this.http.get<Batch>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create new batch (Admin only)
   * POST /products/batches
   */
  public createBatch(dto: CreateBatchDto): Observable<Batch> {
    return this.http.post<Batch>(this.baseUrl, dto);
  }
}
