import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { FloatLabelModule } from 'primeng/floatlabel';
import { MessageModule } from 'primeng/message';
import { FormFieldBaseComponent } from '../base/form-field-base.component';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrl: '../base/form-field-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, PasswordModule, FloatLabelModule, MessageModule],
})
export class PasswordInputComponent extends FormFieldBaseComponent {
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly feedback = input<boolean>(true);
  public readonly toggleMask = input<boolean>(true);
}
