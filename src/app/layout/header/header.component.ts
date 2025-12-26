/**
 * Header Component
 * Top navigation bar with menu toggle, breadcrumbs, and user menu
 */

import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { Store } from '@ngrx/store';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { selectUser } from '@auth/store/auth.selectors';
import { authLogout } from '@auth/store/auth.actions';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ButtonModule, MenuModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent {
  private store = inject(Store);
  private router = inject(Router);

  // Output event for sidebar toggle
  public readonly toggleSidebar = output<void>();

  // User signal from store
  public readonly user = this.store.selectSignal(selectUser);

  // User menu items
  public readonly userMenuItems = computed<MenuItem[]>(() => [
    {
      label: this.user()?.name || 'User',
      items: [
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          command: (): void => this.navigateTo('/settings'),
        },
        {
          separator: true,
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: (): void => this.onLogout(),
        },
      ],
    },
  ]);

  public onToggleSidebar(): void {
    this.toggleSidebar.emit();
  }

  public onLogout(): void {
    this.store.dispatch(authLogout());
  }

  private navigateTo(path: string): void {
    this.router.navigate([path]);
  }
}
