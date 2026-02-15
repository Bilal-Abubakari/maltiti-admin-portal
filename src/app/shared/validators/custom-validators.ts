import { AbstractControl, ValidationErrors } from '@angular/forms';

export class CustomValidators {
  public static strongPassword(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    // At least one uppercase letter, one lowercase letter, one number, and one special character
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    const valid = pattern.test(value);
    return valid ? null : { weakPassword: true };
  }

  public static passwordMatch(group: AbstractControl): ValidationErrors | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { mismatch: true };
  }
}
