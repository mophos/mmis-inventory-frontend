import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { IssueTransactionService } from 'app/staff/issue-transaction.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-issue-product',
  templateUrl: './issue-product.component.html'
})
export class IssueProductComponent implements OnInit {

  loading = false;
  list = [];
  items: any = [];

  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input('data')
  set setData(value: any) {
    this.items = value;
  }

  constructor(private alertService: AlertService) { }

  ngOnInit() { }

  onChangeQty(qty, idx) {
    const remainQty = this.items[idx].small_remain_qty + this.items[idx].product_qty;
    if ((+qty.value) > remainQty) {
      this.items[idx].product_qty = remainQty
      this.onChange.emit(this.items);
      this.alertService.error('จำนวนตัดจ่าย มากว่าจำนวนคงเหลือ');
    } else {
      this.items[idx].product_qty = +qty.value;
      this.onChange.emit(this.items);
    }
  }

  editChangeUnit(idx: any, event: any, unitCmp: any) {
    this.items[idx].unit_generic_id = event.unit_generic_id;
    this.items[idx].conversion_qty = event.qty;
  }
}
