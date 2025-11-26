/**
 * Dashboard Layout Component
 * Main layout wrapper with sidebar, header, and content area
 * Uses Angular signals for reactive state management
 */

import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, HeaderComponent],
  templateUrl: './dashboard-layout.component.html',
  styleUrl: './dashboard-layout.component.scss',
})
export class DashboardLayoutComponent {
  // Signal for sidebar collapsed state
  sidebarCollapsed = signal(false);

  onToggleSidebar(): void {
    this.sidebarCollapsed.update((value) => !value);
  }
}
