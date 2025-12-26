/**
 * Audit Logs List Page
 * Displays paginated audit logs with filtering and sorting
 * Super Admin Only
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';
import { AuditLogService } from '@features/audit-logs';
import { AuditFiltersComponent } from '@features/audit-logs';
import {
  AuditActionType,
  AuditEntityType,
  IAuditLog,
  IAuditLogFilters,
} from '@features/audit-logs';
import { Severity } from '@shared/models/shared.model';

interface TableColumn {
  field: string;
  header: string;
  sortable?: boolean;
}

@Component({
  selector: 'app-audit-logs-list',
  imports: [
    CommonModule,
    DatePipe,
    TableModule,
    ButtonModule,
    TagModule,
    CardModule,
    ProgressSpinnerModule,
    MessageModule,
    TooltipModule,
    AuditFiltersComponent,
  ],
  templateUrl: './audit-logs-list.component.html',
  styleUrl: './audit-logs-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogsListComponent implements OnInit {
  private readonly destroyRef = inject(DestroyRef);
  private readonly auditLogService = inject(AuditLogService);
  private readonly router = inject(Router);

  // State signals
  public readonly auditLogs = signal<IAuditLog[]>([]);
  public readonly isLoading = signal<boolean>(false);
  public readonly error = signal<string | null>(null);
  public readonly filters = signal<IAuditLogFilters>({
    page: 1,
    limit: 20,
    sortOrder: 'DESC',
  });

  // Table configuration
  public readonly columns = signal<TableColumn[]>([
    { field: 'timestamp', header: 'Timestamp', sortable: true },
    { field: 'performedByUserName', header: 'User', sortable: false },
    { field: 'performedByRole', header: 'Role', sortable: false },
    { field: 'actionType', header: 'Action', sortable: false },
    { field: 'entityType', header: 'Entity', sortable: false },
    { field: 'description', header: 'Description', sortable: false },
  ]);

  // Computed properties
  public readonly hasData = computed(() => this.auditLogs().length > 0);
  public readonly isEmpty = computed(() => !this.isLoading() && !this.hasData() && !this.error());

  public ngOnInit(): void {
    this.loadAuditLogs();
  }

  /**
   * Load audit logs with current filters
   */
  public loadAuditLogs(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.auditLogService
      .getAuditLogs(this.filters())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (logs) => {
          this.auditLogs.set(logs);
          this.isLoading.set(false);
        },
        error: (err) => {
          this.error.set(err?.error?.message || 'Failed to load audit logs');
          this.isLoading.set(false);
        },
      });
  }

  /**
   * Handle filter changes
   */
  public onFiltersChange(newFilters: IAuditLogFilters): void {
    this.filters.update((current) => ({
      ...current,
      ...newFilters,
      page: 1, // Reset to first page on filter change
    }));
    this.loadAuditLogs();
  }

  /**
   * Handle filter reset
   */
  public onFiltersReset(): void {
    this.filters.set({
      page: 1,
      limit: 20,
      sortOrder: 'DESC',
    });
    this.loadAuditLogs();
  }

  /**
   * Navigate to audit log details
   */
  public onViewDetails(auditLog: IAuditLog): void {
    void this.router.navigate(['/audit-logs', auditLog.id]);
  }

  /**
   * Handle page change
   */
  public onPageChange(event: { first: number; rows: number }): void {
    const newPage = Math.floor(event.first / event.rows) + 1;
    this.filters.update((current) => ({
      ...current,
      page: newPage,
      limit: event.rows,
    }));
    this.loadAuditLogs();
  }

  /**
   * Get severity class for action type tag
   */
  public getActionSeverity(actionType: AuditActionType): Severity {
    const actionMap: Record<string, Severity> = {
      [AuditActionType.CREATE]: 'success',
      [AuditActionType.UPDATE]: 'info',
      [AuditActionType.DELETE]: 'danger',
      [AuditActionType.LOGIN]: 'success',
      [AuditActionType.LOGOUT]: 'secondary',
      [AuditActionType.LOGIN_FAILED]: 'danger',
      [AuditActionType.PASSWORD_CHANGED]: 'warn',
      [AuditActionType.PASSWORD_RESET]: 'warn',
      [AuditActionType.ROLE_CHANGED]: 'warn',
      [AuditActionType.STATUS_CHANGED]: 'info',
    };

    return actionMap[actionType] || 'secondary';
  }

  /**
   * Get severity class for entity type tag
   */
  public getEntitySeverity(entityType: AuditEntityType): Severity {
    const entityMap: Record<string, Severity> = {
      [AuditEntityType.USER]: 'info',
      [AuditEntityType.PRODUCT]: 'success',
      [AuditEntityType.BATCH]: 'success',
      [AuditEntityType.SALE]: 'warn',
      [AuditEntityType.SYSTEM]: 'secondary',
      [AuditEntityType.AUTHENTICATION]: 'secondary',
    };

    return entityMap[entityType] || 'secondary';
  }

  /**
   * Format enum values for display
   */
  public formatEnumLabel(value: string): string {
    return value
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Truncate long text
   */
  public truncateText(text: string, maxLength = 60): string {
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}
