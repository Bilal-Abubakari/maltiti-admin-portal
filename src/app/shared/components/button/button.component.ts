import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ButtonModule, Tooltip],
})
export class ButtonComponent {
  public readonly label = input<string>('');
  public readonly icon = input<string>('');
  public readonly loading = input<boolean>(false);
  public readonly disabled = input<boolean>(false);
  public readonly severity = input<
    'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast'
  >('primary');
  public readonly size = input<'small' | 'large' | undefined>(undefined);
  public readonly outlined = input<boolean>(false);
  public readonly raised = input<boolean>(false);
  public readonly rounded = input<boolean>(false);
  public readonly text = input<boolean>(false);
  public readonly plain = input<boolean>(false);
  public readonly type = input<'button' | 'submit' | 'reset'>('button');
  public readonly styleClass = input<string>('');

  public readonly tooltip = input<string>('');

  public readonly clicked = output<Event>();

  public handleClick(event: Event): void {
    this.clicked.emit(event);
  }
}
