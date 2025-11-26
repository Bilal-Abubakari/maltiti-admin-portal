/**
 * Products List Page Component
 * Main page for displaying and managing products with filters, search, and CRUD operations
 * Uses Angular signals for reactive state management
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';

// PrimeNG Imports
import { TableModule, TablePageEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

// Store
import * as ProductsActions from '../../store/products.actions';
import {
  selectAllProducts,
  selectProductsLoading,
  selectProductsPagination,
} from '../../store/products.selectors';

import {
  Product,
  ProductCategory,
  ProductQueryParams,
  ProductStatus,
} from '../../models/product.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-products-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    Select,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule,
    SkeletonModule,
  ],
  providers: [ConfirmationService],
  templateUrl: './products-list.component.html',
  styleUrl: './products-list.component.scss',
})
export class ProductsListComponent implements OnInit {
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);

  // Store signals
  public readonly products = this.store.selectSignal(selectAllProducts);
  public readonly loading = this.store.selectSignal(selectProductsLoading);
  public readonly pagination = this.store.selectSignal(selectProductsPagination);

  // Filter signals
  public readonly searchTerm = signal('');
  public readonly selectedCategory = signal<ProductCategory | null>(null);
  public readonly selectedStatus = signal<ProductStatus | null>(null);
  private readonly currentPage = signal(1);
  public readonly pageSize = signal(10);

  // Dialog signals
  public readonly showProductDialog = signal(false);
  public readonly selectedProduct = signal<Product | null>(null);

  public categoryOptions = [
    { label: 'All Categories', value: null },
    { label: 'Shea Butter', value: 'shea_butter' },
    { label: 'Black Soap', value: 'black_soap' },
    { label: 'Cosmetics', value: 'cosmetics' },
    { label: 'Shea Soap', value: 'shea_soap' },
    { label: 'Powdered Soap', value: 'powdered_soap' },
    { label: 'Dawadawa Tea', value: 'dawadawa_tea' },
    { label: 'Essential Oils', value: 'essential_oils' },
    { label: 'Hair Oil', value: 'hair_oil' },
    { label: 'Grains', value: 'grains' },
    { label: 'Legumes', value: 'legumes' },
    { label: 'Other', value: 'other' },
  ];

  public statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Out of Stock', value: 'out_of_stock' },
    { label: 'Discontinued', value: 'discontinued' },
  ];

  // Computed query params
  public readonly queryParams = computed<ProductQueryParams>(() => ({
    page: this.currentPage(),
    limit: this.pageSize(),
    searchTerm: this.searchTerm() || undefined,
    category: this.selectedCategory() || undefined,
    status: this.selectedStatus() || undefined,
  }));

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.store.dispatch(ProductsActions.loadProducts({ params: this.queryParams() }));
  }

  onSearch(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onFilterChange(): void {
    this.currentPage.set(1);
    this.loadProducts();
  }

  onPageChange(event: TablePageEvent): void {
    console.log('Page changed:', event);
    this.currentPage.set(event.first + 1);
    this.pageSize.set(event.rows);
    this.loadProducts();
  }

  onCreateProduct(): void {
    this.selectedProduct.set(null);
    this.showProductDialog.set(true);
  }

  onEditProduct(product: Product): void {
    this.selectedProduct.set(product);
    this.showProductDialog.set(true);
  }

  onViewProduct(product: Product): void {
    this.selectedProduct.set(product);
  }

  onDeleteProduct(product: Product): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${product.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(ProductsActions.deleteProduct({ id: product.id }));
      },
    });
  }

  onToggleStatus(product: Product): void {
    this.store.dispatch(ProductsActions.changeProductStatus({ id: product.id }));
  }

  getStatusSeverity(status: ProductStatus): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warn';
      case 'out_of_stock':
        return 'danger';
      case 'discontinued':
        return 'secondary';
      default:
        return 'secondary';
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-GH', { style: 'currency', currency: 'GHS' }).format(value);
  }
}
