import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { TransferService } from './../transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;
  selectedApprove = [];
  transfers: any = [];
  transfersRequest: any = [];
  transferDetails: any = [];
  openDetail = false;
  token: string;
  jwtHelper: JwtHelper = new JwtHelper();
  warehouseId: string;
  isRemoving: boolean = false;
  approveStatus = 1;

  notApproveReceiveItems = [];

  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService,
    private transferService: TransferService,
    private router: Router,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
    this.getAllTransfer();
    this.getRequestTransfer();
  }

  getAllTransfer() {
    this.modalLoading.show();
    this.transferService.all(this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.transfers = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error.message));
      });
  }

  getRequestTransfer() {
    this.modalLoading.show();
    this.transferService.request(this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.transfersRequest = result.rows;
          this.notApproveReceiveItems = _.filter(this.transfersRequest, { approved: 'N' });
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error.message));
      });
  }

  printDetail() {
  }

  removeTransfer(t: any) {
    this.isRemoving = true;
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.transferService.remove(t.transfer_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getAllTransfer();
              this.getRequestTransfer();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
            this.isRemoving = false;
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.isRemoving = false;
            this.alertService.error(error.message);
          });
      }).catch(() => {
        this.isRemoving = false;
      });
  }

  activeTransfer(t: any) {
    this.alertService.confirm('ต้องการเปลี่ยนสถานะ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.transferService.active(t.transfer_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getAllTransfer();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          });
      }).catch(() => { })
  }

  doApproveAll() {
    const transferIds = [];
    this.selectedApprove.forEach(v => {
      // console.log(v);

      if (v.approved !== 'Y' && v.mark_deleted !== 'Y') {
        transferIds.push(v.transfer_id);
      }
    });

    if (transferIds.length) {
      this.modalLoading.show();
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบเบิก ใช่หรือไม่?')
        .then(() => {
          this.transferService.approveAll(transferIds)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.selectedApprove = [];
                this.getRequestTransfer();
              } else {
                this.alertService.error(rs.error);
              }
              this.modalLoading.hide();
            })
            .catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.error(error.message);
            });
        }).catch(() => {
          // cancel
        });
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  getNotApproveTransfer() {

  }
  showReport(t: any) {
    const transfer_id: any = [];
    let count: any = 0
    this.selectedApprove.forEach(e => {
      transfer_id.push('tranferId=' + e.transfer_id);
      count++;
    });
    if (count > 0) {
      const url = this.apiUrl + `/report/tranfers?token=${this.token}&` + transfer_id.join('&');
      this.htmlPreview.showReport(url);
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }
  showReport2(t: any) {
    const transfer_id: any = [];
    let count: any = 0
    this.selectedApprove.forEach(e => {
      transfer_id.push('tranferId=' + e.transfer_id);
      count++;
    });
    if (count > 0) {
      const url = this.apiUrl + `/report/tranfers2?token=${this.token}&` + transfer_id.join('&');
      this.htmlPreview.showReport(url);
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }

  async getTransfer(value: any) {
    try {
      let rs: any = await this.transferService.all(this.warehouseId)
      if (rs.ok) {
        if (value === '1') {
          this.transfers = rs.rows;
        } else if (value === '2') {
          this.transfers = rs.rows.filter(g => g.approved === 'Y');
        } else if (value === '3') {
          this.transfers = rs.rows.filter(g => g.approved === 'N');
        } else if (value === '4') {
          this.transfers = rs.rows.filter(g => g.mark_deleted === 'Y');
        }
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
    console.log(value);
  }

}
