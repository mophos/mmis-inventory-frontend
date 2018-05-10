import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-addition',
  templateUrl: './addition.component.html',
  styles: []
})
export class AdditionComponent implements OnInit {

  @ViewChild('modalLoading') private modalLoading;
  @ViewChild('htmlPreview') public htmlPreview: any;
  selectedApprove = [];
  selectedOpen = [];
  generics: any = [];
  transactions: any = [];
  histories: any = [];
  warehouses: any = [];
  additions: any = [];
  perPage = 10;
  currentTab = 'warehouse';

  constructor(
    private additionService: AdditionService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
    this.getWarehouse();
  }

  async getWarehouse() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getWarehouse();
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getGeneric() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getGeneric();
      if (rs.ok) {
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

  async getAddition() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getTransaction('NEW');
      if (rs.ok) {
        this.additions = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
      this.currentTab = 'new';
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getTransaction() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getTransaction('OPEN');
      if (rs.ok) {
        this.transactions = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getTransactionHistory() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getTransactionHistory();
      if (rs.ok) {
        this.histories = rs.rows;
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
    const transactionIds = [];
    _.forEach(this.selectedOpen, (v) => {
      if (v.status === 'NEW') {
        transactionIds.push(v.addition_id);
      }
    });
    if (transactionIds.length) {
      this.alertService.confirm('คุณต้องการสร้างใบเติมจำนวน ' + transactionIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          this.modalLoading.show();
          this.additionService.openTransactions(transactionIds)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.selectedApprove = [];
                this.getAddition();
              } else {
                this.alertService.error(rs.error);
              }
              this.modalLoading.hide();
            })
            .catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.serverError();
            })
        }).catch(() => { });
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  clickApprove() {
    const transactionIds = [];
    _.forEach(this.selectedApprove, (v) => {
      if (v.status === 'OPEN') {
        transactionIds.push(v.addition_id);
      }
    });
    if (transactionIds.length) {
      this.alertService.confirm('คุณต้องการอนุมัติจำนวน ' + transactionIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          this.modalLoading.show();
          this.additionService.approveTransactions(transactionIds)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.selectedApprove = [];
                this.getTransaction();
              } else {
                this.alertService.error(rs.error);
              }
              this.modalLoading.hide();
            })
            .catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.serverError();
            })
        }).catch(() => { });
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  cancel(transaction: any) {
    this.alertService.confirm(`คุณต้องการลบรายการนี้ [${transaction.addition_code || transaction.dst_warehouse_name}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.additionService.cancelTransactions(transaction.addition_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              if (this.currentTab === 'new') {
                this.getAddition();
              } else {
                this.getTransaction();
              }
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

  async printRefill(h: any) {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/addition/print/transaction/${h.addition_id}?token=${token}`;
    this.htmlPreview.showReport(url);
  }

}
