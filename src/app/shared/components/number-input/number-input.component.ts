import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageModule } from 'primeng/message';
import { FormFieldBaseComponent } from '../base/form-field-base.component';

@Component({
  selector: 'app-number-input',
  templateUrl: './number-input.component.html',
  styleUrl: '../base/form-field-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, InputNumberModule, MessageModule],
})
export class NumberInputComponent extends FormFieldBaseComponent {
  public readonly currency = input<string>('USD');
  public readonly locale = input<string>('en-US');
  public readonly max = input<number | undefined>(undefined);
  public readonly min = input<number | undefined>(undefined);
  public readonly mode = input<'decimal' | 'currency'>('decimal');
  public readonly prefix = input<string>('');
  public readonly suffix = input<string>('');
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly required = input<boolean>(false);
}
