/**
 * Sales List Page Component
 * Main page for displaying and managing sales with filters, pagination, and status transitions
 * Uses Angular signals for reactive state management
 */

import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

// PrimeNG Imports
import { TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';

// Local imports
import { Store } from '@ngrx/store';
import { Sale, SaleStatus } from '../../models/sale.model';
import { loadSales, updateSaleStatus } from '../../store/sales.actions';
import {
  selectError,
  selectLimit,
  selectLoading,
  selectPage,
  selectSales,
  selectTotal,
  selectTotalPages,
} from '../../store/sales.selectors';
import { ButtonComponent } from '@shared/components/button/button.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { lineItemsTotalPrice } from '@shared/utils/totalPriceCalculator';
import { APP_ROUTES } from '@config/routes.config';

@Component({
  selector: 'app-sales-list',
  standalone: true,
  templateUrl: './sales-list.component.html',
  styleUrls: ['./sales-list.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    ConfirmDialogModule,
    TooltipModule,
    MenuModule,
    ButtonComponent,
    SelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class SalesListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly router = inject(Router);
  private readonly confirmationService = inject(ConfirmationService);

  // Signals from store
  public readonly sales = this.store.selectSignal(selectSales);
  public readonly loading = this.store.selectSignal(selectLoading);
  public readonly error = this.store.selectSignal(selectError);
  public readonly total = this.store.selectSignal(selectTotal);
  public readonly page = this.store.selectSignal(selectPage);
  public readonly limit = this.store.selectSignal(selectLimit);
  public readonly totalPages = this.store.selectSignal(selectTotalPages);
  public readonly menuItems = signal<MenuItem[]>([]);

  // Local state
  public readonly statusOptions = [
    { label: 'All Statuses', value: null },
    { label: 'Invoice Requested', value: SaleStatus.InvoiceRequested },
    { label: 'Pending Payment', value: SaleStatus.PendingPayment },
    { label: 'Paid', value: SaleStatus.Paid },
    { label: 'Packaging', value: SaleStatus.Packaging },
    { label: 'In Transit', value: SaleStatus.InTransit },
    { label: 'Delivered', value: SaleStatus.Delivered },
  ];

  public statusFilterControl = new FormControl<SaleStatus | null>(null);

  public selectedStatus: SaleStatus | null = null;

  public ngOnInit(): void {
    this.loadSales();
    // Subscribe to status filter changes
    this.statusFilterControl.valueChanges.subscribe((status) => {
      this.onStatusFilterChange(status);
    });
  }

  public onStatusFilterChange(status: SaleStatus | null): void {
    this.selectedStatus = status;
    this.loadSales({ status: status ?? undefined, page: 1 });
  }

  public onPageChange(event: TablePageEvent): void {
    const page = event.first / event.rows + 1;
    this.loadSales({ page });
  }

  public onCreateSale(): void {
    void this.router.navigate([APP_ROUTES.sales.create.fullPath]);
  }

  public onEditSale(sale: Sale): void {
    console.log('Hey there');
    void this.router.navigate([APP_ROUTES.sales.edit(sale.id)]);
  }

  public onUpdateStatus(sale: Sale, newStatus: SaleStatus): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to change the status to ${newStatus.replace('_', ' ')}?`,
      header: 'Confirm Status Change',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.store.dispatch(updateSaleStatus({ id: sale.id, status: newStatus }));
      },
    });
  }

  public getStatusSeverity(status: SaleStatus): 'success' | 'info' | 'warn' | 'danger' {
    switch (status) {
      case SaleStatus.Delivered:
      case SaleStatus.Paid:
        return 'success';
      case SaleStatus.InTransit:
      case SaleStatus.Packaging:
        return 'info';
      case SaleStatus.PendingPayment:
        return 'warn';
      case SaleStatus.InvoiceRequested:
        return 'danger';
      default:
        return 'info';
    }
  }

  public getStatusLabel(status: SaleStatus): string {
    return status.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  }

  public getNextStatuses(currentStatus: SaleStatus): SaleStatus[] {
    // Define allowed transitions
    const transitions: Record<SaleStatus, SaleStatus[]> = {
      [SaleStatus.InvoiceRequested]: [SaleStatus.PendingPayment],
      [SaleStatus.PendingPayment]: [SaleStatus.Paid, SaleStatus.Packaging],
      [SaleStatus.Packaging]: [SaleStatus.InTransit],
      [SaleStatus.InTransit]: [SaleStatus.Delivered],
      [SaleStatus.Delivered]: [SaleStatus.Paid],
      [SaleStatus.Paid]: [], // Final state
    };
    return transitions[currentStatus] || [];
  }

  public getActionMenuItems(sale: Sale): void {
    const statusItems: MenuItem[] = [];

    // Add status change options
    const nextStatuses = this.getNextStatuses(sale.status);
    if (nextStatuses.length > 0) {
      statusItems.push({ separator: true });
      statusItems.push({
        label: 'Change Status',
        icon: 'pi pi-refresh',
        items: nextStatuses.map((status) => ({
          label: this.getStatusLabel(status),
          command: (): void => this.onUpdateStatus(sale, status),
        })),
      });
    }

    const menuItems: MenuItem[] = [
      {
        label: 'Actions',
        items: [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: (): void => this.onEditSale(sale),
          },
        ],
      },
      ...statusItems,
    ];
    this.menuItems.set(menuItems);
  }

  private loadSales(params?: { status?: SaleStatus; page?: number }): void {
    this.store.dispatch(
      loadSales({
        status: params?.status ?? this.selectedStatus ?? undefined,
        page: params?.page ?? 1,
        limit: 10,
      }),
    );
  }

  protected readonly lineItemsTotalPrice = lineItemsTotalPrice;
}
