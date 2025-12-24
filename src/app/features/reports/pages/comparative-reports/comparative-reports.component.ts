/**
 * Comparative Reports Component
 * Displays period-over-period comparisons and growth metrics
 */

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { ButtonModule } from 'primeng/button';
import { SkeletonModule } from 'primeng/skeleton';
import { ReportsApiService } from '../../services/reports-api.service';
import {
  ComparativeQueryParams,
  ComparativeReport,
  ProductCategory,
} from '../../models/report.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { first } from 'rxjs';

@Component({
  selector: 'app-comparative-reports',
  imports: [
    CardModule,
    ChartModule,
    DatePickerModule,
    SelectModule,
    ButtonModule,
    SkeletonModule,
    ReactiveFormsModule,
    DecimalPipe,
    CurrencyPipe,
  ],
  templateUrl: './comparative-reports.component.html',
  styleUrl: './comparative-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ComparativeReportsComponent {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly fb = inject(FormBuilder);

  public readonly isLoading = signal(false);
  public readonly report = signal<ComparativeReport | null>(null);
  public readonly chartData = signal<unknown>(null);
  public readonly chartOptions = signal<unknown>(null);

  public readonly filterForm: FormGroup = this.fb.group({
    currentFromDate: [null, Validators.required],
    currentToDate: [null, Validators.required],
    previousFromDate: [null, Validators.required],
    previousToDate: [null, Validators.required],
    category: [null],
  });

  public readonly categories: ProductCategory[] = [
    'Shea Butter',
    'Black Soap',
    'Cosmetics',
    'Shea Soap',
    'Powdered Soap',
    'Dawadawa',
    'Essential Oils',
    'Hair Oil',
    'Grains',
    'Legumes',
    'Other',
  ];

  constructor() {
    this.initializeChartOptions();
  }

  public onApplyFilters(): void {
    if (this.filterForm.invalid) {
      return;
    }

    const formValue = this.filterForm.value;
    const params: ComparativeQueryParams = {
      currentFromDate: this.formatDate(formValue.currentFromDate),
      currentToDate: this.formatDate(formValue.currentToDate),
      previousFromDate: this.formatDate(formValue.previousFromDate),
      previousToDate: this.formatDate(formValue.previousToDate),
      category: formValue.category,
    };

    this.loadReport(params);
  }

  public onResetFilters(): void {
    this.filterForm.reset();
    this.report.set(null);
    this.chartData.set(null);
  }

  private loadReport(params: ComparativeQueryParams): void {
    this.isLoading.set(true);

    this.reportsApi
      .getComparativeReport(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.report.set(report);
          this.updateChartData(report);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load comparative report:', error);
          this.isLoading.set(false);
        },
      });
  }

  private updateChartData(report: ComparativeReport): void {
    const documentStyle = getComputedStyle(document.documentElement);

    this.chartData.set({
      labels: ['Revenue', 'Sales Count', 'Avg Order Value'],
      datasets: [
        {
          label: 'Previous Period',
          data: [
            report.previousPeriod.revenue,
            report.previousPeriod.salesCount,
            report.previousPeriod.averageOrderValue,
          ],
          backgroundColor: documentStyle.getPropertyValue('--p-surface-400'),
        },
        {
          label: 'Current Period',
          data: [
            report.currentPeriod.revenue,
            report.currentPeriod.salesCount,
            report.currentPeriod.averageOrderValue,
          ],
          backgroundColor: documentStyle.getPropertyValue('--p-primary-500'),
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

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
