import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition-edit',
  templateUrl: './addition-edit.component.html',
  styles: []
})
export class AdditionEditComponent implements OnInit {

  @ViewChild('modalLoading') private modalLoading;
  transactionId: any;
  status: any;
  dstWarehouseName: any;
  dstWarehouseCode: any;
  generics: any = [];
  perPage = 20;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private additionService: AdditionService,
    private alertService: AlertService
  ) {
    this.transactionId = this.route.snapshot.params['additionId'];
  }

  async ngOnInit() {
    this.getTransactionInfo();
  }

  async getTransactionInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.additionService.getTransactionInfo(this.transactionId);
      if (rs.ok) {
        this.status = rs.rows[0].status;
        this.dstWarehouseName = rs.rows[0].dst_warehouse_name;
        this.dstWarehouseCode = rs.rows[0].dst_short_code;
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

  clickOpen() {
    this.alertService.confirm(`คุณต้องการสร้างใบเติม ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.additionService.openTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/addition']);
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

  clickApprove() {
    this.alertService.confirm(`คุณต้องการอนุมัติ ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.additionService.approveTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/addition']);
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

  clickCancel(transaction: any) {
    this.alertService.confirm(`คุณต้องการยกเลิก ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.additionService.cancelTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.router.navigate(['/admin/addition']);
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
