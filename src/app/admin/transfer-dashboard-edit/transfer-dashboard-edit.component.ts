import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-dashboard-edit',
  templateUrl: './transfer-dashboard-edit.component.html',
  styles: []
})
export class TransferDashboardEditComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;
  transactionId: any;
  srcWarehouseId: any;
  dstWarehouseId: any;
  dstMinQty: any;
  dstRemainQty: any;
  dstMaxQty: any;
  status: any;
  transactionDate: any;
  srcRemainQty: any;
  srcMinQty = 0;
  dstWarehouseName: any;
  generics: any = [];
  unitName: any;
  perPage = 20;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) {
    this.transactionId = this.route.snapshot.params['transactionId'];
  }

  async ngOnInit() {
    this.getTransactionInfo();
  }

  async getTransactionInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.dashboardService.getTransactionInfo(this.transactionId);
      if (rs.ok) {
        this.status = rs.rows[0].status;
        this.dstWarehouseId = rs.rows[0].dst_warehouse_id;
        this.dstWarehouseName = rs.rows[0].dst_warehouse_name;
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  approve() {
    this.alertService.confirm(`คุณต้องการอนุมัติ ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.dashboardService.approveTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/transfer-dashboard']);
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      })
      .catch(() => { });
  }

  cancel(transaction: any) {
    this.alertService.confirm(`คุณต้องการยกเลิก ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.dashboardService.cancelTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/transfer-dashboard']);
            } else {
              this.alertService.error(JSON.stringify(rs.error));
            }
            this.modalLoading.hide();
          }).catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      })
      .catch(() => { });
  }

}
