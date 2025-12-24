/**
 * Dashboard API Service
 * Handles all HTTP calls to Dashboard endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  DashboardActivity,
  DashboardActivityParams,
  DashboardAlerts,
  DashboardAlertsParams,
  DashboardHighlights,
  DashboardHighlightsParams,
  DashboardSummary,
  DashboardSummaryParams,
  DashboardTrends,
  DashboardTrendsParams,
} from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/dashboard`;

  public getSummary(params?: DashboardSummaryParams): Observable<DashboardSummary> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardSummary>(`${this.baseUrl}/summary`, { params: httpParams });
  }

  public getTrends(params?: DashboardTrendsParams): Observable<DashboardTrends> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardTrends>(`${this.baseUrl}/trends`, { params: httpParams });
  }

  public getHighlights(params?: DashboardHighlightsParams): Observable<DashboardHighlights> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardHighlights>(`${this.baseUrl}/highlights`, { params: httpParams });
  }

  public getAlerts(params?: DashboardAlertsParams): Observable<DashboardAlerts> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardAlerts>(`${this.baseUrl}/alerts`, { params: httpParams });
  }

  public getActivity(params?: DashboardActivityParams): Observable<DashboardActivity> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardActivity>(`${this.baseUrl}/activity`, { params: httpParams });
  }

  private buildHttpParams(
    params?: Record<string, string | number | boolean | undefined>,
  ): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          httpParams = httpParams.set(key, String(value));
        }
      });
    }
    return httpParams;
  }
}
