/**
 * Report Filters Component
 * Reusable component for report filtering with date range, product, batch, and aggregation
 */

import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { AggregationLevel, ProductCategory, ReportQueryParams } from '../../models/report.model';

@Component({
  selector: 'app-report-filters',
  imports: [ReactiveFormsModule, ButtonModule, DatePickerModule, SelectModule, InputTextModule],
  templateUrl: './report-filters.component.html',
  styleUrl: './report-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportFiltersComponent implements OnInit {
  private readonly fb = inject(FormBuilder);

  // Inputs to configure which filters to show
  public readonly showDateRange = input<boolean>(true);
  public readonly showProduct = input<boolean>(true);
  public readonly showBatch = input<boolean>(true);
  public readonly showCategory = input<boolean>(true);
  public readonly showAggregation = input<boolean>(true);
  public readonly showTrends = input<boolean>(false);
  public readonly includeTrends = input<boolean>(false);

  // Output events
  public readonly filtersApplied = output<ReportQueryParams>();
  public readonly filtersReset = output<void>();

  public readonly isLoading = signal(false);

  public readonly filterForm: FormGroup = this.fb.group({
    fromDate: [null],
    toDate: [null],
    productId: [null],
    category: [null],
    batchId: [null],
    aggregation: ['monthly'],
    includeTrends: [false],
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

  public readonly aggregationLevels: { label: string; value: AggregationLevel }[] = [
    { label: 'Daily', value: 'daily' },
    { label: 'Weekly', value: 'weekly' },
    { label: 'Monthly', value: 'monthly' },
    { label: 'Yearly', value: 'yearly' },
  ];

  ngOnInit(): void {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    this.filterForm.patchValue({
      fromDate: startOfYear,
      toDate: currentDate,
    });
  }

  public onApplyFilters(): void {
    const formValue = this.filterForm.value;
    const params: ReportQueryParams = {};

    if (formValue.fromDate) {
      params.fromDate = this.formatDate(formValue.fromDate);
    }
    if (formValue.toDate) {
      params.toDate = this.formatDate(formValue.toDate);
    }
    if (formValue.productId) {
      params.productId = formValue.productId;
    }
    if (formValue.category) {
      params.category = formValue.category;
    }
    if (formValue.batchId) {
      params.batchId = formValue.batchId;
    }
    if (formValue.aggregation) {
      params.aggregation = formValue.aggregation;
    }
    if (this.includeTrends()) {
      params.includeTrends = formValue.includeTrends;
    }

    this.filtersApplied.emit(params);
  }

  public onResetFilters(): void {
    const currentDate = new Date();
    const startOfYear = new Date(currentDate.getFullYear(), 0, 1);
    this.filterForm.reset({
      fromDate: startOfYear,
      toDate: currentDate,
      aggregation: 'monthly',
      includeTrends: false,
    });
    this.filtersReset.emit();
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
