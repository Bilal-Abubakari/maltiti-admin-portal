/**
 * Customer Creation Modal Component
 * Modal dialog for creating new customers during sale creation
 * Uses reactive forms with validation and NgRx store
 */

import { ChangeDetectionStrategy, Component, effect, inject, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// PrimeNG Imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { MessageService } from 'primeng/api';

// Local imports
import { ButtonComponent } from '@shared/components/button/button.component';
import { InputComponent } from '@shared/components/input/input.component';
import { TextareaComponent } from '@shared/components/textarea/textarea.component';
import { CreateCustomerDto, Customer } from '@models/customer.model';
import { createCustomer, createCustomerSuccess } from '../../store/customers.actions';
import { selectError, selectLoading } from '../../store/customers.selectors';

@Component({
  selector: 'app-customer-creation-modal',
  standalone: true,
  templateUrl: './customer-creation-modal.component.html',
  styleUrls: ['./customer-creation-modal.component.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [MessageService],
})
export class CustomerCreationModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);
  private readonly actions$ = inject(Actions);
  private readonly messageService = inject(MessageService);

  // Outputs
  public readonly customerCreated = output<Customer>();

  // Signals from store
  public readonly loading = this.store.selectSignal(selectLoading);
  public readonly error = this.store.selectSignal(selectError);

  // State
  public readonly visible = signal(false);

  // Form
  public customerForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(200)]],
    phone: [''],
    email: ['', [Validators.email]],
    address: [''],
  });

  constructor() {
    // Watch for successful customer creation
    this.actions$
      .pipe(ofType(createCustomerSuccess), takeUntilDestroyed())
      .subscribe(({ customer }) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Customer created successfully',
        });
        this.customerCreated.emit(customer);
        this.close();
      });

    // Watch for errors and show messages
    effect(() => {
      const errorMessage = this.error();
      if (errorMessage) {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage,
        });
      }
    });
  }

  public open(): void {
    this.visible.set(true);
    this.customerForm.reset();
  }

  public close(): void {
    this.visible.set(false);
    this.customerForm.reset();
  }

  public onSubmit(): void {
    if (this.customerForm.valid) {
      const formValue = this.customerForm.value;
      const customerData: CreateCustomerDto = {
        name: formValue.name || '',
        phone: formValue.phone || undefined,
        email: formValue.email || undefined,
        address: formValue.address || undefined,
      };
      this.store.dispatch(createCustomer({ customerData }));
    } else {
      this.markFormGroupTouched(this.customerForm);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields',
      });
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.get(key);
      control?.markAsTouched();
    });
  }
}
