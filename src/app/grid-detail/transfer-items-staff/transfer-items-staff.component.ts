import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { TransferService } from './../../admin/transfer.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-items-staff',
  templateUrl: './transfer-items-staff.component.html',
  styles: []
})
export class TransferItemsStaffComponent implements OnInit {

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

  changeQty(qty: any, idx: any) {
    if (+qty.value > +this.products[idx].small_remain_qty) {
      this.alertService.error('จำนวนโอน มากว่าจำนวนคงเหลือ');
      this.products[idx].product_qty = '';
    } else {
      this.products[idx].product_qty = +qty.value;
      this.onChangeQty.emit(this.products);
    }
  }

}
