import { Component, ChangeDetectionStrategy, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, PasswordModule, FloatLabelModule],
})
export class PasswordInputComponent {
  id = input.required<string>();
  label = input<string>('');
  placeholder = input<string>('');
  disabled = input<boolean>(false);
  required = input<boolean>(false);
  feedback = input<boolean>(true);
  toggleMask = input<boolean>(true);
  styleClass = input<string>('w-full');

  value = model<string>('');
}

