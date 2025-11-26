import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
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
  public readonly id = input.required<string>();
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly feedback = input<boolean>(true);
  public readonly toggleMask = input<boolean>(true);
  public readonly styleClass = input<string>('w-full');

  public readonly value = model<string>('');
}
