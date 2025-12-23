/**
 * Reports Home/Hub Component
 * Central entry point for all reports with navigation cards
 */

import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { ReportCard } from '../../models/report.model';

@Component({
  selector: 'app-reports-home',
  imports: [CardModule],
  templateUrl: './reports-home.component.html',
  styleUrl: './reports-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsHomeComponent {
  private readonly router = inject(Router);

  public readonly reportCards = signal<ReportCard[]>([
    {
      title: 'Sales Reports',
      description: 'View sales trends, revenue analysis, and sales performance metrics over time.',
      icon: 'pi pi-chart-line',
      route: '/reports/sales',
      color: '#10b981',
    },
    {
      title: 'Product Performance',
      description: 'Analyze product performance, top sellers, and revenue contribution by product.',
      icon: 'pi pi-box',
      route: '/reports/product-performance',
      color: '#3b82f6',
    },
    {
      title: 'Batch & Production',
      description: 'Track batch production volumes, utilization rates, and batch lifecycle data.',
      icon: 'pi pi-tag',
      route: '/reports/batch-production',
      color: '#f59e0b',
    },
    {
      title: 'Inventory & Stock',
      description: 'Monitor stock levels, inventory value, and identify low-stock items.',
      icon: 'pi pi-warehouse',
      route: '/reports/inventory',
      color: '#8b5cf6',
    },
    {
      title: 'Comparative Analysis',
      description: 'Compare performance across different time periods and identify trends.',
      icon: 'pi pi-arrows-h',
      route: '/reports/comparative',
      color: '#ec4899',
    },
  ]);

  public navigateToReport(route: string): void {
    void this.router.navigate([route]);
  }
}
