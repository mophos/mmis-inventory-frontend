import { Directive, Renderer, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[wmUpperCase]'
})
export class UpperCaseDirective {

  constructor(
    private renderer: Renderer,
    private el: ElementRef) { }

  @HostListener('keyup') onKeyUp() {
    this.el.nativeElement.value = this.el.nativeElement.value.toUpperCase();
  }
}
