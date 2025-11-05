import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { TagModule } from 'primeng/tag';
import { authLogout } from '../auth/store/auth.actions';
import { selectUser } from '../auth/store/auth.selectors';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CardModule, ButtonModule, AvatarModule, TagModule],
})
export class DashboardComponent {
  private readonly store = inject(Store);

  public readonly user = this.store.selectSignal(selectUser);

  public onLogout(): void {
    this.store.dispatch(authLogout());
  }

  public getInitials(name: string): string {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  public getStatusSeverity(status: string): 'success' | 'info' | 'warn' | 'danger' {
    switch (status.toLowerCase()) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warn';
      case 'suspended':
        return 'danger';
      default:
        return 'info';
    }
  }
}

