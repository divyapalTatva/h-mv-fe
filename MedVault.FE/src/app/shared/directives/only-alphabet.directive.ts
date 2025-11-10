import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[appOnlyAlphabet]'
})
export class OnlyAlphabetDirective {
 @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): void {
    const inputChar = event.key;
    if (!/^[a-zA-Z\s]*$/.test(inputChar)) {
      event.preventDefault();
    }
  }
}
