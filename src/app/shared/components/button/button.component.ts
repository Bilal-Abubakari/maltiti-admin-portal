import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule],
})
export class ButtonComponent {
  label = input<string>('');
  icon = input<string>('');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  severity = input<'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'>('primary');
  size = input<'small' | 'large' | undefined>(undefined);
  outlined = input<boolean>(false);
  raised = input<boolean>(false);
  rounded = input<boolean>(false);
  text = input<boolean>(false);
  plain = input<boolean>(false);
  type = input<'button' | 'submit' | 'reset'>('button');
  styleClass = input<string>('');

  clicked = output<Event>();

  handleClick(event: Event): void {
    this.clicked.emit(event);
  }
}

