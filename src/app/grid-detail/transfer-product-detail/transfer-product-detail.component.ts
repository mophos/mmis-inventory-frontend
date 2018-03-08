import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-product-detail',
  templateUrl: './transfer-product-detail.component.html',
  styleUrls: ['./transfer-product-detail.component.css']
})
export class TransferProductDetailComponent implements OnInit {
  @Input('generic') generic;
  @Input('transaction') transaction;
  @Input('editable') editable = true;
  @Output('onChangeQty') onChangeQty: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChangeUnit') onChangeUnit: EventEmitter<any> = new EventEmitter<any>();

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
    if (this.transaction) {
      this.getTransactionProduct();
    } else {
      this.getDashboardProduct();
    }
  }

  async getDashboardProduct() {
    this.loading = true;
    const genericId = this.generic.generic_id;
    this.products = this.generic.detail;
    this.srcMinQty = this.generic.src_min_qty || 0;
    this.srcRemainQty = this.generic.src_remain_qty || 0;
    this.srcUnitName = this.generic.unit_name;
    this.loading = false;
    // try {
    //   const genericId = this.generic.generic_id;
    //   const rs: any = await this.dashboardService.getDashboardProduct(genericId);
    //   if (rs.ok) {
    //     this.products = rs.rows;
    //     this.srcMinQty = this.generic.src_min_qty || 0;
    //     this.srcRemainQty = this.generic.src_remain_qty || 0;
    //   } else {
    //     this.alertService.error(rs.error);
    //   }
    // } catch (error) {
    //   this.alertService.error(error.message);
    // }
  }

  async getTransactionProduct() {
    try {
      this.loading = true;
      const transactionId = this.transaction.transaction_id;
      const genericId = this.transaction.generic_id;
      const rs: any = await this.dashboardService.getTransactionProduct(transactionId, genericId);
      if (rs.ok) {
        this.products = rs.rows;
        this.srcMinQty = this.transaction.src_min_qty || 0;
        this.srcRemainQty = this.transaction.src_remain_qty || 0;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  changeQty(idx: any, qty: any) {
    this.products[idx].transfer_qty = +qty;
    this.onChangeQty.emit(this.products);
  }

  editChangeUnit(idx: any, event: any, unitCmp: any) {
    if (this.products[idx].product_remain_qty < (this.products[idx].transfer_qty * event.qty)) {
      this.alertService.error('รายการไม่พอจ่าย');
      unitCmp.getUnits(this.products[idx].generic_id);
      unitCmp.setSelectedUnit(this.products[idx].unit_generic_id);
    } else {
      this.products[idx].unit_generic_id = event.unit_generic_id;
      this.products[idx].conversion_qty = event.qty;
    }
    this.onChangeUnit.emit(this.products);
  }

}
