import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { TransferService } from './../../admin/transfer.service';
import { AlertService } from 'app/alert.service';
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
    private transferService: TransferService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }

  changeQty(qty: any, idx: any, ) {
    const oldQty = +this.products[idx].product_qty;
    if ((+qty.value * this.products[idx].conversion_qty) > +this.products[idx].small_remain_qty) {
      this.alertService.error('จำนวนยืม มากว่าจำนวนคงเหลือ');
      qty.value = oldQty;
    } else {
      this.products[idx].product_qty = +qty.value;
      this.onChangeQty.emit(this.products);
    }
  }

}

