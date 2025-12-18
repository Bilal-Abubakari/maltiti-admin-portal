/**
 * Sales Form Page Component
 * Form for creating and editing sales with customer selection, line items, and batch management
 * Uses Angular reactive forms and signals for state management
 */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Store } from '@ngrx/store';
import { signal } from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import {
  CreateSaleDto,
  Sale,
  SaleLineItemDto,
  SaleStatus,
  UpdateSaleDto,
} from '../../models/sale.model';
import { createSale, updateSale } from '../../store/sales.actions';
import { selectError, selectLoading } from '../../store/sales.selectors';
import { ButtonComponent } from '@shared/components/button/button.component';
import { LineItemEditorComponent } from '../line-item-editor/line-item-editor.component';
import { CustomerCreationModalComponent } from '../customer-creation-modal/customer-creation-modal.component';
import { SelectComponent } from '@shared/components/select/select.component';
import { CustomerSelectComponent } from '@shared/components/customer-virtual-select/customer-select.component';
import { Customer } from '@models/customer.model';
import { ProductApiService } from '@features/products/services/product-api.service';
import { LightProduct } from '@features/products/models/product.model';
import { APP_ROUTES } from '@config/routes.config';
import { map } from 'rxjs/operators';
import { lineItemsTotalPrice } from '@shared/utils/totalPriceCalculator';

@Component({
  selector: 'app-sales-form',
  standalone: true,
  templateUrl: './sales-form.component.html',
  styleUrls: ['./sales-form.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    InputNumberModule,
    DialogModule,
    ConfirmDialogModule,
    ButtonComponent,
    LineItemEditorComponent,
    CustomerCreationModalComponent,
    SelectComponent,
    CustomerSelectComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [ConfirmationService],
})
export class SalesFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);
  private readonly messageService = inject(MessageService);
  private readonly productApiService = inject(ProductApiService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly customerModal =
    viewChild.required<CustomerCreationModalComponent>('customerModal');

  // Signals
  public readonly loading = this.store.selectSignal(selectLoading);
  public readonly error = this.store.selectSignal(selectError);
  public readonly products = signal<LightProduct[]>([]);
  public readonly lineItemValidationErrors = signal<Map<number, boolean>>(new Map());
  public readonly hasLineItemErrors = signal<boolean>(false);
  // Form
  public salesForm = this.fb.group({
    line_items: this.fb.array([] as SaleLineItemDto[], Validators.minLength(1)),
  });
  public readonly totalPrice = toSignal(
    this.lineItems.valueChanges.pipe(map((items) => lineItemsTotalPrice(items))),
    { initialValue: 0 },
  );
  public customerControl = new FormControl<string>('', Validators.required);
  public statusControl = new FormControl(SaleStatus.InvoiceRequested, Validators.required);
  public isEditMode = false;
  public saleId: string | null = null;

  // Status options
  public readonly statusOptions = [
    { label: 'Invoice Requested', value: SaleStatus.InvoiceRequested },
    { label: 'Pending Payment', value: SaleStatus.PendingPayment },
    { label: 'Packaging', value: SaleStatus.Packaging },
    { label: 'In Transit', value: SaleStatus.InTransit },
    { label: 'Delivered', value: SaleStatus.Delivered },
    { label: 'Paid', value: SaleStatus.Paid },
  ];

  public ngOnInit(): void {
    this.checkEditMode();
    this.loadProducts();
  }

  public get isBatchRequired(): boolean {
    const statusValue = this.statusControl.value;
    return statusValue
      ? [
          SaleStatus.Packaging,
          SaleStatus.InTransit,
          SaleStatus.Delivered,
          SaleStatus.Paid,
        ].includes(statusValue)
      : false;
  }

  private loadProducts(): void {
    this.productApiService
      .getAllProductsSimple()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => this.products.set(response.data),
        error: () =>
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load products. Please refresh the page.',
          }),
      });
  }

  private checkEditMode(): void {
    this.saleId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.saleId;

    if (this.isEditMode && this.saleId) {
      // Sale data is already loaded by the resolver
      // Access it from route data if needed
      const resolvedSale = this.route.snapshot.data['sale'];
      if (resolvedSale) {
        this.populateForm(resolvedSale);
      }
    }
  }

  private populateForm(sale: Sale): void {
    // Set customer
    this.customerControl.setValue(sale.customer?.id || sale.customerId);

    // Set status
    this.statusControl.setValue(sale.status);

    // Clear existing line items
    this.lineItems.clear();

    // Populate line items
    sale.lineItems.forEach((item) => {
      const lineItemDto: SaleLineItemDto = {
        productId: item.productId,
        requestedQuantity: item.requestedQuantity,
        batchAllocations: item.batchAllocations || [],
        customPrice: item.customPrice,
      };
      this.lineItems.push(this.fb.control(lineItemDto));
    });
  }

  public get lineItems(): FormArray {
    return this.salesForm.controls.line_items;
  }

  public addLineItem(): void {
    const newLineItem: SaleLineItemDto = {
      productId: '',
      requestedQuantity: 1,
      batchAllocations: [],
    };
    this.lineItems.push(this.fb.control(newLineItem));
  }

  public removeLineItem(index: number): void {
    this.lineItems.removeAt(index);

    // Clear validation error for removed line item
    const errors = this.lineItemValidationErrors();
    errors.delete(index);

    // Re-index remaining errors
    const reIndexedErrors = new Map<number, boolean>();
    errors.forEach((value, key) => {
      if (key > index) {
        reIndexedErrors.set(key - 1, value);
      } else {
        reIndexedErrors.set(key, value);
      }
    });

    this.lineItemValidationErrors.set(reIndexedErrors);

    // Check if any line item has errors
    const hasAnyError = Array.from(reIndexedErrors.values()).some((error) => error);
    this.hasLineItemErrors.set(hasAnyError);
  }

  public onLineItemChange(index: number, lineItem: SaleLineItemDto): void {
    console.log('Hmm');
    this.lineItems.at(index).setValue({
      ...lineItem,
    });
  }

  public onLineItemValidationError(index: number, hasError: boolean): void {
    const errors = this.lineItemValidationErrors();
    errors.set(index, hasError);
    this.lineItemValidationErrors.set(new Map(errors));

    // Check if any line item has errors
    const hasAnyError = Array.from(errors.values()).some((error) => error);
    this.hasLineItemErrors.set(hasAnyError);
  }

  public onSubmit(): void {
    // Check for line item validation errors first
    if (this.hasLineItemErrors()) {
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail:
          'One or more line items have batch allocation errors. Please fix them before submitting.',
      });
      return;
    }

    if (this.salesForm.valid && this.customerControl.valid && this.statusControl.valid) {
      const formValue = this.salesForm.value;
      const lineItems = formValue.line_items as SaleLineItemDto[];
      if (this.isEditMode && this.saleId) {
        // Handle update
        const updateData: UpdateSaleDto = {
          customerId: String(this.customerControl.value),
          status: this.statusControl.value as SaleStatus,
          lineItems: lineItems.map((item: SaleLineItemDto) => ({
            productId: item.productId,
            requestedQuantity: item.requestedQuantity,
            batchAllocations: item.batchAllocations,
            customPrice: item.customPrice || undefined,
          })),
        };

        this.store.dispatch(updateSale({ id: this.saleId, saleData: updateData }));
      } else {
        // Handle create
        const saleData: CreateSaleDto = {
          customerId: String(this.customerControl.value),
          status: this.statusControl.value as SaleStatus,
          lineItems: lineItems.map((item: SaleLineItemDto) => ({
            productId: item.productId,
            requestedQuantity: item.requestedQuantity,
            batchAllocations: item.batchAllocations,
            customPrice: item.customPrice || undefined,
          })),
        };

        this.store.dispatch(createSale({ saleData }));
      }
    } else {
      this.salesForm.markAllAsTouched();
      this.customerControl.markAsTouched();
      this.statusControl.markAsTouched();
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
    }
  }

  public onCancel(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      header: 'Confirm Cancel',
      icon: 'pi pi-exclamation-triangle',
      accept: () => void this.router.navigate([APP_ROUTES.sales.list.fullPath]),
    });
  }

  public openCustomerDialog(): void {
    this.customerModal().open();
  }

  public onCustomerSelected(customer: Customer): void {
    this.customerControl.setValue(customer.id);
  }
}
