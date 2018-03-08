import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-product-view',
  templateUrl: './transfer-product-view.component.html',
  styles: []
})
export class TransferProductViewComponent implements OnInit {

  @Input('transaction') transaction;

  loading = false;
  perPage = 10;
  transferQty = 0;
  products: any = [];
  srcRemainQty = 0;
  srcMinQty = 0;
  srcUnitName: any;
  constructor(
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getTransactionProduct();
  }

  // getTransactionProduct() {
  //   this.loading = true;
  //   this.products = this.transaction.detail;
  //   this.srcRemainQty = this.transaction.src_remain_qty || 0;
  //   this.srcUnitName = this.transaction.unit_name;
  //   this.loading = false;
  // }

  async getTransactionProduct() {
    try {
      this.loading = true;
      const transactionId = this.transaction.transaction_id;
      const genericId = this.transaction.generic_id;
      const rs: any = await this.dashboardService.getTransactionProduct(transactionId, genericId);
      if (rs.ok) {
        this.products = rs.rows;
        // this.srcMinQty = this.transaction.src_min_qty || 0;
        // this.srcRemainQty = this.transaction.src_remain_qty || 0;
        // this.srcUnitName = this.transaction.unit_name;
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
