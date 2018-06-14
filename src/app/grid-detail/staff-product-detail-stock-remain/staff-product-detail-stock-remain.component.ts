import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from '../../alert.service';
import { StaffService } from '../../staff/staff.service';

@Component({
  selector: 'wm-staff-product-detail-stock-remain',
  templateUrl: './staff-product-detail-stock-remain.component.html',
  styles: []
})
export class StaffProductDetailStockRemainComponent implements OnInit {

  @Input() productId: any;
  loading = false;
  products = [];

  constructor(
    private staffService: StaffService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductStockRemain();
  }

  async getProductStockRemain() {
    this.loading = true;
    try {
      const rs = await this.staffService.getProductStockDetail(this.productId)
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
