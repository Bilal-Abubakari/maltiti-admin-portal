/**
 * Audit Log Service
 * Handles all API calls related to audit logs
 * Uses Swagger-defined endpoints as single source of truth
 */

import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { IAuditLog, IAuditLogFilters, IAuditStatistics } from '@features/audit-logs';

@Injectable({
  providedIn: 'root',
})
export class AuditLogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/audits`;

  /**
   * Fetch audit logs with optional filters
   * Endpoint: GET /audits
   * Operation ID: AuditController_findAll
   */
  public getAuditLogs(filters?: IAuditLogFilters): Observable<IAuditLog[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.from) {
        params = params.set('from', filters.from);
      }
      if (filters.to) {
        params = params.set('to', filters.to);
      }
      if (filters.actionType) {
        params = params.set('actionType', filters.actionType);
      }
      if (filters.entityType) {
        params = params.set('entityType', filters.entityType);
      }
      if (filters.userId) {
        params = params.set('userId', filters.userId);
      }
      if (filters.role) {
        params = params.set('role', filters.role);
      }
      if (filters.page !== undefined) {
        params = params.set('page', filters.page.toString());
      }
      if (filters.limit !== undefined) {
        params = params.set('limit', filters.limit.toString());
      }
      if (filters.sortOrder) {
        params = params.set('sortOrder', filters.sortOrder);
      }
    }

    return this.http.get<IAuditLog[]>(this.baseUrl, { params });
  }

  /**
   * Fetch a single audit log by ID
   * Endpoint: GET /audits/{id}
   * Operation ID: AuditController_findOne
   */
  public getAuditLogById(id: string): Observable<IAuditLog> {
    return this.http.get<IAuditLog>(`${this.baseUrl}/${id}`);
  }

  /**
   * Fetch audit log statistics
   * Endpoint: GET /audits/stats/overview
   * Operation ID: AuditController_getStatistics
   */
  public getAuditStatistics(from?: string, to?: string): Observable<IAuditStatistics> {
    let params = new HttpParams();

    if (from) {
      params = params.set('from', from);
    }
    if (to) {
      params = params.set('to', to);
    }

    return this.http.get<IAuditStatistics>(`${this.baseUrl}/stats/overview`, { params });
  }
}
