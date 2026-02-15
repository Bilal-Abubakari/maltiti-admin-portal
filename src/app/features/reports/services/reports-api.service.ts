/**
 * Reports API Service
 * Handles all HTTP calls to the Reports endpoints
 * Based on Swagger API documentation
 */

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  BatchAgingReport,
  BatchReport,
  ComparativeQueryParams,
  ComparativeReport,
  DashboardSummary,
  InventoryQueryParams,
  InventoryReport,
  ReportQueryParams,
  RevenueDistributionReport,
  SalesByCategoryReport,
  SalesByProductReport,
  SalesReport,
  StockMovementReport,
  TopProductsQueryParams,
  TopProductsReport,
} from '../models/report.model';

@Injectable({
  providedIn: 'root',
})
export class ReportsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/reports`;

  /**
   * Get comprehensive sales report
   * GET /reports/sales
   */
  public getSalesReport(params?: ReportQueryParams): Observable<SalesReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<SalesReport>(`${this.baseUrl}/sales`, { params: httpParams });
  }

  /**
   * Get sales breakdown by product
   * GET /reports/sales/by-product
   */
  public getSalesByProduct(params?: ReportQueryParams): Observable<SalesByProductReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<SalesByProductReport>(`${this.baseUrl}/sales/by-product`, {
      params: httpParams,
    });
  }

  /**
   * Get sales breakdown by category
   * GET /reports/sales/by-category
   */
  public getSalesByCategory(params?: ReportQueryParams): Observable<SalesByCategoryReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<SalesByCategoryReport>(`${this.baseUrl}/sales/by-category`, {
      params: httpParams,
    });
  }

  /**
   * Get top selling products
   * GET /reports/products/top
   */
  public getTopProducts(params?: TopProductsQueryParams): Observable<TopProductsReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<TopProductsReport>(`${this.baseUrl}/products/top`, {
      params: httpParams,
    });
  }

  /**
   * Get revenue distribution by product
   * GET /reports/products/revenue-distribution
   */
  public getRevenueDistribution(params?: ReportQueryParams): Observable<RevenueDistributionReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<RevenueDistributionReport>(
      `${this.baseUrl}/products/revenue-distribution`,
      {
        params: httpParams,
      },
    );
  }

  /**
   * Get batch production report
   * GET /reports/batches
   */
  public getBatchReport(params?: ReportQueryParams): Observable<BatchReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<BatchReport>(`${this.baseUrl}/batches`, { params: httpParams });
  }

  /**
   * Get batch aging and expiry report
   * GET /reports/batches/aging
   */
  public getBatchAgingReport(params?: ReportQueryParams): Observable<BatchAgingReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<BatchAgingReport>(`${this.baseUrl}/batches/aging`, {
      params: httpParams,
    });
  }

  /**
   * Get inventory report
   * GET /reports/inventory
   */
  public getInventoryReport(params?: InventoryQueryParams): Observable<InventoryReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<InventoryReport>(`${this.baseUrl}/inventory`, { params: httpParams });
  }

  /**
   * Get stock movement report
   * GET /reports/stock-movement
   */
  public getStockMovementReport(params?: ReportQueryParams): Observable<StockMovementReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<StockMovementReport>(`${this.baseUrl}/stock-movement`, {
      params: httpParams,
    });
  }

  /**
   * Get period-over-period comparison
   * GET /reports/comparative
   */
  public getComparativeReport(params: ComparativeQueryParams): Observable<ComparativeReport> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<ComparativeReport>(`${this.baseUrl}/comparative`, {
      params: httpParams,
    });
  }

  /**
   * Get dashboard summary with key metrics
   * GET /reports/dashboard-summary
   */
  public getDashboardSummary(params?: ReportQueryParams): Observable<DashboardSummary> {
    const httpParams = this.buildHttpParams(params);
    return this.http.get<DashboardSummary>(`${this.baseUrl}/dashboard-summary`, {
      params: httpParams,
    });
  }

  /**
   * Helper method to build HttpParams from query parameters
   */
  private buildHttpParams(params?: Record<string, unknown>): HttpParams {
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
