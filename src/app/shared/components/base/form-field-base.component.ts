import { computed, Directive, input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Directive()
export class FormFieldBaseComponent {
  public readonly control = input.required<FormControl>();
  public readonly id = input.required<string>();
  public readonly label = input<string>('');
  public readonly placeholder = input<string>('');
  public readonly styleClass = input<string>('');

  public readonly errorMessage = computed(() => {
    const errors = this.control()?.errors;
    if (!errors) {
      return null;
    }
    const errorKey = Object.keys(errors)[0];
    const errorValue = errors[errorKey];
    return this.getErrorMessage(errorKey, errorValue);
  });

  protected readonly ERROR_MESSAGES: Record<string, string> = {
    required: 'This field is required',
    minlength: 'Must be at least {requiredLength} characters',
    maxlength: 'Must not exceed {requiredLength} characters',
    min: 'Must be at least {min}',
    max: 'Must not exceed {max}',
    email: 'Please enter a valid email address',
    pattern: 'Please enter a valid value',
    weakPassword:
      'Password must contain at least 8 characters, 1 lowercase, 1 uppercase, 1 number, and 1 symbol',
  };

  protected getErrorMessage(key: string, value: unknown): string {
    const messageTemplate = this.ERROR_MESSAGES[key];
    if (!messageTemplate) {
      return 'Invalid value';
    }
    return messageTemplate.replace(/{(\w+)}/g, (_, k) => {
      if (typeof value === 'object' && value !== null && k in value) {
        return String((value as Record<string, unknown>)[k]);
      }
      return _;
    });
  }
}
