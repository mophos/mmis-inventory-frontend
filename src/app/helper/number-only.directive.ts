import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[wmNumberOnly]'
})
export class NumberOnlyDirective {

  private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
  constructor(private el: ElementRef) { }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    let e = <KeyboardEvent>event;
    
    if ([46, 8, 9, 27, 13, 110, 190].indexOf(e.keyCode) !== -1 ||
      // Allow: Ctrl+A
      (e.keyCode == 65 && e.ctrlKey === true) ||
      // Allow: Ctrl+C
      (e.keyCode == 67 && e.ctrlKey === true) ||
      // Allow: Ctrl+V
      (e.keyCode == 86 && e.ctrlKey === true) ||
      // Allow: Ctrl+X
      (e.keyCode == 88 && e.ctrlKey === true) ||
      // Allow: home, end, left, right
      (e.keyCode >= 35 && e.keyCode <= 39) ||
      // Allow: 0-9 numpad
      (e.keyCode >= 96 && e.keyCode <= 105)) {
      // let it happen, don't do anything
      return;
    }
    let ch = String.fromCharCode(e.keyCode);
    let regEx = new RegExp(this.regex);
    if (regEx.test(ch))
      return;
    else
      e.preventDefault();
  }

  @HostListener('focus', ['$event'])
  onFocus(event: KeyboardEvent) {
    this.el.nativeElement.select();
  }

}