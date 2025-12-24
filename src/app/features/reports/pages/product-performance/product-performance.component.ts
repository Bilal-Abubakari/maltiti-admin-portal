/**
 * Product Performance Component
 * Displays product performance metrics, top sellers, and revenue distribution
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { ReportFiltersComponent } from '../../components/report-filters/report-filters.component';
import { ReportsApiService } from '../../services/reports-api.service';
import {
  ProductSalesData,
  ReportQueryParams,
  RevenueDistributionReport,
} from '../../models/report.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-product-performance',
  imports: [
    CardModule,
    ChartModule,
    TableModule,
    SkeletonModule,
    ReportFiltersComponent,
    DecimalPipe,
    CurrencyPipe,
  ],
  templateUrl: './product-performance.component.html',
  styleUrl: './product-performance.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductPerformanceComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);

  public readonly isLoading = signal(false);
  public readonly topProducts = signal<ProductSalesData[]>([]);
  public readonly allProducts = signal<ProductSalesData[]>([]);
  public readonly revenueDistribution = signal<RevenueDistributionReport | null>(null);
  public readonly chartData = signal<unknown>(null);
  public readonly chartOptions = signal<unknown>(null);

  constructor() {
    this.initializeChartOptions();
  }

  public ngOnInit(): void {
    this.loadReport();
  }

  public onFiltersApplied(params: ReportQueryParams): void {
    this.loadReport(params);
  }

  public onFiltersReset(): void {
    this.loadReport();
  }

  private loadReport(params?: ReportQueryParams): void {
    this.isLoading.set(true);

    // Load top products
    this.reportsApi
      .getTopProducts({ ...params, limit: 10, sortOrder: 'DESC' })
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.topProducts.set(report.products);
        },
        error: (error) => {
          console.error('Failed to load top products:', error);
        },
      });

    // Load all products
    this.reportsApi
      .getSalesByProduct(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.allProducts.set(report.products);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load products:', error);
          this.isLoading.set(false);
        },
      });

    // Load revenue distribution
    this.reportsApi
      .getRevenueDistribution(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.revenueDistribution.set(report);
          this.updateChartData(report);
        },
        error: (error) => {
          console.error('Failed to load revenue distribution:', error);
        },
      });
  }

  private updateChartData(report: RevenueDistributionReport): void {
    if (!report.distribution || report.distribution.length === 0) {
      this.chartData.set(null);
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);

    // Take top 10 for pie chart
    const top10 = report.distribution.slice(0, 10);
    const colors = [
      documentStyle.getPropertyValue('--p-primary-500'),
      documentStyle.getPropertyValue('--p-green-500'),
      documentStyle.getPropertyValue('--p-orange-500'),
      documentStyle.getPropertyValue('--p-blue-500'),
      documentStyle.getPropertyValue('--p-purple-500'),
      documentStyle.getPropertyValue('--p-pink-500'),
      documentStyle.getPropertyValue('--p-cyan-500'),
      documentStyle.getPropertyValue('--p-teal-500'),
      documentStyle.getPropertyValue('--p-indigo-500'),
      documentStyle.getPropertyValue('--p-yellow-500'),
    ];

    this.chartData.set({
      labels: top10.map((item) => item.productName),
      datasets: [
        {
          data: top10.map((item) => item.percentageOfTotal),
          backgroundColor: colors,
          hoverBackgroundColor: colors.map((color) => color + 'CC'),
        },
      ],
    });
  }

  private initializeChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');

    this.chartOptions.set({
      plugins: {
        legend: {
          labels: {
            color: textColor,
            usePointStyle: true,
          },
          position: 'bottom',
        },
        tooltip: {
          callbacks: {
            label: (context: { label: string; parsed: number }) => {
              return `${context.label}: ${context.parsed.toFixed(2)}%`;
            },
          },
        },
      },
    });
  }
}
