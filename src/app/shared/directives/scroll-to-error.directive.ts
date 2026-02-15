import { Directive, ElementRef, inject, input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Directive({
  selector: '[appScrollToError]',
  standalone: true,
})
export class ScrollToErrorDirective implements OnInit {
  public readonly appScrollToError = input.required<FormGroup>();
  public readonly formElement = input<HTMLElement>();

  private readonly elementRef = inject(ElementRef);

  public ngOnInit(): void {
    if (this.elementRef.nativeElement.tagName === 'FORM') {
      this.elementRef.nativeElement.addEventListener('submit', this.scrollToFirstError);
    } else {
      this.elementRef.nativeElement.addEventListener('click', this.scrollToFirstError);
    }
  }

  private readonly scrollToFirstError = (): void => {
    const form = this.appScrollToError();

    if (!form?.invalid) {
      return;
    }

    // 1. Try using the explicitly provided formElement()
    const formElement = this.formElement();
    const container =
      formElement ??
      (this.elementRef.nativeElement.tagName === 'FORM'
        ? this.elementRef.nativeElement
        : this.elementRef.nativeElement.closest('form'));

    if (!container) {
      return;
    }

    const firstInvalid: HTMLElement | null = container.querySelector('.ng-invalid');

    if (firstInvalid) {
      firstInvalid.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };
}
