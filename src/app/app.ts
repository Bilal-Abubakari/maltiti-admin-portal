import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { ChangePasswordModal } from './auth/change-password-modal/change-password-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastModule, ChangePasswordModal],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly title = signal('maltiti-admin-portal');
}
