import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { TransferDashboardService } from 'app/admin/transfer-dashboard.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-transfer-warehouse-edit',
  templateUrl: './transfer-warehouse-edit.component.html',
  styles: []
})
export class TransferWarehouseEditComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;
  @Input('transactionId') transactionId;
  @Output('refresh') refresh = new EventEmitter();
  public jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  totalTransferQty = 0;
  loading = false;
  transactions: any = [];
  dstWarehouseName: any;
  perPage: 10;

  constructor(
    private router: Router,
    private dashboardService: TransferDashboardService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getTransactionInfo();
  }

  async getTransactionInfo() {
    try {
      this.loading = true;
      const rs: any = await this.dashboardService.getTransactionInfo(this.transactionId);
      if (rs.ok) {
        this.transactions = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  filterGenericsIsSuccess(isSuccess) {
    return this.transactions.filter(t => t.is_success === isSuccess);
  }

  validate(genericId) {
    const idx = _.findIndex(this.transactions, ['generic_id', genericId]);
    this.transactions[idx].is_success = 'Y';
  }

  changeQty(genericId, event) {
    const idx = _.findIndex(this.transactions, ['generic_id', genericId]);
    this.transactions[idx].detail = event;
    this.transactions[idx].total_transfer_qty = _.sumBy(event, function (e: any) {
      return e.transfer_qty * e.conversion_qty;
    });
  }

  save() {
    this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        const _header = {
          transactionId: this.transactionId,
        };
        try {
          const rs: any = await this.dashboardService.updateTransaction(_header, this.transactions);
          if (rs.ok) {
            this.alertService.success();
            // this.router.navigate(['/admin/transfer-dashboard']);
            this.getTransactionInfo();
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }
      })
      .catch(() => {

      });
  }

  approve() {
    // if (this.filterGenericsIsSuccess('N').length) {
    //   this.alertService.confirm('มีรายการที่ไม่สมบูรณ์ ต้องการอนุมัติการเติมใช่หรือไม่?')
    //     .then(() => {
    //       this.approveTransactions();
    //     })
    //     .catch(() => { });
    // } else {
      this.alertService.confirm('ต้องการอนุมัติการเติมใช่หรือไม่?')
        .then(() => {
          this.approveTransactions();
        })
        .catch(() => { });
    // }
  }

  approveTransactions() {
    this.modalLoading.show();
    this.dashboardService.approveTransactions(this.transactionId)
      .then((rs: any) => {
        if (rs.ok) {
          this.alertService.success();
          this.refresh.emit();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  cancel() {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${this.transactionId}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.dashboardService.cancelTransactions(this.transactionId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.refresh.emit();
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
