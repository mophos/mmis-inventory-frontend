import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { UploadingService } from 'app/uploading.service';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { HisTransactionService } from 'app/admin/his-transaction.service';
import { error } from 'util';


@Component({
  selector: 'wm-his-issue-transaction',
  templateUrl: './his-issue-transaction.component.html',
  styles: []
})
export class HisIssueTransactionComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading;
  @ViewChild('htmlPreview') public htmlPreview: any;

  products = [];
  openUpload = false;
  filePath: string;
  fileName: any = null;
  file: any;
  perPage = 20;
  selected = [];
  openNotMappings = false;
  hisNotMappings: any;
  genericTypes = [];
  genericType: any;
  _genericTypes: any = [];
  _genericType: any;
  token: any;
  warehouseId: any;
  tab = 1;
  productsHistory: any;
  dateHistory: any;
  warehouseName: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private uploadingService: UploadingService,
    private alertService: AlertService,
    private hisTransactionService: HisTransactionService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
    this.warehouseName = decodedToken.warehouseName
  }

  ngOnInit() {
    const date = new Date();
    this.dateHistory = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.getGenericType();
    // this.getTransactionList();
  }

  async getGenericType() {
    try {
      const rs = await this.hisTransactionService.getGenericType();

      if (rs.ok) {
        this.genericTypes = rs.rows;
        this._genericTypes = [];
        this.genericTypes.forEach((e: any) => {
          this._genericTypes.push(e.generic_type_id)
        });
        this.genericType = '';
        if (this.tab == 1) {
          this.getTransactionList();
        } else if (this.tab == 2) {
          this.getHistoryTransactionList();
        }
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  async getTransactionList() {
    try {
      if (this.genericType === '') {
        this._genericType = this._genericTypes;
      } else {
        this._genericType = [];
        this._genericType.push(this.genericType)
      }

      this.modalLoading.show();
      const rs: any = await this.hisTransactionService.getTransactionList(this._genericType);
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  showUploadModal() {
    this.openUpload = true;
  }

  fileChangeEvent(fileInput: any) {
    this.file = <Array<File>>fileInput.target.files;
    this.fileName = this.file[0].name;
  }

  async doUpload() {
    try {
      this.modalLoading.show();
      this.uploadingService.uploadHisTransaction(this.file[0])
        .then((result: any) => {
          if (result.ok) {
            this.openUpload = false;
          } else {
            this.alertService.error(JSON.stringify(result.error));
          }
          this.getTransactionList();
          this.modalLoading.hide();
        }, (error) => {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        });
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  clearTemp() {
    this.alertService.confirm('ต้องการลบรายการทั้งหมดที่ยังไม่ตัดจ่าย ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.hisTransactionService.removeTransactionList()
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.selected = [];
              this.getTransactionList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      }).catch(() => {
        // no action
      });
  }

  confirmImport() {
    const transactionIds: any = [];
    this.selected.forEach(v => {
      transactionIds.push(v.transaction_id);
    });

    if (transactionIds.length) {
      this.doImport(transactionIds);
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการ');
    }
  }

  confirmImportAll() {
    const transactionIds: any = [];
    this.products.forEach(v => {
      transactionIds.push(v.transaction_id);
    });

    if (transactionIds.length) {
      this.doImport(transactionIds);
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการ');
    }
  }

  doImport(transactionIds: any[]) {
    this.alertService.confirm('ต้องการนำเข้ารายการที่เลือก ' + transactionIds.length + ' รายการ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.hisTransactionService.importTransaction(transactionIds)
          .then((rs: any) => {
            if (rs.ok) {
              let isImportTotal = transactionIds.length - rs.un_cut_stock.length;
              this.alertService.success('ผลการนำเข้าข้อมูลเพื่อตัดสต๊อก', 'นำเข้าข้อมูลได้ ' + isImportTotal + ' รายการ ไม่สามารถนำเข้าได้ ' + rs.un_cut_stock.length + ' รายการ');
              this.getTransactionList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      }).catch(() => {

      });
  }

  removeSelected(g) {
    this.alertService.confirm('ต้องการลบรายการ ตัดจ่าย ใช่หรือไม่?')
      .then(() => {
        this.hisTransactionService.removeTransactionListSelect(g.transaction_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getTransactionList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      }).catch(() => { });
  }

  async showNotMappins() {
    let rs: any = await this.hisTransactionService.getNotMappings()
    this.hisNotMappings = rs.rows
    if (this.hisNotMappings.length) {
      this.openNotMappings = true;
    } else {
      this.alertService.error('ไม่มีรายการที่ยังไม่ได้ map');
    }
  }

  async tabHis(event) {
    this.tab = event
    if (this.tab == 1) {
      this.getTransactionList()
    } else if (this.tab == 2) {
      this.getHistoryTransactionList();
    }
  }

  async getHistoryTransactionList() {
    let date = this.dateHistory ? moment(this.dateHistory.jsdate).format('YYYY-MM-DD') : null;
    try {
      if (this.genericType === '') {
        this._genericType = this._genericTypes;
      } else {
        this._genericType = [];
        this._genericType.push(this.genericType)
      }

      this.modalLoading.show();
      const rs: any = await this.hisTransactionService.getHistoryTransactionList(this._genericType, date);
      if (rs.ok) {
        this.productsHistory = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  async hisReportHis() {
    let date = this.dateHistory ? moment(this.dateHistory.jsdate).format('YYYY-MM-DD') : null;
    if (this.genericType === '') {
      this._genericType = this._genericTypes;
    } else {
      this._genericType = [];
      this._genericType.push(this.genericType)
    }
    const url = `${this.apiUrl}/report/his-history?warehouseId=${this.warehouseId}&warehouseName=${this.warehouseName}&date=${date}&genericType=${this._genericType}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  async changeGenericTypes() {
    if (this.tab == 1) {
      this.getTransactionList();
    } else if (this.tab == 2) {
      this.getHistoryTransactionList();
    }
  }
}
