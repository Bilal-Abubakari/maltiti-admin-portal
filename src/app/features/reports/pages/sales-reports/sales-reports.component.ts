/**
 * Sales Reports Component
 * Displays sales trends, revenue analysis, and sales performance metrics
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ReportFiltersComponent } from '../../components/report-filters/report-filters.component';
import { ReportsApiService } from '../../services/reports-api.service';
import { ReportQueryParams, SalesReport, TimeSeriesDataPoint } from '../../models/report.model';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-sales-reports',
  imports: [
    CardModule,
    ChartModule,
    TableModule,
    SkeletonModule,
    ReportFiltersComponent,
    DecimalPipe,
    DatePipe,
    CurrencyPipe,
  ],
  templateUrl: './sales-reports.component.html',
  styleUrl: './sales-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesReportsComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);

  public readonly isLoading = signal(false);
  public readonly salesReport = signal<SalesReport | null>(null);
  public readonly chartData = signal<unknown>(null);
  public readonly chartOptions = signal<unknown>(null);
  public readonly tableData = signal<TimeSeriesDataPoint[]>([]);

  constructor() {
    this.initializeChartOptions();
  }

  public ngOnInit(): void {
    this.loadReport(this.getDefaultParams());
  }

  public onFiltersApplied(params: ReportQueryParams): void {
    this.loadReport(params);
  }

  public onFiltersReset(): void {
    this.loadReport(this.getDefaultParams());
  }

  private loadReport(params?: ReportQueryParams): void {
    this.isLoading.set(true);

    const queryParams: ReportQueryParams = {
      ...params,
      includeTrends: true,
    };

    this.reportsApi
      .getSalesReport(queryParams)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.salesReport.set(report);
          this.tableData.set(report.timeSeries || []);
          this.updateChartData(report);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load sales report:', error);
          this.isLoading.set(false);
        },
      });
  }

  private updateChartData(report: SalesReport): void {
    if (!report.timeSeries || report.timeSeries.length === 0) {
      this.chartData.set(null);
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);

    this.chartData.set({
      labels: report.timeSeries.map((item) => item.date),
      datasets: [
        {
          label: 'Revenue',
          data: report.timeSeries.map((item) => item.revenue),
          borderColor: documentStyle.getPropertyValue('--p-primary-color'),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-color') + '20',
          tension: 0.4,
          fill: true,
          yAxisID: 'y',
        },
        {
          label: 'Sales Count',
          data: report.timeSeries.map((item) => item.salesCount),
          borderColor: documentStyle.getPropertyValue('--p-green-500'),
          backgroundColor: documentStyle.getPropertyValue('--p-green-500') + '20',
          tension: 0.4,
          fill: true,
          yAxisID: 'y1',
        },
      ],
    });
  }

  private initializeChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-surface-border');

    this.chartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
        },
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
          },
          title: {
            display: true,
            text: 'Revenue',
            color: textColor,
          },
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            drawOnChartArea: false,
          },
          title: {
            display: true,
            text: 'Sales Count',
            color: textColor,
          },
        },
      },
    });
  }

  private getDefaultParams(): ReportQueryParams {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);

    return {
      fromDate: startOfYear.toISOString().split('T')[0],
      toDate: currentDate.toISOString().split('T')[0],
      aggregation: 'monthly',
      includeTrends: true,
    };
  }
}
