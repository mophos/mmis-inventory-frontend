import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'wm-addition-warehouse-view',
  templateUrl: './addition-warehouse-view.component.html',
  styles: []
})
export class AdditionWarehouseViewComponent implements OnInit {

  @Input('dstWarehouseId') dstWarehouseId;
  @Input('transactionId') transactionId;
  loading = false;
  generics: any = [];

  constructor(
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.transactionId) {
      this.getTransactionInfo();
    } else {
      this.getWarehouseGeneric();
    }
  }

  async getWarehouseGeneric() {
    try {
      this.loading = true;
      const rs: any = await this.dashboardService.getWarehouseGeneric(this.dstWarehouseId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  async getTransactionInfo() {
    try {
      this.loading = true;
      const rs: any = await this.dashboardService.getTransactionInfo(this.transactionId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  linkToDashboardGeneric(_genericId) {
    this.router.navigateByUrl(`/admin/transfer-dashboard/generic?genericId=${_genericId}`);
  }

  linkToDashboardWarehouse(_warehouseId) {
    this.router.navigateByUrl(`/admin/transfer-dashboard/warehouse?warehouseId=${_warehouseId}`);
  }


}
