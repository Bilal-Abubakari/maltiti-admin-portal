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
import { InventoryQueryParams, InventoryReport } from '../../models/report.model';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { first } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectModule } from 'primeng/select';
import { CheckboxModule } from 'primeng/checkbox';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProductCategory } from '../../models/report.model';

@Component({
  selector: 'app-inventory-reports',
  imports: [
    CardModule,
    TableModule,
    SkeletonModule,
    TagModule,
    ReactiveFormsModule,
    SelectModule,
    CheckboxModule,
    InputNumberModule,
    InputTextModule,
    ButtonModule,
    DecimalPipe,
    CurrencyPipe,
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

  public readonly filterForm: FormGroup = this.fb.group({
    category: [null],
    productId: [null],
    lowStockOnly: [false],
    lowStockThreshold: [100],
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
    const params: InventoryQueryParams = {
      ...this.filterForm.value,
    };
    this.loadReport(params);
  }

  public onResetFilters(): void {
    this.filterForm.reset({
      lowStockOnly: false,
      lowStockThreshold: 100,
    });
    this.loadReport();
  }

  private loadReport(params?: InventoryQueryParams): void {
    this.isLoading.set(true);

    this.reportsApi
      .getInventoryReport(params)
      .pipe(first())
      .subscribe({
        next: (report) => {
          this.inventoryReport.set(report);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Failed to load inventory report:', error);
          this.isLoading.set(false);
        },
      });
  }
}
