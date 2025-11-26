/**
 * Batches List Page Component
 * Main page for displaying and managing product batches
 * Uses Angular signals for reactive state management
 */

import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';
import { CardModule } from 'primeng/card';

// Store
import * as BatchesActions from '../../store/batches.actions';
import { selectAllBatches, selectBatchesLoading } from '../../store/batches.selectors';

// Models
import { Batch } from '../../models/batch.model';

@Component({
  selector: 'app-batches-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    DialogModule,
    TooltipModule,
    SkeletonModule,
    CardModule,
  ],
  templateUrl: './batches-list.component.html',
  styleUrl: './batches-list.component.scss',
})
export class BatchesListComponent implements OnInit {
  private store = inject(Store);

  // Store signals
  batches = toSignal(this.store.select(selectAllBatches), { initialValue: [] });
  loading = toSignal(this.store.select(selectBatchesLoading), { initialValue: false });

  // Dialog signals
  showBatchDialog = signal(false);
  selectedBatch = signal<Batch | null>(null);

  ngOnInit(): void {
    this.loadBatches();
  }

  loadBatches(): void {
    this.store.dispatch(BatchesActions.loadBatches());
  }

  onCreateBatch(): void {
    this.selectedBatch.set(null);
    this.showBatchDialog.set(true);
  }

  onViewBatch(batch: Batch): void {
    this.store.dispatch(BatchesActions.loadBatch({ id: batch.id }));
    this.selectedBatch.set(batch);
  }

  formatDate(dateString: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  getQualityStatusSeverity(status?: string): 'success' | 'warn' | 'danger' | 'info' {
    if (!status) return 'info';
    const lowerStatus = status.toLowerCase();
    if (lowerStatus.includes('pass')) return 'success';
    if (lowerStatus.includes('pending')) return 'warn';
    if (lowerStatus.includes('fail')) return 'danger';
    return 'info';
  }
}
