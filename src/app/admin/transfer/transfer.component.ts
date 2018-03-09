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

  approveStatus = 1;
  total = 0;
  transfers: any = [];
  transferDetails: any = [];
  openDetail = false;
  isApprove: boolean = true;
  isNotApprove: boolean = false;
  isAll: boolean = false;

  isSaving: boolean = false;
  isSearching: boolean = false;
  perPage: number = 15;
  loading = false;
  token: any;

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
    this.token = sessionStorage.getItem('token')
  }

  ngOnInit() {

  }

  getTransfer(event) {
    this.getTransferList();
  }

  async getTransferList() {
    this.modalLoading.show();
    try {
      let rs = await this.transferService.list(this.approveStatus, this.perPage, 0);
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

  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.modalLoading.show();
    try {
      const rs = await this.transferService.list(this.approveStatus, limit, offset);
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

  printDetail(t: any) {

  }

  removeTransfer(t: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          let rs: any = await this.transferService.remove(t.transfer_id);
          if (rs.ok) {
            this.alertService.success();
            this.getTransferList();
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
      if (v.approved !== 'Y' && v.mark_deleted == 'N') {
        transferIds.push(v.transfer_id);
      }
    });

    if (transferIds.length) {
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบเบิก ใช่หรือไม่?')
        .then(async () => {
          try {
            this.modalLoading.show();
            let rs: any = await this.transferService.approveAll(transferIds);
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
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  approve(t: any) {
    this.alertService.confirm('ต้องการอนุมัติการโอน ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.hide();
        try {
          let rs: any = await this.transferService.approve(t.transfer_id);
          if (rs.ok) {
            this.alertService.success();
            this.getTransferList();
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
        this.modalLoading.hide();
      });
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
}
