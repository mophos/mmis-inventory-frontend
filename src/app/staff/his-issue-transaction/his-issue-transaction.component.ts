import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertService } from 'app/alert.service';
import * as moment from 'moment';
import { HisTransactionService } from 'app/staff/his-transaction.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { error } from 'util';
import * as _ from 'lodash';
// import * as path from 'path';

@Component({
  selector: 'wm-his-issue-transaction',
  templateUrl: './his-issue-transaction.component.html',
})
export class HisIssueTransactionComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading;

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
  genericTypes = [];
  genericType: any;
  _genericTypes: any = [];
  _genericType: any;
  openNotMappings = false;
  hisNotMappings: any;
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private hisTransactionService: HisTransactionService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
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
        this.getTransactionList();
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
      const rs: any = await this.hisTransactionService.getTransactionList(this._genericType, this.warehouseId);
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
    // console.log(this.products);
  }

  showUploadModal() {
    this.openUpload = true;
  }

  fileChangeEvent(fileInput: any) {
    // console.log(fileInput)
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
              console.log(rs.un_cut_stock, rs.un_cut_stock.length);
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
    let rs: any = await this.hisTransactionService.getNotMappings(this.warehouseId)
    this.hisNotMappings = rs.rows
    if (this.hisNotMappings.length){
      this.openNotMappings = true;
    }else{
      this.alertService.error('ไม่มีรายการที่ยังไม่ได้ map');
    }
  }
}
