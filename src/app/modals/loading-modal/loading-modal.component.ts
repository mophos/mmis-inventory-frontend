import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-loading-modal',
  templateUrl: './loading-modal.component.html',
  styles: []
})
export class LoadingModalComponent implements OnInit {
  opened: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    setTimeout(() => {
      this.opened = true;
    }, 500);
  }

  hide() {
    setTimeout(() => {
      this.opened = false;
    }, 500);
  }

}
