/**
 * Dashboard Component
 * Main dashboard overview page with key metrics and quick actions
 */

import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
// import { ChartModule } from 'primeng/chart';
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
})
export class DashboardComponent implements OnInit {
  private store = inject(Store);

  user = toSignal(this.store.select(selectUser));
  products = toSignal(this.store.select(selectAllProducts), { initialValue: [] });
  batches = toSignal(this.store.select(selectAllBatches), { initialValue: [] });

  ngOnInit(): void {
    // Load initial data for dashboard metrics
    this.store.dispatch(ProductsActions.loadProducts({ params: { limit: 100 } }));
    this.store.dispatch(BatchesActions.loadBatches());
  }

  get activeProducts(): number {
    return this.products().filter((p) => p.status === 'active').length;
  }

  get lowStockProducts(): number {
    return this.products().filter((p) => p.stockQuantity < 10).length;
  }

  get totalBatches(): number {
    return this.batches().length;
  }
}

