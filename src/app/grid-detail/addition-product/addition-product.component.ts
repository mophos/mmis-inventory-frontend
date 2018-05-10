import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-product',
  templateUrl: './addition-product.component.html',
  styles: []
})
export class AdditionProductComponent implements OnInit {

  @Input('generic') generic;
  @Output('onChangeQty') onChangeQty: EventEmitter<any> = new EventEmitter<any>();

  loading = false;
  perPage = 10;
  products: any = [];
  constructor(
    private additionService: AdditionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getDashboardProduct();
  }

  async getDashboardProduct() {
    this.loading = true;
    this.products = this.generic.detail;
    this.loading = false;
  }

  changeQty(idx: any, qty: any) {
    this.products[idx].addition_qty = +qty;
    this.onChangeQty.emit(this.products);
  }

}
