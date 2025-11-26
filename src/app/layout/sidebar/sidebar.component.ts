/**
 * Sidebar Component
 * Navigation sidebar with menu items and logo
 */

import { Component, input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
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
  imports: [CommonModule, RouterLink, RouterLinkActive, ButtonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  collapsed = input<boolean>(false);

  // Menu items configuration
  menuItems: MenuItem[] = [
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
