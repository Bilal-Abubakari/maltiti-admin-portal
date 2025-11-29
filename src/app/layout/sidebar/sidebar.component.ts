/**
 * Sidebar Component
 * Navigation sidebar with menu items and logo
 */

import { ChangeDetectionStrategy, Component, effect, input, output, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Drawer } from 'primeng/drawer';
import { APP_ROUTES } from '../../config/routes.config';

interface MenuItem {
  label: string;
  icon: string;
  route: string;
  badge?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, Drawer, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent {
  public visible = false;
  public readonly isCollapsed = input<boolean>(true);
  public readonly toggleSidebar = output<void>();

  public readonly isMobile = signal(false);

  constructor() {
    effect(() => {
      this.visible = !this.isCollapsed();
    });
    effect(() => {
      const checkMobile = (): void => this.isMobile.set(window.innerWidth <= 768);
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return (): void => window.removeEventListener('resize', checkMobile);
    });
  }

  public menuItems: MenuItem[] = [
    {
      label: 'Dashboard',
      icon: 'pi pi-home',
      route: APP_ROUTES.dashboard.fullPath,
    },
    {
      label: 'Products',
      icon: 'pi pi-box',
      route: '/products',
    },
    {
      label: 'Batches',
      icon: 'pi pi-tag',
      route: '/batches',
    },
    {
      label: 'Orders',
      icon: 'pi pi-shopping-cart',
      route: '/orders',
    },
    {
      label: 'Cooperatives',
      icon: 'pi pi-users',
      route: '/cooperatives',
    },
    {
      label: 'Reports',
      icon: 'pi pi-chart-bar',
      route: '/reports',
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog',
      route: '/settings',
    },
  ];
}
