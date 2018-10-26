import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'wm-borrow-items',
  templateUrl: './borrow-items.component.html',
  styleUrls: []
})
export class BorrowItemsComponent implements OnInit {
  products: any = [];

  @Output('onChangeQty') onChangeQty: EventEmitter<any> = new EventEmitter<any>();

  @Input('products')
  set setProducts(value: any) {
    this.products = value;
  }

  loading = false;

  constructor(
  ) { }

  ngOnInit() { }

  changeQty(qty: any, idx: any, ) {
    this.products[idx].product_qty = +qty.value;
    this.onChangeQty.emit(this.products);
  }
}

