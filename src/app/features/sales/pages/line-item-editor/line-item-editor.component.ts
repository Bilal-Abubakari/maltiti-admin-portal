/**
 * Line Item Editor Component
 * Component for editing individual sale line items with batch selection and pricing
 * Handles product selection, quantity, custom pricing, and batch allocation
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

// PrimeNG Imports
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';

// Local imports
import { BatchAllocationDto, SaleLineItemDto } from '../../models/sale.model';
import { ButtonComponent } from '@shared/components/button/button.component';
import { NumberInputComponent } from '@shared/components/number-input/number-input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LightProduct } from '../../../products/models/product.model';
import { Batch } from '../../../batches/models/batch.model';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

type PriceType = 'wholesale' | 'retail';

@Component({
  selector: 'app-line-item-editor',
  standalone: true,
  templateUrl: './line-item-editor.component.html',
  styleUrls: ['./line-item-editor.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputNumberModule,
    CardModule,
    RadioButtonModule,
    ButtonComponent,
    NumberInputComponent,
    SelectComponent,
    TooltipModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class LineItemEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);

  // Inputs
  public readonly lineItem = input<SaleLineItemDto | null>(null);
  public readonly products = input<LightProduct[]>([]);
  public readonly isBatchRequired = input<boolean>(false);

  // Outputs
  public readonly lineItemChange = output<SaleLineItemDto>();
  public readonly remove = output<void>();

  // Form
  public lineItemForm = this.fb.group({
    product_id: ['', Validators.required],
    requested_quantity: [1, [Validators.required, Validators.min(1)]],
    custom_price: [undefined as number | undefined, Validators.min(0)],
    price_type: ['wholesale' as PriceType],
  });

  // Local state
  public readonly productId = toSignal(this.lineItemForm.controls.product_id.valueChanges, {
    initialValue: null,
  });
  public readonly selectedProduct: Signal<LightProduct | null> = computed(() => {
    return this.products().find((p) => p.id === this.productId()) || null;
  });
  public availableBatches: Batch[] = [];
  public totalAllocatedQuantity = 0;
  public priceType: PriceType = 'wholesale';
  private batchControls = new Map<number, FormControl>();

  constructor() {
    // Watch for product changes to load batches
    this.lineItemForm.get('product_id')?.valueChanges.subscribe((productId) => {
      this.onProductChange(String(productId));
    });

    // Watch for quantity changes to validate batch allocations
    this.lineItemForm.get('requested_quantity')?.valueChanges.subscribe(() => {
      this.validateBatchAllocations();
    });

    // Watch for price type changes to update custom price
    this.lineItemForm.get('price_type')?.valueChanges.subscribe((priceType) => {
      this.onPriceTypeChange(priceType as PriceType);
    });
  }

  public ngOnInit(): void {
    if (this.lineItem()) {
      this.loadLineItem(this.lineItem()!);
    }
  }

  private loadLineItem(item: SaleLineItemDto): void {
    this.lineItemForm.patchValue({
      product_id: item.product_id,
      requested_quantity: item.requested_quantity,
      custom_price: item.custom_price ? Number(item.custom_price) : undefined,
      price_type: 'wholesale', // Default to wholesale
    });

    const selectedProduct = this.selectedProduct();
    if (selectedProduct) {
      this.loadBatchesForProduct(selectedProduct.id);
    }
  }

  private onProductChange(productId: string): void {
    const selectedProduct = this.selectedProduct();
    if (selectedProduct) {
      // Set default price based on price type if no custom price
      if (!this.lineItemForm.get('custom_price')?.value) {
        const priceType = this.lineItemForm.get('price_type')?.value || 'wholesale';
        const price =
          priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
        this.lineItemForm.patchValue({ custom_price: price });
      }

      // Load available batches
      this.loadBatchesForProduct(productId);
    } else {
      this.availableBatches = [];
    }

    this.emitChange();
  }

  private loadBatchesForProduct(productId: string): void {
    // In real implementation, this would call batch API
    // For now, mock some batches
    console.log('Loading batches for product', productId);
    this.availableBatches = [
      {
        id: 'batch1',
        batchNumber: 'BATCH-001',
        quantity: 50,
        expiryDate: '2025-12-31',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'batch2',
        batchNumber: 'BATCH-002',
        quantity: 30,
        expiryDate: '2026-01-15',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: 'batch3',
        batchNumber: 'BATCH-003',
        quantity: 20,
        expiryDate: '2026-02-28',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  private onPriceTypeChange(priceType: PriceType): void {
    this.priceType = priceType;
    const selectedProduct = this.selectedProduct();
    if (selectedProduct) {
      const price = priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
      this.lineItemForm.patchValue({ custom_price: price });
      this.emitChange();
    }
  }

  public addBatchAllocation(): void {
    if (!this.selectedProduct) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select a product first',
      });
      return;
    }

    // const currentAllocations = this.lineItem()?.batch_allocations || [];
    // const newAllocation: BatchAllocationDto = {
    //   batch_id: '',
    //   quantity: 0,
    // };

    // const updatedItem: SaleLineItemDto = {
    //   ...this.lineItemForm.value,
    //   batch_allocations: [...currentAllocations, newAllocation],
    // };
    //
    // this.lineItemChange.emit(updatedItem);
  }

  public updateBatchAllocation(index: number, allocation: BatchAllocationDto): void {
    const currentAllocations = [...(this.lineItem()?.batch_allocations || [])];
    currentAllocations[index] = allocation;

    // const updatedItem: SaleLineItemDto = {
    //   ...this.lineItemForm.value,
    //   batch_allocations: currentAllocations,
    // };
    //
    // this.lineItemChange.emit(updatedItem);
    this.validateBatchAllocations();
  }

  public removeBatchAllocation(index: number): void {
    const currentAllocations = [...(this.lineItem()?.batch_allocations || [])];
    currentAllocations.splice(index, 1);

    // const updatedItem: SaleLineItemDto = {
    //   ...this.lineItemForm.value,
    //   batch_allocations: currentAllocations,
    // };
    //
    // this.lineItemChange.emit(updatedItem);
    this.validateBatchAllocations();
  }

  private validateBatchAllocations(): void {
    const requestedQuantity = this.lineItemForm.get('requested_quantity')?.value || 0;
    const allocations = this.lineItem()?.batch_allocations || [];
    this.totalAllocatedQuantity = allocations.reduce(
      (sum, alloc) => sum + (alloc.quantity || 0),
      0,
    );

    if (this.isBatchRequired() && this.totalAllocatedQuantity !== requestedQuantity) {
      this.lineItemForm.get('requested_quantity')?.setErrors({
        batchAllocationMismatch: true,
      });
    } else {
      const errors = this.lineItemForm.get('requested_quantity')?.errors;
      if (errors) {
        delete errors['batchAllocationMismatch'];
        this.lineItemForm
          .get('requested_quantity')
          ?.setErrors(Object.keys(errors).length ? errors : null);
      }
    }
  }

  public getAllocatedQuantityForBatch(batchId: string): number {
    return (this.lineItem()?.batch_allocations || [])
      .filter((alloc) => alloc.batch_id === batchId)
      .reduce((sum, alloc) => sum + (alloc.quantity || 0), 0);
  }

  public getRemainingQuantityForBatch(batch: Batch): number {
    const allocated = this.getAllocatedQuantityForBatch(batch.id);
    return Math.max(0, batch.quantity - allocated);
  }

  public getTotalPrice(): number {
    const quantity = this.lineItemForm.get('requested_quantity')?.value || 0;
    const customPrice = this.lineItemForm.get('custom_price')?.value;
    const selectedProduct = this.selectedProduct();

    let price = customPrice || 0;
    if (!customPrice && selectedProduct) {
      const priceType = this.lineItemForm.get('price_type')?.value || 'wholesale';
      price = priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
    }

    return quantity * price;
  }

  // public onFormChange(): void {
  //   this.emitChange();
  // }

  private emitChange(): void {
    if (this.lineItemForm.valid) {
      const lineItemForm = this.lineItemForm.value as SaleLineItemDto & { priceType?: PriceType };
      delete lineItemForm.priceType;

      const lineItem: SaleLineItemDto = {
        ...lineItemForm,
        batch_allocations: this.lineItem()?.batch_allocations || [],
      };
      this.lineItemChange.emit(lineItem);
    }
  }

  public onRemove(): void {
    this.remove.emit();
  }

  public getBatchControl(index: number): FormControl {
    const allocation = this.lineItem()?.batch_allocations?.[index];
    let control = this.batchControls.get(index);

    if (!control) {
      control = new FormControl(allocation?.batch_id || '');
      // Subscribe to value changes to update the allocation
      control.valueChanges.subscribe((value) => {
        const currentAllocation = this.lineItem()?.batch_allocations?.[index];
        if (currentAllocation) {
          this.updateBatchAllocation(index, { ...currentAllocation, batch_id: value });
        }
      });
      this.batchControls.set(index, control);
    } else {
      // Update the control value if allocation changed
      const currentBatchId = allocation?.batch_id || '';
      if (control.value !== currentBatchId) {
        control.setValue(currentBatchId, { emitEvent: false });
      }
    }

    return control;
  }

  public getBatchInfo({
    batch_id,
  }: BatchAllocationDto): { remainingQuantity: number; expiryDate: string } | null {
    if (!batch_id) {
      return null;
    }

    const batch = this.availableBatches.find(({ id }) => id === batch_id);
    if (!batch) {
      return null;
    }

    return {
      remainingQuantity: this.getRemainingQuantityForBatch(batch),
      expiryDate: batch.expiryDate || '',
    };
  }

  public getQuantityControl(index: number): FormControl {
    const allocation = this.lineItem()?.batch_allocations?.[index];
    const control = new FormControl(allocation?.quantity || 0);

    control.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((value) => {
      if (allocation) {
        this.updateBatchAllocation(index, { ...allocation, quantity: Number(value) });
      }
    });

    return control;
  }

  public getMaxQuantity(index: number): number {
    const allocation = this.lineItem()?.batch_allocations?.[index];
    if (!allocation?.batch_id) {
      return 0;
    }

    const batch = this.availableBatches.find((b) => b.id === allocation.batch_id);
    return batch ? this.getRemainingQuantityForBatch(batch) : 0;
  }

  // public get customerOptions(): { label: string; value: string }[] {
  //   return this.customers.map((c) => ({ label: c.name, value: c.id }));
  // }

  public get productOptions(): { label: string; value: string }[] {
    return this.products().map(({ id, name }) => ({ label: name, value: id }));
  }

  public get batchOptions(): { label: string; value: string }[] {
    return this.availableBatches.map((b) => ({ label: b.batchNumber, value: b.id }));
  }
}
