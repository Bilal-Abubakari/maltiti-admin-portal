/**
 * Audit Logs Feature Routes
 * Super Admin Only Access
 */

import { Routes } from '@angular/router';
import { roleGuard } from '@guards/role.guard';
import { Role } from '@models/user.model';

export const AUDIT_LOGS_ROUTES: Routes = [
  {
    path: '',
    canActivate: [roleGuard([Role.SuperAdmin])],
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/audit-logs-list/audit-logs-list.component').then(
            (m) => m.AuditLogsListComponent,
          ),
      },
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/audit-log-details/audit-log-details.component').then(
            (m) => m.AuditLogDetailsComponent,
          ),
      },
    ],
  },
];
