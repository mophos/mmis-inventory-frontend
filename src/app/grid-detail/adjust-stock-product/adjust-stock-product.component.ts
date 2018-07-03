import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import * as _ from 'lodash';
@Component({
  selector: 'wm-adjust-stock-product',
  templateUrl: './adjust-stock-product.component.html',
  styles: []
})
export class AdjustStockProductComponent implements OnInit {

  products: any = [];
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  @Input('data')
  set setData(value: any) {
    this.products = value;
  }

  constructor() { }

  ngOnInit() {
  }

  onChangeQty(wmProductId, qty) {
    const idx = _.findIndex(this.products, { 'wm_product_id': wmProductId });
    if (idx > -1) {
      this.products[idx].qty = qty.value;
      this.onChange.emit(this.products);
    }
  }
}
