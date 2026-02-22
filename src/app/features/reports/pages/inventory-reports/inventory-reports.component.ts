/**
 * Inventory Reports Component
 * Displays inventory levels, stock value, and low-stock alerts
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { TagModule } from 'primeng/tag';
import { ReportsApiService } from '../../services/reports-api.service';
import {
  InventoryQueryParams,
  InventoryReport,
  ReportQueryParams,
  StockMovementReport,
} from '../../models/report.model';
import { CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { first } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProductCategory } from '../../models/report.model';
import { DatePickerModule } from 'primeng/datepicker';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'app-inventory-reports',
  imports: [
    CardModule,
    TableModule,
    SkeletonModule,
    TagModule,
    ReactiveFormsModule,
    SelectModule,
    InputTextModule,
    ButtonModule,
    DatePickerModule,
    CurrencyPipe,
    DecimalPipe,
    DatePipe,
    CheckboxModule,
    InputNumberModule,
  ],
  templateUrl: './inventory-reports.component.html',
  styleUrl: './inventory-reports.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InventoryReportsComponent implements OnInit {
  private readonly reportsApi = inject(ReportsApiService);
  private readonly fb = inject(FormBuilder);

  public readonly isLoading = signal(false);
  public readonly inventoryReport = signal<InventoryReport | null>(null);
  public readonly stockMovementReport = signal<StockMovementReport | null>(null);

  public readonly filterForm: FormGroup = this.fb.group({
    category: [null],
    productId: [null],
    lowStockOnly: [false],
    lowStockThreshold: [100],
    fromDate: [this.getDefaultFromDate()],
    toDate: [this.getDefaultToDate()],
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

  public ngOnInit(): void {
    this.loadReport();
  }

  public onApplyFilters(): void {
    this.loadReport();
  }

  public onResetFilters(): void {
    this.filterForm.reset({
      category: null,
      productId: null,
      lowStockOnly: false,
      lowStockThreshold: 100,
      fromDate: this.getDefaultFromDate(),
      toDate: this.getDefaultToDate(),
    });
    this.loadReport();
  }

  private loadReport(): void {
    this.isLoading.set(true);

    const inventoryParams: InventoryQueryParams = {
      category: this.filterForm.value.category,
      productId: this.filterForm.value.productId,
      lowStockOnly: this.filterForm.value.lowStockOnly,
      lowStockThreshold: this.filterForm.value.lowStockThreshold,
      // Exclude fromDate and toDate for inventory report
    };

    const stockMovementParams: ReportQueryParams = {
      category: this.filterForm.value.category,
      productId: this.filterForm.value.productId,
      fromDate: this.filterForm.value.fromDate || this.getDefaultFromDate(),
      toDate: this.filterForm.value.toDate || this.getDefaultToDate(),
    };

    // Load inventory report
    this.reportsApi
      .getInventoryReport(inventoryParams)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.inventoryReport.set(report);
        },
        error: (error) => {
          console.error('Failed to load inventory report:', error);
        },
      });

    // Load stock movement report
    this.reportsApi
      .getStockMovementReport(stockMovementParams)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.stockMovementReport.set(report);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load stock movement report:', error);
          this.isLoading.set(false);
        },
      });
  }

  private getDefaultFromDate(): string {
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    return startOfYear.toISOString().split('T')[0];
  }

  private getDefaultToDate(): string {
    const currentDate = new Date();
    return currentDate.toISOString().split('T')[0];
  }
}
