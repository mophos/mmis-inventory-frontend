import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'wm-stockcard',
  templateUrl: './stockcard.component.html',
  styles: []
})
export class StockcardComponent implements OnInit {

  perPage = 20;
  items: any = [];
  isOpenSearchReceive = false;

  constructor() { }

  ngOnInit() {
  }

  showSearchReceive() {
    this.isOpenSearchReceive = true;
  }

}
