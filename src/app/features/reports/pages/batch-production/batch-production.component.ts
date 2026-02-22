/**
 * Batch Production Component
 * Displays batch production reports, utilization, and aging data
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ReportFiltersComponent } from '../../components/report-filters/report-filters.component';
import { ReportsApiService } from '../../services/reports-api.service';
import {
  BatchAgingReport,
  BatchReport,
  ReportQueryParams,
  Status,
} from '../../models/report.model';
import { DecimalPipe } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-batch-production',
  imports: [
    CardModule,
    ChartModule,
    TableModule,
    SkeletonModule,
    TagModule,
    ReportFiltersComponent,
    DecimalPipe,
  ],
  templateUrl: './batch-production.component.html',
  styleUrl: './batch-production.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchProductionComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);

  public readonly isLoading = signal(false);
  public readonly batchReport = signal<BatchReport | null>(null);
  public readonly agingReport = signal<BatchAgingReport | null>(null);
  public readonly chartData = signal<unknown>(null);
  public readonly chartOptions = signal<unknown>(null);

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

  public getUrgencySeverity(level: Status): 'success' | 'warn' | 'danger' | 'info' {
    switch (level) {
      case 'expired':
        return 'danger';
      case 'critical':
        return 'warn';
      case 'aging':
        return 'info';
      default:
        return 'success';
    }
  }

  private loadReport(params?: ReportQueryParams): void {
    this.isLoading.set(true);

    this.reportsApi
      .getBatchReport(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.batchReport.set(report);
          this.updateChartData(report);
        },
        error: (error) => {
          console.error('Failed to load batch report:', error);
        },
      });

    this.reportsApi
      .getBatchAgingReport(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.agingReport.set(report);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load aging report:', error);
          this.isLoading.set(false);
        },
      });
  }

  private updateChartData(report: BatchReport): void {
    if (!report.batches || report.batches.length === 0) {
      this.chartData.set(null);
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const top10 = report.batches.slice(0, 10);

    this.chartData.set({
      labels: top10.map((b) => b.batchNumber),
      datasets: [
        {
          label: 'Produced',
          data: top10.map((b) => b.initialQuantity),
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
        },
        {
          label: 'Sold',
          data: top10.map((b) => b.soldQuantity),
          backgroundColor: documentStyle.getPropertyValue('--p-green-500'),
        },
        {
          label: 'Remaining',
          data: top10.map((b) => b.remainingQuantity),
          backgroundColor: documentStyle.getPropertyValue('--p-orange-500'),
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
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: { color: textColor },
        },
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder },
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
    };
  }
}
