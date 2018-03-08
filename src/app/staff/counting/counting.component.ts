import { JwtHelper } from 'angular2-jwt';
import { AlertService } from './../../alert.service';
import { StaffService } from './../staff.service';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'wm-counting',
  templateUrl: './counting.component.html',
  styleUrls: ['./counting.component.css']
})
export class CountingComponent implements OnInit {
  cycleLogs: any = [];
  loading = false;
  jwtHelper: JwtHelper = new JwtHelper();
  warehouseId: any;
  productId: any;

  openModalRemark = false;
  productName: string;
  remainAcc = 0;
  remainStock = 0;
  remark: string;
  countingCycleLogsId: number;

  constructor(
    private staffService: StaffService,
    private ref: ChangeDetectorRef,
    private alertService: AlertService
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
    this.getCycleProductsInWarehouse();
  }

  async getCycleProductsInWarehouse() {
    try {
      this.loading = true;
      this.cycleLogs = [];
      const resp: any = await this.staffService.getCycleProductsInWarehouse(this.warehouseId);
      if (resp.ok) {
        this.cycleLogs = resp.rows;
        this.ref.detectChanges();
      } else {
        this.alertService.error(JSON.stringify(resp.error));
      }
      this.loading = false;
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async showModalRemark(product: any) {
    this.countingCycleLogsId = product.counting_cycle_logs_id;
    // get old remark
    const resp: any = await this.staffService.getCycleRemark(this.countingCycleLogsId);
    if (resp.ok && resp.rows) {
      this.remainStock = resp.rows.stock_qty;
      this.remark = resp.rows.remark;
    } else {
      this.remainStock = product.qty;
      this.remark = null;
    }

    this.remainAcc = product.qty;
    this.productId = product.product_id;

    this.productName = product.product_name;
    this.openModalRemark = true;
  }

  async saveRemark() {
    if (this.countingCycleLogsId && this.remainAcc && this.remainStock && this.remark) {
      try {
        const resp: any = await this.staffService.saveCycleRemark(this.countingCycleLogsId, this.remark, this.remainStock, this.remainAcc);
        if (resp.ok) {
          this.alertService.success();
          this.openModalRemark = false;
        } else {
          this.alertService.error(JSON.stringify(resp.error));
        }
      } catch (error) {
        this.alertService.error(JSON.stringify(error.message));
      }
    } else {
      this.alertService.error('ข้อมูลไม่ครบถ้วน กรุณาตรวจสอบ');
    }
  }
}
