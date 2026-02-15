import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Textarea } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { FormFieldBaseComponent } from '../base/form-field-base.component';

@Component({
  selector: 'app-textarea',
  templateUrl: './textarea.component.html',
  styleUrl: '../base/form-field-base.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, Textarea, MessageModule],
})
export class TextareaComponent extends FormFieldBaseComponent {
  public readonly rows = input<number>(3);
}
