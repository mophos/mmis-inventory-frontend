import { Router } from '@angular/router';
import { BorrowItemsService } from './../borrow-items.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { State } from '@clr/angular';

@Component({
  selector: 'wm-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: [ ]
})
export class BorrowComponent implements OnInit {
  selectedApprove = [];
  selectedApproveReceive = [];
  notApproveReceiveItems = 0;
  transfersRequest = [];

  approveStatus = 1;
  totalBorrow = 0;
  totalRequest = 0;
  borrow: any = [];
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
    private borrowItemsService: BorrowItemsService,
    private router: Router,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.currentPage = +sessionStorage.getItem('currentPageTransfer') ? +sessionStorage.getItem('currentPageTransfer') : 1;
  }

  ngOnInit() {
    this.getBorrowList();
    // this.getRequestBorrow();
  }

  async getBorrowList() {
    this.modalLoading.show();
    this.selectedApproveReceive = [];
    try {
      const rs = await this.borrowItemsService.list(this.approveStatus, this.perPage, this.offset);
      if (rs.ok) {
        this.borrow = rs.rows;
        this.totalBorrow = rs.total;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async refreshBorrow(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageBorrow', this.currentPage.toString());
    this.getBorrowList();
  }

  removeBorrow(b: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          const rs: any = await this.borrowItemsService.remove(b.borrow_id);
          if (rs.ok) {
            this.alertService.success();
            this.getBorrowList();
            this.getRequestBorrow();
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
    const borrowIds = [];
      
    this.selectedApprove.forEach(v => {
      if (v.approved !== 'Y' && v.mark_deleted === 'N') {
        borrowIds.push(v.borrow_id);
      }
    });

    if (borrowIds.length) {
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบยืม ใช่หรือไม่?')
        .then(async () => {
          this.approve(borrowIds);
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
    this.selectedApproveReceive.forEach(v => {
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
      this.selectedApproveReceive = [];
      this.alertService.error('ไม่พบรายการที่ต้องการรับสินค้าเข้าคลัง');
    }
  }

  async approve(borrowIds: any[]) {
    try {
      this.modalLoading.show();
      const rs: any = await this.borrowItemsService.approveAll(borrowIds);
      if (rs.ok) {
        this.alertService.success();
        this.selectedApprove = [];
        this.selectedApproveReceive = [];
        this.getBorrowList();
        // this.getRequestBorrow();
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
        this.borrowItemsService.active(t.transfer_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getBorrowList();
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
            const rs: any = await this.borrowItemsService.confirmAll(transferIds);
            if (rs.ok) {
              this.alertService.success();
              this.selectedApprove = [];
              this.getBorrowList();
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

  async getRequestBorrow() {
    try {
      this.modalLoading.show();
      this.selectedApprove = [];
      const rs: any = await this.borrowItemsService.request(this.perPage, this.offset);
      if (rs.ok) {
        this.transfersRequest = rs.rows;
        this.totalRequest = rs.totalRequest;
        this.notApproveReceiveItems = rs.totalNotApprove;
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
    sessionStorage.setItem('currentPageTransfer', this.currentPage.toString());
    this.getRequestBorrow();
  }
}

