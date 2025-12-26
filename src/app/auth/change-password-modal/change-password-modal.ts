import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MessageModule } from 'primeng/message';
import { Store } from '@ngrx/store';
import { AuthState } from '../store/auth.reducer';
import * as AuthActions from '../store/auth.actions';
import {
  selectAuthError,
  selectAuthLoading,
  selectMustChangePassword,
  selectUserId,
} from '../store/auth.selectors';
import { PasswordInputComponent } from '@shared/components/password-input/password-input.component';
import { CustomValidators } from '@shared/validators/custom-validators';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-change-password-modal',
  imports: [DialogModule, ReactiveFormsModule, ButtonModule, MessageModule, PasswordInputComponent],
  templateUrl: './change-password-modal.html',
  styleUrl: './change-password-modal.scss',
})
export class ChangePasswordModal {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store<AuthState>);
  public readonly userId = this.store.selectSignal(selectUserId);
  public readonly showChangePasswordModal = this.store.selectSignal(selectMustChangePassword);

  protected readonly form = this.fb.group(
    {
      currentPassword: ['', [Validators.required]],
      newPassword: [
        '',
        [Validators.required, Validators.minLength(8), CustomValidators.strongPassword],
      ],
      confirmPassword: ['', [Validators.required]],
    },
    { validators: CustomValidators.passwordMatch },
  );

  protected readonly loading = this.store.selectSignal(selectAuthLoading);
  protected readonly error = this.store.selectSignal(selectAuthError);

  protected onSubmit(): void {
    if (this.form.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.form.value;
      this.store.dispatch(
        AuthActions.changePassword({
          id: String(this.userId()),
          currentPassword: currentPassword!,
          newPassword: newPassword!,
          confirmPassword: confirmPassword!,
        }),
      );
    }
  }
}
