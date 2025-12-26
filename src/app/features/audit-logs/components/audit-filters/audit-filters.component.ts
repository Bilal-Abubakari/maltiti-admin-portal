/**
 * Audit Log Filters Component
 * Reusable filter controls for audit logs
 * Provides date range, action type, entity type, user, and role filters
 */

import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputTextModule } from 'primeng/inputtext';
import { SelectComponent } from '@shared/components/select/select.component';
import {
  AuditActionType,
  AuditEntityType,
  AuditUserRole,
  IAuditLogFilters,
} from '@features/audit-logs';

interface FilterForm {
  dateRange: FormControl<Date[] | null>;
  actionType: FormControl<AuditActionType | null>;
  entityType: FormControl<AuditEntityType | null>;
  userId: FormControl<string | null>;
  role: FormControl<AuditUserRole | null>;
}

@Component({
  selector: 'app-audit-filters',
  imports: [ReactiveFormsModule, DatePicker, SelectComponent, ButtonModule, InputTextModule],
  templateUrl: './audit-filters.component.html',
  styleUrl: './audit-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditFiltersComponent {
  public readonly initialFilters = input<IAuditLogFilters | null>(null);
  public readonly filtersChange = output<IAuditLogFilters>();
  public readonly resetFilters = output<void>();

  public readonly filterForm = new FormGroup<FilterForm>({
    dateRange: new FormControl(null),
    actionType: new FormControl(null),
    entityType: new FormControl(null),
    userId: new FormControl(null),
    role: new FormControl(null),
  });

  public readonly actionTypes = signal(
    Object.values(AuditActionType).map((value) => ({
      label: this.formatEnumLabel(value),
      value,
    })),
  );

  public readonly entityTypes = signal(
    Object.values(AuditEntityType).map((value) => ({
      label: this.formatEnumLabel(value),
      value,
    })),
  );

  public readonly roles = signal(
    Object.values(AuditUserRole).map((value) => ({
      label: this.capitalizeFirst(value),
      value,
    })),
  );

  constructor() {
    // Initialize form with input filters
    effect(() => {
      const filters = this.initialFilters();
      if (filters) {
        this.updateFormFromFilters(filters);
      }
    });
  }

  /**
   * Apply current filter values
   */
  public onApplyFilters(): void {
    const formValue = this.filterForm.value;
    const filters: IAuditLogFilters = {};

    if (formValue.dateRange && formValue.dateRange.length === 2) {
      filters.from = formValue.dateRange[0]?.toISOString();
      filters.to = formValue.dateRange[1]?.toISOString();
    }

    if (formValue.actionType) {
      filters.actionType = formValue.actionType;
    }

    if (formValue.entityType) {
      filters.entityType = formValue.entityType;
    }

    if (formValue.userId?.trim()) {
      filters.userId = formValue.userId.trim();
    }

    if (formValue.role) {
      filters.role = formValue.role;
    }

    this.filtersChange.emit(filters);
  }

  /**
   * Reset all filters
   */
  public onResetFilters(): void {
    this.filterForm.reset();
    this.resetFilters.emit();
  }

  /**
   * Update form from filters object
   */
  private updateFormFromFilters(filters: IAuditLogFilters): void {
    const dateRange: Date[] = [];

    if (filters.from) {
      dateRange.push(new Date(filters.from));
    }
    if (filters.to) {
      dateRange.push(new Date(filters.to));
    }

    this.filterForm.patchValue({
      dateRange: dateRange.length === 2 ? dateRange : null,
      actionType: filters.actionType || null,
      entityType: filters.entityType || null,
      userId: filters.userId || null,
      role: filters.role || null,
    });
  }

  /**
   * Format enum values for display
   */
  private formatEnumLabel(value: string): string {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Capitalize first letter
   */
  private capitalizeFirst(value: string): string {
    return value.charAt(0).toUpperCase() + value.slice(1);
  }
}
