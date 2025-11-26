import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, InputTextModule, FloatLabelModule],
})
export class InputComponent {
  public readonly id = input.required<string>();
  public readonly label = input<string>('');
  public readonly type = input<'text' | 'password' | 'email' | 'number' | 'tel'>('text');
  public readonly placeholder = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly styleClass = input<string>('w-full');

  public readonly value = model<string>('');
}
