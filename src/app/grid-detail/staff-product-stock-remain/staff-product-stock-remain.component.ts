import { StaffService } from 'app/staff/staff.service';
import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-product-stock-remain',
  templateUrl: './staff-product-stock-remain.component.html',
  styles: []
})
export class StaffProductStockRemainComponent implements OnInit {
  @Input() genericId: any;
  loading = false;
  products = [];

  constructor(
    private staffService: StaffService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductStockRemain();
    // this.getProductList(this.productId);
  }

  async getProductStockRemain() {
    this.loading = true;
    try {
      const rs = await this.staffService.getProductStockRemain(this.genericId)
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}
