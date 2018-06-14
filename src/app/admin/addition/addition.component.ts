import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AdditionService } from 'app/admin/addition.service';
import { AlertService } from 'app/alert.service';
import * as _ from 'lodash';
import { asElementData } from '@angular/core/src/view';

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
  queryWarehouse: any;
  queryGeneric: any;
  queryNew: any;
  queryOpen: any;
  queryHistory: any;

  selectedPrint: any = [];
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
      const rs: any = await this.additionService.getWarehouse(this.queryWarehouse);
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
      const rs: any = await this.additionService.getGeneric(this.queryGeneric);
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
      const rs: any = await this.additionService.getTransaction('NEW', this.queryNew);
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
    this.selectedApprove = []
  }

  async getTransaction() {
    this.modalLoading.show();
    try {
      const rs: any = await this.additionService.getTransaction('OPEN', this.queryOpen);
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
      const rs: any = await this.additionService.getTransactionHistory(this.queryHistory);
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
    this.selectedApprove = []
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

  async printRefills() {
    let addition_id = _.join(_.map(this.selectedApprove, (v) => { return 'addition_id=' + v.addition_id }), '&');
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/addition/print/transactions?token=${token}&` + addition_id;
    this.htmlPreview.showReport(url);
  }

  async printRefill(h: any) {
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/addition/print/transaction/${h.addition_id}?token=${token}`;
    this.htmlPreview.showReport(url);
  }

  async clickPrintApprove() {
    if (this.selectedApprove.length) {
      const addition_id = await _.join( _.map(this.selectedApprove, (v)=>{return 'addition_id='+v.addition_id}),'&')
      const token = sessionStorage.getItem('token');
      const url = `${this.apiUrl}/addition/print/approve?token=${token}&` + addition_id;
      console.log(url);
      this.htmlPreview.showReport(url);
    }
  }

  searchWarehouse(event) {
    if (event.keyCode === 13) {
        this.getWarehouse();
    }
  }

  searchGeneric(event) {
    if (event.keyCode === 13) {
      this.getGeneric();
    }
  }

  searchNew(event) {
    if (event.keyCode === 13) {
      this.getAddition();
    }
  }

  searchOpen(event) {
    if (event.keyCode === 13) {
      this.getTransaction();
    }
  }

  searchHistory(event) {
    if (event.keyCode === 13) {
      this.getTransactionHistory();
    }
  }

}
