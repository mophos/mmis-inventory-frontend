import { Router } from '@angular/router';
import { TransferService } from './../transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { State } from '@clr/angular';

@Component({
  selector: 'wm-transfer',
  templateUrl: './transfer.component.html'
})
export class TransferComponent implements OnInit {
  selectedApprove = [];
  notApproveReceiveItems = [];
  transfersRequest = [];

  approveStatus = 1;
  total = 0;
  transfers: any = [];
  transferDetails: any = [];
  openDetail = false;
  isApprove = true;
  isNotApprove = false;
  isAll = false;

  isSaving = false;
  isSearching = false;
  perPage = 15;
  loading = false;
  token: any;
  currentPage = 1;
  offset = 0;

  @ViewChild('modalLoading') private modalLoading;
  @ViewChild('htmlPreview') public htmlPreview: any;
  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService,
    private transferService: TransferService,
    private router: Router,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.currentPage = +sessionStorage.getItem('currentPageTransfer') ? +sessionStorage.getItem('currentPageTransfer') : 1;
  }

  ngOnInit() {
    // this.getTransferList();
    // this.getRequestTransfer();
  }

  async getTransferList() {
    this.modalLoading.show();
    try {
      const rs = await this.transferService.list(this.approveStatus, this.perPage, this.offset);
      if (rs.ok) {
        this.transfers = rs.rows;
        this.total = rs.total;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async refreshTransfer(state: State) {
    this.offset = +state.page.from;
    const limit = +state.page.size;

    sessionStorage.setItem('currentPageTransfer', this.currentPage.toString());

    this.modalLoading.show();
    try {
      const rs = await this.transferService.list(this.approveStatus, limit, this.offset);
      if (rs.ok) {
        this.transfers = rs.rows;
        this.total = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  removeTransfer(t: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          const rs: any = await this.transferService.remove(t.transfer_id);
          if (rs.ok) {
            this.alertService.success();
            this.getTransferList();
            this.getRequestTransfer();
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }

      }).catch(() => { })
  }

  doApprove() {
    const transferIds = [];
    this.selectedApprove.forEach(v => {
      if (v.approved !== 'Y' && v.mark_deleted === 'N') {
        transferIds.push(v.transfer_id);
      }
    });

    if (transferIds.length) {
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบโอน ใช่หรือไม่?')
        .then(async () => {
          this.approve(transferIds);
        }).catch(() => {
          // cancel
        });
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  doApproveReceive() {
    const transferIds = [];
    this.selectedApprove.forEach(v => {
      if (v.approved !== 'Y' && v.mark_deleted === 'N') {
        transferIds.push(v.transfer_id);
      }
    });

    if (transferIds.length) {
      this.alertService.confirm('ต้องการยืนยันการรับสินค้าเข้าคลัง ใช่หรือไม่?')
        .then(async () => {
          this.approve(transferIds);
        }).catch(() => {
          // cancel
        });
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการรับสินค้าเข้าคลัง');
    }
  }

  async approve(transferIds: any[]) {
    try {
      this.modalLoading.show();
      const rs: any = await this.transferService.approveAll(transferIds);
      if (rs.ok) {
        this.alertService.success();
        this.selectedApprove = [];
        this.getTransferList();
        this.getRequestTransfer();
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  showReport(t) {
    const url = `${this.apiUrl}/report/tranfer/${t.transfer_id}?token=${this.token}`;
    this.htmlPreview.showReport(url);

  }

  printReport() {
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

  printReport2() {
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

  activeTransfer(t: any) {
    this.alertService.confirm('ต้องการเปลี่ยนสถานะ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.transferService.active(t.transfer_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getTransferList();
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

  doConfirm() {
    const transferIds = [];
    this.selectedApprove.forEach(v => {
      if (v.confirmed !== 'Y' && v.approved !== 'Y' && v.mark_deleted === 'N') {
        transferIds.push(v.transfer_id);
      }
    });

    if (transferIds.length) {
      this.alertService.confirm('ต้องการยืนยันการโอน ใช่หรือไม่?')
        .then(async () => {
          try {
            this.modalLoading.show();
            const rs: any = await this.transferService.confirmAll(transferIds);
            if (rs.ok) {
              this.alertService.success();
              this.selectedApprove = [];
              this.getTransferList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          } catch (error) {
            this.modalLoading.hide();
            console.error(error);
            this.alertService.error(error.message);
          }
        }).catch(() => {
          // cancel
        });
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการยืนยัน');
    }
  }

  async getRequestTransfer() {
    try {
      this.modalLoading.show();
      const rs: any = await this.transferService.request(this.perPage, this.offset);
      if (rs.ok) {
        this.transfersRequest = rs.rows;
        this.notApproveReceiveItems = _.filter(this.transfersRequest, { approved: 'N', mark_deleted: 'N' });
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async refreshRequest(state: State) {
    this.offset = +state.page.from;
    const limit = +state.page.size;

    sessionStorage.setItem('currentPageTransfer', this.currentPage.toString());
    sessionStorage.setItem('offsetTransfer', this.offset.toString());

    this.modalLoading.show();
    try {
      const rs = await this.transferService.request(limit, this.offset);
      if (rs.ok) {
        this.transfersRequest = rs.rows;
        this.total = rs.total;
        this.notApproveReceiveItems = _.filter(this.transfersRequest, { approved: 'N', mark_deleted: 'N' });
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
}
