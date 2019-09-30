import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import { HisTransactionService } from 'app/staff/his-transaction.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { error, log } from 'util';
import * as _ from 'lodash';
// import * as path from 'path';

@Component({
  selector: 'wm-his-issue-transaction',
  templateUrl: './his-issue-transaction.component.html',
})
export class HisIssueTransactionComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading;
  @ViewChild('htmlPreview') public htmlPreview: any;

  path: string;
  products: any = [];
  totalProducts = 0;
  openUpload = false;
  filePath: string;
  fileName: any = null;
  file: any;
  perPage = 100;
  selected = [];
  warehouseId: any;
  token: any;
  //// genericTypes = [];
  //// genericType: any;
  //// _genericTypes: any = [];
  //// _genericType: any;
  openNotMappings = false;
  hisNotMappings: any;
  //// tab = 1;
  productsHistory = [];
  dateHistory: any;
  warehouseName: any;
  jwtHelper: JwtHelper = new JwtHelper();
  genericType: any;

  @ViewChild('genericTypes') public genericTypes: any;
  constructor(
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
    //// this.getGenericType();
    this.getTransactionList();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.genericType = this.genericTypes.getDefaultGenericType();
  }

  //// async getGenericType() {
  ////   try {
  ////     const rs = await this.hisTransactionService.getGenericType();

  ////     if (rs.ok) {
  ////       this.genericTypes = rs.rows;
  ////       this._genericTypes = [];
  ////       this.genericTypes.forEach((e: any) => {
  ////         this._genericTypes.push(e.generic_type_id)
  ////       });
  ////       this.genericType = '';
  ////       if (this.tab == 1) {
  ////         this.getTransactionList();
  ////       } else if (this.tab == 2) {
  ////         this.getHistoryTransactionList();
  ////       }
  ////     } else {
  ////       this.alertService.error(rs.error);
  ////     }

  ////   } catch (error) {
  ////     console.log(error);
  ////     this.alertService.serverError();
  ////   }
  //// } 

  async getTransactionList() {
    try {
      this.modalLoading.show();
      const rs: any = await this.hisTransactionService.getTransactionList(this.genericType, this.warehouseId);
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = this.products.length
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
      this.hisTransactionService.uploadHisTransaction(this.file[0])
        .then((result: any) => {
          if (result.ok) {
            this.openUpload = false;
          } else {
            this.alertService.error(JSON.stringify(result.error));
          }
          this.getTransactionList();
          this.modalLoading.hide();
        }, (err) => {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(err));
        });
    } catch (err) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(err));
    }
  }

  clearTemp() {
    this.alertService.confirm('ต้องการลบรายการทั้งหมดที่ยังไม่ตัดจ่าย ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.hisTransactionService.removeTransactionList(this.warehouseId)
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
          .catch((err: any) => {
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
    let i: any = 0;
    this.products.forEach(v => {
      if (i < 500) {
        transactionIds.push(v.transaction_id);
      }
      i++;
    });

    if (transactionIds.length) {
      this.doImport(transactionIds);
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการ');
    }
  }

  doImport(transactionIds: any[]) {
    this.alertService.confirm('ต้องการตัดจ่ายรายการที่เลือก ' + transactionIds.length + ' รายการ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.hisTransactionService.importTransaction(transactionIds)
          .then((rs: any) => {
            console.log(rs);

            if (rs.ok) {
              // const isImportTotal = transactionIds.length - rs.un_cut_stock.length;
              // this.alertService.success('ผลการตัดจ่ายเพื่อตัดสต๊อก', 'ตัดจ่านข้อมูลได้ ' + isImportTotal + ' รายการ ไม่สามารถตัดจ่ายได้ ' + rs.un_cut_stock.length + ' รายการ');
              this.alertService.success('ตัดจ่ายข้อมูลสำเร็จ');
              this.getTransactionList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((err) => {
            console.log(err);

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
          .catch((err: any) => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      }).catch(() => { });
  }

  async showNotMappins() {
    let rs: any = await this.hisTransactionService.getNotMappings(this.warehouseId)
    this.hisNotMappings = rs.rows
    if (this.hisNotMappings.length) {
      this.openNotMappings = true;
    } else {
      this.alertService.error('ไม่มีรายการที่ยังไม่ได้ map');
    }
  }

  async getHistoryTransactionList() {
    const date = this.dateHistory ? moment(this.dateHistory.jsdate).format('YYYY-MM-DD') : null;
    try {
      this.modalLoading.show();
      const rs: any = await this.hisTransactionService.getHistoryTransactionList(this.genericType, date, this.warehouseId);
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
    const date = this.dateHistory ? moment(this.dateHistory.jsdate).format('YYYY-MM-DD') : null;
    let genericTypeLV1: any;
    let genericTypeLV2: any;
    let genericTypeLV3: any;
    if (this.genericType.generic_type_lv1_id.length) {
      genericTypeLV1 = this.genericType.generic_type_lv1_id.join(',')
    }
    if (this.genericType.generic_type_lv2_id.length) {
      genericTypeLV2 = this.genericType.generic_type_lv2_id.join(',')
    }
    if (this.genericType.generic_type_lv3_id.length) {
      genericTypeLV3 = this.genericType.generic_type_lv3_id.join(',')
    }
    const url = `${this.apiUrl}/report/his-history?warehouseId=${this.warehouseId}&warehouseName=${this.warehouseName}&date=${date}&genericTypeLV1Id=${genericTypeLV1}&genericTypeLV2Id=${genericTypeLV2}&genericTypeLV3Id=${genericTypeLV3}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  selectGenericTypeMulti() {
    this.getTransactionList();
  }

  selectGenericTypeMultiHistory() {
    this.getHistoryTransactionList();
  }
}
