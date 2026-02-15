import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { MessageModule } from 'primeng/message';
import { FormFieldBaseComponent } from '../base/form-field-base.component';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: '../base/form-field-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputTextModule,
    InputNumberModule,
    FloatLabelModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    MessageModule,
  ],
})
export class InputComponent extends FormFieldBaseComponent {
  public readonly type = input<'text' | 'password' | 'email' | 'number' | 'tel' | 'search'>('text');
  public readonly disabled = input<boolean>(false);
  public readonly readonly = input<boolean>(false);
  public readonly required = input<boolean>(false);
  public readonly useInputGroup = input<boolean>(false);
  public readonly showPrefixAddon = input<boolean>(false);
  public readonly showSuffixAddon = input<boolean>(false);
}
