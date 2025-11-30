/**
 * Users List Page Component
 * Main page for displaying and managing users with filters, search, and CRUD operations
 * Uses Angular signals for reactive state management
 * Accessible only to superadmin role
 */

import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { debounceTime, startWith } from 'rxjs/operators';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ConfirmationService } from 'primeng/api';
import { TooltipModule } from 'primeng/tooltip';
import { SkeletonModule } from 'primeng/skeleton';

// Store
import * as UsersActions from '../../store/users.actions';
import { selectAllUsers, selectUsersLoading } from '../../store/users.selectors';
import { selectUser } from '../../../../auth/store/auth.selectors';

import { Role, Status, User } from '../../../../models/user.model';
import { InputComponent } from '../../../../shared/components/input/input.component';
import { ButtonComponent } from '../../../../shared/components/button/button.component';
import { SelectComponent } from '../../../../shared/components/select/select.component';
import { InviteAdminDialogComponent } from '../invite-admin-dialog/invite-admin-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    TagModule,
    ConfirmDialogModule,
    DialogModule,
    TooltipModule,
    SkeletonModule,
    InputComponent,
    ButtonComponent,
    SelectComponent,
    InviteAdminDialogComponent,
  ],
  providers: [ConfirmationService],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent {
  private readonly store = inject(Store);
  private readonly confirmationService = inject(ConfirmationService);

  // Store signals
  public readonly users = this.store.selectSignal(selectAllUsers);
  public readonly loading = this.store.selectSignal(selectUsersLoading);
  public readonly currentUser = this.store.selectSignal(selectUser);

  public searchControl = new FormControl('');

  public readonly searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(1000)),
    { initialValue: '' },
  );

  // Filter controls
  public roleControl = new FormControl<Role | null>(null);
  public statusControl = new FormControl<Status | null>(null);

  public readonly role = toSignal(this.roleControl.valueChanges.pipe(startWith(null)), {
    initialValue: null,
  });

  public readonly status = toSignal(this.statusControl.valueChanges.pipe(startWith(null)), {
    initialValue: null,
  });

  public readonly reloadTrigger = signal(0);

  // Dialog signals
  public readonly showInviteAdminDialog = signal(false);

  public roleOptions = [
    { label: 'All Roles', value: null },
    { label: 'Admin', value: 'admin' },
    { label: 'User', value: 'user' },
  ];

  public statusOptions = [
    { label: 'All Status', value: null },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
    { label: 'Suspended', value: 'suspended' },
  ];

  // Filtered users
  public readonly filteredUsers = computed(() => {
    let filtered = this.users();

    const term = this.searchTerm();
    if (term) {
      const lowerTerm = term.toLowerCase();
      filtered = filtered.filter(
        (user: User) =>
          user.name.toLowerCase().includes(lowerTerm) ||
          user.email.toLowerCase().includes(lowerTerm) ||
          user.phoneNumber?.toLowerCase().includes(lowerTerm),
      );
    }

    if (this.role()) {
      filtered = filtered.filter((user: User) => user.userType === this.role());
    }

    if (this.status()) {
      filtered = filtered.filter((user: User) => user.status === this.status());
    }

    return filtered;
  });

  public readonly isSuperAdmin = computed(() => this.currentUser()?.userType === 'superadmin');

  constructor() {
    effect(() => {
      this.reloadTrigger(); // Trigger reload
      this.store.dispatch(UsersActions.loadUsers());
    });
  }

  public onSearch(): void {
    // Trigger recomputation
    this.reloadTrigger.set(this.reloadTrigger() + 1);
  }

  public onInviteAdmin(): void {
    this.showInviteAdminDialog.set(true);
  }

  public onEditUser(user: User): void {
    console.log('Edit user:', user);
  }

  public onDeleteUser(user: User): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete "${user.name}"?`,
      header: 'Confirm Delete',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: 'p-button-danger',
      accept: () => {
        this.store.dispatch(UsersActions.deleteUser({ id: user.id }));
      },
    });
  }

  public onChangeStatus(user: User): void {
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    this.store.dispatch(UsersActions.changeUserStatus({ id: user.id, status: newStatus }));
  }

  public onChangeRole(user: User): void {
    const newRole = user.userType === 'admin' ? 'user' : 'admin';
    this.store.dispatch(UsersActions.changeUserRole({ id: user.id, role: newRole }));
  }

  public onAdminInvited(): void {
    this.showInviteAdminDialog.set(false);
    this.reloadTrigger.set(this.reloadTrigger() + 1);
  }

  public getStatusSeverity(status: Status): 'success' | 'warn' | 'danger' | 'secondary' {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warn';
      case 'suspended':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  public getRoleSeverity(role: Role): 'success' | 'info' | 'secondary' {
    switch (role) {
      case 'admin':
        return 'success';
      case 'user':
        return 'info';
      default:
        return 'secondary';
    }
  }
}
