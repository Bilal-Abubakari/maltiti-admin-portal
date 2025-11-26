/**
 * Dashboard Component
 * Main dashboard overview page with key metrics and quick actions
 */

import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { selectUser } from '../auth/store/auth.selectors';
import { selectAllProducts } from '../features/products/store/products.selectors';
import { selectAllBatches } from '../features/batches/store/batches.selectors';
import * as ProductsActions from '../features/products/store/products.actions';
import * as BatchesActions from '../features/batches/store/batches.actions';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  imports: [CommonModule, RouterLink, CardModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  public readonly user = this.store.selectSignal(selectUser);
  public readonly products = this.store.selectSignal(selectAllProducts);
  public readonly batches = this.store.selectSignal(selectAllBatches);

  public ngOnInit(): void {
    // Load initial data for dashboard metrics
    this.store.dispatch(ProductsActions.loadProducts({ params: { limit: 100 } }));
    this.store.dispatch(BatchesActions.loadBatches());
  }

  public get activeProducts(): number {
    return this.products().filter((p) => p.status === 'active').length;
  }

  public get lowStockProducts(): number {
    return this.products().filter((p) => p.stockQuantity < 10).length;
  }

  public get totalBatches(): number {
    return this.batches().length;
  }
}
