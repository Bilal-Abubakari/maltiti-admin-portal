/**
 * Batch Dialog Component
 * Modal dialog for creating and viewing batches
 * Uses reactive forms with validation and PrimeNG components
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { Dialog } from 'primeng/dialog';
import { Button } from 'primeng/button';
import { PrimeTemplate } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';

import * as BatchesActions from '../../store/batches.actions';
import { selectSelectedBatch } from '../../store/batches.selectors';
import { Batch, CreateBatchDto, UpdateBatchDto } from '../../models/batch.model';
import { ProductApiService } from '../../../products/services/product-api.service';
import { LightProduct } from '../../../products/models/product.model';
import { SelectComponent } from '@shared/components/select/select.component';
import { NumberInputComponent } from '@shared/components/number-input/number-input.component';
import { InputComponent } from '@shared/components/input/input.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-batch-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    Dialog,
    Button,
    PrimeTemplate,
    TableModule,
    TagModule,
    CardModule,
    SelectComponent,
    NumberInputComponent,
    InputComponent,
    TextareaComponent,
  ],
  templateUrl: './batch-dialog.component.html',
  styleUrl: './batch-dialog.component.scss',
})
export class BatchDialogComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);
  private readonly productApiService = inject(ProductApiService);

  // Inputs
  public readonly visible = input.required<boolean>();
  public readonly batch = input<Batch | null>();
  public readonly viewMode = input<boolean>(false);

  // Outputs
  public readonly visibleChange = output<boolean>();
  public readonly save = output<CreateBatchDto | UpdateBatchDto>();
  public readonly saveSuccess = output<void>();

  // Signals
  public readonly loading = signal(false);
  public readonly isEdit = computed(() => !!this.batch());
  public readonly selectedBatch = this.store.selectSignal(selectSelectedBatch);
  public readonly products = signal<LightProduct[]>([]);
  public readonly productOptions = computed(() =>
    this.products().map((product) => ({
      label: product.name,
      value: product.id,
    })),
  );

  // Form
  public readonly batchForm = this.fb.group({
    batchNumber: ['', [Validators.required]],
    productId: ['', [Validators.required]],
    quantity: [0, [Validators.required, Validators.min(1)]],
    productionDate: [''],
    expiryDate: [''],
    manufacturingLocation: [''],
    qualityCheckStatus: [''],
    notes: [''],
  });

  constructor() {
    // Load products for the dropdown
    this.productApiService.getAllProductsSimple().subscribe({
      next: (response) => {
        this.products.set(response.data);
      },
      error: (error) => {
        console.error('Failed to load products:', error);
        this.products.set([]);
      },
    });

    effect(() => {
      const batch = this.batch();
      if (batch && this.visible()) {
        this.batchForm.patchValue({
          batchNumber: batch.batchNumber,
          productId: batch.products?.[0]?.id || '',
          quantity: batch.quantity || 0,
          productionDate: batch.productionDate || '',
          expiryDate: batch.expiryDate || '',
          manufacturingLocation: batch.manufacturingLocation || '',
          qualityCheckStatus: batch.qualityCheckStatus || '',
          notes: batch.notes || '',
        });
      } else if (!batch && this.visible()) {
        this.batchForm.reset({
          quantity: 0,
        });
      }
    });

    // Listen for save success
    this.actions$
      .pipe(ofType(BatchesActions.createBatchSuccess), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Batch created successfully',
        });
        this.saveSuccess.emit();
        this.visibleChange.emit(false);
      });

    // Listen for save failure
    this.actions$
      .pipe(ofType(BatchesActions.createBatchFailure), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.loading.set(false);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create batch',
        });
      });
  }

  public onSave(): void {
    if (this.batchForm.invalid) {
      this.batchForm.markAllAsTouched();
      return;
    }

    this.loading.set(true);
    const formValue = this.batchForm.value;
    const batchData: CreateBatchDto = {
      batchNumber: formValue.batchNumber!,
      productId: formValue.productId!,
      quantity: formValue.quantity ?? 0,
      productionDate: formValue.productionDate || undefined,
      expiryDate: formValue.expiryDate || undefined,
      manufacturingLocation: formValue.manufacturingLocation || undefined,
      qualityCheckStatus: formValue.qualityCheckStatus || undefined,
      notes: formValue.notes || undefined,
    };

    this.save.emit(batchData);
  }

  public onCancel(): void {
    this.visibleChange.emit(false);
  }

  public formatDate(dateString: string): string {
    if (!dateString) {
      return 'N/A';
    }
    return new Date(dateString).toLocaleDateString('en-GB');
  }

  // public getQualityStatusSeverity(status?: string): 'success' | 'warn' | 'danger' | 'info' {
  //   if (!status) {
  //     return 'info';
  //   }
  //   const lowerStatus = status.toLowerCase();
  //   if (lowerStatus.includes('pass')) {
  //     return 'success';
  //   }
  //   if (lowerStatus.includes('pending')) {
  //     return 'warn';
  //   }
  //   if (lowerStatus.includes('fail')) {
  //     return 'danger';
  //   }
  //   return 'info';
  // }
}
