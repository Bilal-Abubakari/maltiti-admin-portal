/**
 * Header Component
 * Top navigation bar with menu toggle, breadcrumbs, and user menu
 */

import { Component, output, inject, computed } from '@angular/core';
import { Store } from '@ngrx/store';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { selectUser } from '../../auth/store/auth.selectors';
import { authLogout } from '../../auth/store/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  // Output event for sidebar toggle
  toggleSidebar = output<void>();

  // User signal from store
  user = toSignal(this.store.select(selectUser));

  // User menu items
  userMenuItems = computed<MenuItem[]>(() => [
    {
      label: this.user()?.name || 'User',
      items: [
        {
          label: 'Profile',
          icon: 'pi pi-user',
          command: () => this.navigateTo('/profile'),
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: () => this.navigateTo('/settings'),
        },
        {
          separator: true,
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => this.onLogout(),
        },
      ],
    },
  ]);

  onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  onLogout(): void {
    this.store.dispatch(authLogout());
  }

  private navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
