import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-product-view',
  templateUrl: './addition-product-view.component.html',
  styles: []
})
export class AdditionProductViewComponent implements OnInit {

  @Input('transaction') transaction;

  loading = false;
  perPage = 10;
  products: any = [];
  constructor(
    private additionService: AdditionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getTransactionProduct();
  }

  async getTransactionProduct() {
    try {
      this.loading = true;
      const transactionId = this.transaction.addition_id;
      const genericId = this.transaction.generic_id;
      const rs: any = await this.additionService.getTransactionProduct(transactionId, genericId);
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}
