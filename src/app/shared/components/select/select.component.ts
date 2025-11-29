import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { MultiSelect } from 'primeng/multiselect';
import { MessageModule } from 'primeng/message';
import { FormFieldBaseComponent } from '../base/form-field-base.component';

interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrl: '../base/form-field-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Select, MultiSelect, MessageModule],
})
export class SelectComponent extends FormFieldBaseComponent {
  public readonly options = input<SelectOption[]>([]);
  public readonly showClear = input<boolean>(false);
  public readonly isMultiSelect = input<boolean>(false);
  public readonly optionLabel = input<string>('label');
  public readonly optionValue = input<string>('value');
}
