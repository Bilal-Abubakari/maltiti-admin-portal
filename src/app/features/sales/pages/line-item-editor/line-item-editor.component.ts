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
  effect,
  inject,
  input,
  OnInit,
  output,
  Signal,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { CardModule } from 'primeng/card';
import { MessageService } from 'primeng/api';
import { RadioButtonModule } from 'primeng/radiobutton';
import { SaleLineItemDto } from '../../models/sale.model';
import { ButtonComponent } from '@shared/components/button/button.component';
import { NumberInputComponent } from '@shared/components/number-input/number-input.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { LightProduct } from '../../../products/models/product.model';
import { Batch } from '../../../batches/models/batch.model';
import { TooltipModule } from 'primeng/tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { BatchApiService } from '../../../batches/services/batch-api.service';
import { combineLatest, EMPTY, merge, Subject, switchMap } from 'rxjs';
import { Message } from 'primeng/message';
import { filter, map, startWith } from 'rxjs/operators';
import { productName } from '@shared/utils/product-name';

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
    Message,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class LineItemEditorComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly messageService = inject(MessageService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly batchApiService = inject(BatchApiService);
  private readonly availableBatches = signal<Batch[]>([]);
  private readonly allocationBehavior = new Subject<void>();
  public readonly lineItem = input<SaleLineItemDto | null>(null);
  public readonly products = input<LightProduct[]>([]);
  public readonly isBatchRequired = input<boolean>(false);
  public readonly lineItemChange = output<SaleLineItemDto>();
  public readonly remove = output<void>();
  public readonly validationError = output<boolean>();

  public lineItemForm = this.fb.group({
    productId: ['', Validators.required],
    requestedQuantity: [1, [Validators.required, Validators.min(1)]],
    customPrice: [undefined as number | undefined, Validators.min(0)],
    finalPrice: [undefined as number | undefined, Validators.min(0)],
    priceType: ['wholesale' as PriceType],
  });

  public readonly productId = toSignal(this.lineItemForm.controls.productId.valueChanges, {
    initialValue: null,
  });
  public readonly selectedProduct: Signal<LightProduct | null> = computed(() => {
    return this.products().find((p) => p.id === this.productId()) || null;
  });
  public readonly totalAllocatedQuantity = computed(
    () =>
      this.lineItem()
        ?.batchAllocations?.map(({ quantity }) => quantity)
        .reduce((a, b) => a + b, 0) ?? 0,
  );
  public readonly batchOptions = computed(() =>
    this.availableBatches().map((b) => ({ label: b.batchNumber, value: b.id })),
  );
  public priceType: PriceType = 'wholesale';
  public readonly batchControls = signal(new Map<number, FormControl<string | null>>());
  public readonly quantityControls = signal(new Map<number, FormControl<number | null>>());

  constructor() {
    effect(() => this.validateBatchAllocations());
    this.lineItemForm
      .get('productId')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((productId) => productId && this.onProductChange(String(productId)));
    this.lineItemForm
      .get('requestedQuantity')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.validateBatchAllocations());
    this.lineItemForm
      .get('priceType')
      ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((priceType) => this.onPriceTypeChange(priceType as PriceType));
  }

  public ngOnInit(): void {
    this.setUpBatchAllocationChanges();
    if (this.lineItem()) {
      this.loadLineItem(this.lineItem()!);
    }
    this.validateBatchAllocations();
  }

  private loadLineItem(item: SaleLineItemDto): void {
    this.lineItemForm.patchValue({
      productId: item.productId,
      requestedQuantity: item.requestedQuantity,
      customPrice: item.customPrice ? Number(item.customPrice) : undefined,
      finalPrice: item.finalPrice ? Number(item.finalPrice) : undefined,
      priceType: 'retail', // Default to wholesale
    });

    const selectedProduct = this.selectedProduct();
    if (selectedProduct) {
      this.loadBatchesForProduct(selectedProduct.id);
    }

    if (item.batchAllocations && item.batchAllocations.length > 0) {
      this.batchControls.update((batchMap) => {
        const newMap = new Map(batchMap);
        newMap.clear();
        item.batchAllocations.forEach((allocation, index) => {
          const batchControl = new FormControl(allocation.batchId, {
            validators: Validators.required,
          });
          newMap.set(index, batchControl);
        });
        return newMap;
      });

      this.quantityControls.update((quantityMap) => {
        const newMap = new Map(quantityMap);
        newMap.clear();
        item.batchAllocations.forEach((allocation, index) => {
          const quantityControl = new FormControl(allocation.quantity, {
            validators: Validators.required,
          });
          newMap.set(index, quantityControl);
        });
        return newMap;
      });

      this.allocationBehavior.next();
    }
  }

  private onProductChange(productId: string): void {
    const selectedProduct = this.selectedProduct();
    if (productId) {
      this.loadBatchesForProduct(productId);
    }
    if (selectedProduct && !this.lineItemForm.get('customPrice')?.value) {
      const priceType = this.lineItemForm.get('priceType')?.value || 'wholesale';
      const price = priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
      this.lineItemForm.patchValue({ customPrice: price });
    } else if (!selectedProduct) {
      this.availableBatches.set([]);
    }
    this.emitChange();
  }

  private loadBatchesForProduct(productId: string): void {
    if (!productId) {
      return;
    }
    this.batchApiService
      .getBatchesByProduct(productId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ data }) => {
          this.availableBatches.set(data);
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load batches for product',
          });
          this.availableBatches.set([]);
        },
      });
  }

  private onPriceTypeChange(priceType: PriceType): void {
    this.priceType = priceType;
    const selectedProduct = this.selectedProduct();
    if (selectedProduct) {
      const price = priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
      this.lineItemForm.patchValue({ customPrice: price });
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
    this.batchControls.update((batchMap) => {
      const newMap = new Map(batchMap);
      newMap.set(newMap.size, new FormControl('', { validators: Validators.required }));
      return newMap;
    });
    this.quantityControls.update((quantityMap) => {
      const newMap = new Map(quantityMap);
      newMap.set(newMap.size, new FormControl(null, { validators: Validators.required }));
      return newMap;
    });
    this.allocationBehavior.next();
  }

  public removeBatchAllocation(index: number): void {
    const currentAllocations = [...(this.lineItem()?.batchAllocations || [])];
    currentAllocations.splice(index, 1);

    this.reindexControlMaps(index);

    const updatedItem: SaleLineItemDto = {
      ...(this.lineItemForm.value as SaleLineItemDto),
      batchAllocations: currentAllocations,
    };
    this.lineItemChange.emit(updatedItem);
    this.validateBatchAllocations();
  }

  private setUpBatchAllocationChanges(): void {
    this.allocationBehavior
      .pipe(
        switchMap(() => {
          const streams = Array.from(this.batchControls().entries()).map((_, batchIndex) => {
            const quantityControl = this.quantityControls().get(batchIndex);
            const batchControl = this.batchControls().get(batchIndex);

            if (!quantityControl || !batchControl) {
              return EMPTY;
            }

            return combineLatest([
              quantityControl.valueChanges.pipe(startWith(quantityControl.value)),
              batchControl.valueChanges.pipe(startWith(batchControl.value)),
            ]).pipe(
              filter(([quantity, batchId]) => !!quantity && !!batchId),
              map(([quantity, batchId]) => ({ quantity, batchId })),
            );
          });

          return merge(...streams);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(({ quantity, batchId }) => {
        this.updateBatchAllocations(quantity!, batchId!);
      });
  }

  private updateBatchAllocations(quantity: number, batchId: string): void {
    const currentAllocations = this.lineItem()?.batchAllocations ?? [];
    const allocationIndex = currentAllocations.findIndex((a) => a.batchId === batchId);

    const updatedAllocations =
      allocationIndex > -1
        ? currentAllocations.map((a, i) => (i === allocationIndex ? { ...a, quantity } : a))
        : [...currentAllocations, { batchId, quantity }];

    this.lineItemChange.emit({
      ...(this.lineItemForm.value as SaleLineItemDto),
      batchAllocations: updatedAllocations,
    });
    this.validateBatchAllocations();
  }

  private reindexControlMaps(removedIndex: number): void {
    const reindexMap = <T>(controlMap: Map<number, T>): Map<number, T> => {
      const result = new Map<number, T>();
      controlMap.forEach((value, key) => {
        if (key < removedIndex) {
          result.set(key, value);
        } else if (key > removedIndex) {
          result.set(key - 1, value);
        }
      });
      return result;
    };
    this.batchControls.update((controls) => reindexMap(controls));
    this.quantityControls.update((controls) => reindexMap(controls));
  }

  private validateBatchAllocations(): void {
    const requestedQuantity = this.lineItemForm.get('requestedQuantity')?.value || 0;
    const totalAllocated = this.totalAllocatedQuantity();
    const quantityControl = this.lineItemForm.get('requestedQuantity') as FormControl;
    let hasError = false;

    if (this.isBatchRequired()) {
      if (totalAllocated > requestedQuantity) {
        quantityControl?.setErrors({ batchOverAllocated: true });
        hasError = true;
      } else if (totalAllocated === requestedQuantity) {
        this.clearBatchErrors(quantityControl);
      } else {
        quantityControl?.setErrors({ batchAllocationMismatch: true });
        hasError = true;
      }
    } else {
      this.clearBatchErrors(quantityControl);
    }
    this.validationError.emit(hasError);
  }

  private clearBatchErrors(control: FormControl | null): void {
    const errors = control?.errors;
    if (errors) {
      delete errors['batchAllocationMismatch'];
      delete errors['batchOverAllocated'];
      control?.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  public getTotalPrice(): number {
    const quantity = this.lineItemForm.get('requestedQuantity')?.value || 0;
    const customPrice = this.lineItemForm.get('customPrice')?.value;
    const selectedProduct = this.selectedProduct();
    let price = customPrice || 0;
    if (!customPrice && selectedProduct) {
      const priceType = this.lineItemForm.get('priceType')?.value || 'wholesale';
      price = priceType === 'wholesale' ? selectedProduct.wholesale : selectedProduct.retail;
    }
    return quantity * price;
  }

  private emitChange(): void {
    if (!this.lineItemForm.valid) {
      return;
    }
    const lineItemForm = this.lineItemForm.value as SaleLineItemDto & { priceType?: PriceType };
    delete lineItemForm.priceType;
    const lineItem: SaleLineItemDto = {
      ...lineItemForm,
      batchAllocations: this.lineItem()?.batchAllocations || [],
    };
    this.lineItemChange.emit(lineItem);
  }

  public onRemove(): void {
    this.remove.emit();
  }

  public getBatchControl(index: number): FormControl {
    const control = this.batchControls().get(index);
    return control || new FormControl('', { nonNullable: true });
  }

  public getQuantityControl(index: number): FormControl {
    const control = this.quantityControls().get(index);
    return control || new FormControl(1, { nonNullable: true });
  }

  public getBatchInfo(
    batchId: string,
  ): { availableQuantity: number; expiryDate: string | null } | null {
    const batch = this.availableBatches().find((b) => b.id === batchId);
    if (!batch) {
      return null;
    }
    return {
      availableQuantity: batch.quantity,
      expiryDate: batch.expiryDate || null,
    };
  }

  public get productOptions(): { label: string; value: string }[] {
    return this.products().map((product) => ({ label: productName(product), value: product.id }));
  }
}
