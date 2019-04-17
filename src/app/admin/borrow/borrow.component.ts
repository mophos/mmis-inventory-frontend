import { BorrowItemsService } from './../borrow-items.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';

import * as _ from 'lodash';
import { State } from '@clr/angular';
import { BorrowNoteService } from '../borrow-note.service';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'wm-borrow',
  templateUrl: './borrow.component.html',
  styleUrls: []
})
export class BorrowComponent implements OnInit {
  selectedApprove = [];
  selectedApproveOther = [];
  selectedApproveReceive = [];
  selectedApproveReturned = [];
  notApproveReceiveItems = 0;

  approveStatus = 1;
  totalBorrow = 0;
  totalBorrowOther = 0;
  totalReturned = 0;
  totalRequest = 0;
  borrow: any = [];
  borrowOther: any = [];
  returned: any;
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
  currentPageOther = 1;
  offset = 0;
  selectedTab = 'inside';
  tabInside = 0;
  tabOutside = 0;
  tabReturned = 0;
  rights: any;
  jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('modalLoading') private modalLoading;
  @ViewChild('htmlPreview') public htmlPreview: any;
  constructor(
    private alertService: AlertService,
    private borrowItemsService: BorrowItemsService,
    private borrowNoteService: BorrowNoteService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.currentPage = +sessionStorage.getItem('currentPageBorrow') ? +sessionStorage.getItem('currentPageBorrow') : 1;
    this.currentPageOther = +sessionStorage.getItem('currentPageBorrowOthe') ? +sessionStorage.getItem('currentPageBorrowOthe') : 1;

    const decodedToken = this.jwtHelper.decodeToken(this.token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
  }

  ngOnInit() {
    this.getBorrowList();
    this.selectedTab = sessionStorage.getItem('tabBorrow') ? sessionStorage.getItem('tabBorrow') : 'inside';
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

  async getBorrowOtherList() {
    this.modalLoading.show();
    this.selectedApproveOther = [];
    try {
      const rs = await this.borrowItemsService.listOther(this.approveStatus, this.perPage, this.offset);
      if (rs.ok) {
        this.borrowOther = rs.rows;
        this.totalBorrowOther = rs.total;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async getReturnedList() {
    this.modalLoading.show();
    this.selectedApproveReturned = [];
    try {
      const rs = await this.borrowItemsService.returnedList(this.approveStatus, this.perPage, this.offset);
      if (rs.ok) {
        this.returned = rs.rows;
        this.totalReturned = rs.total;
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

  async refreshBorrowOther(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageBorrowOther', this.currentPageOther.toString());
    this.getBorrowOtherList();
  }

  async refreshReturned(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageReturned', this.currentPageOther.toString());
    this.getReturnedList();
  }

  removeBorrow(b: any) {
    if (_.indexOf(this.rights, 'WM_BORROW_CANCEL') > -1) {
      this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
        .then(async () => {
          this.modalLoading.show();
          try {
            const rs: any = await this.borrowItemsService.remove(b.borrow_id);
            if (rs.ok) {
              this.alertService.success();
              this.getBorrowList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          } catch (error) {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          }
        }).catch(() => { })
    } else {
      this.alertService.error('คุณไม่มีสิทธิในการยกเลิก')
    }
  }

  removeBorrowOther(b: any) {
    if (_.indexOf(this.rights, 'WM_BORROW_CANCEL') > -1) {
      this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
        .then(async () => {
          this.modalLoading.show();
          try {
            const rs: any = await this.borrowItemsService.removeOther(b.borrow_other_id);
            if (rs.ok) {
              this.alertService.success();
              this.getBorrowOtherList();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          } catch (error) {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          }
        }).catch(() => { })
    } else {
      this.alertService.error('คุณไม่มีสิทธิในการยกเลิก')
    }
  }

  setTapActive(tab: any) {
    sessionStorage.setItem('tabBorrow', tab);
    this.selectedApprove = [];
    this.selectedApproveOther = [];
    this.selectedApproveReturned = [];

    this.selectedTab = tab;
    this.totalTab();
  }

  async totalTab() {
    try {
      if (this.selectedTab === 'inside' || this.tabInside === 0) {
        await this.getBorrowList();
      }
      if (this.selectedTab === 'outside' || this.tabOutside === 0) {
        await this.getBorrowOtherList();
      }
      if (this.selectedTab === 'returnProduct' || this.tabReturned === 0) {
        await this.getReturnedList();
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  doApprove(borrowId: any) {
    const borrowIds = [];
    borrowIds.push(borrowId);

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

  doApproveOther() {
    const borrowOtherIds = [];

    this.selectedApproveOther.forEach(v => {
      if (v.approved !== 'Y' && v.is_cancel === 'N') {
        borrowOtherIds.push(v.borrow_other_id);
      }
    });

    if (borrowOtherIds.length) {
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบยืม ใช่หรือไม่?')
        .then(async () => {
          this.approveOther(borrowOtherIds);
        }).catch(() => {
          // cancel
        });
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  doApproveReturned() {
    const returnedIds = [];

    this.selectedApproveReturned.forEach(v => {
      if (v.is_approved !== 'Y' && v.is_cancel === 'N') {
        returnedIds.push(v.returned_id);
      }
    });

    if (returnedIds.length) {
      this.alertService.confirm('ต้องการยืนยันการอนุมัติใบคืน ใช่หรือไม่?')
        .then(async () => {
          this.approveReturned(returnedIds);
        }).catch(() => {
          // cancel
        });
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  async approve(borrowIds: any[]) {
    try {
      if (_.indexOf(this.rights, 'WM_BORROW_APPROVE') > -1) {
        this.modalLoading.show();
        const rs: any = await this.borrowItemsService.approveAll(borrowIds);
        if (rs.ok) {
          this.saveMemory(rs.data);
          this.alertService.success();
          this.selectedApprove = [];
          this.selectedApproveReceive = [];
          this.getBorrowList();
          // this.getRequestBorrow();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      }
      else {
        this.alertService.error('คุณไม่มีสิทธิในการอนุมัติ')
      }
    } catch (error) {
      this.modalLoading.hide();
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  async approveOther(borrowIds: any[]) {
    try {
      if (_.indexOf(this.rights, 'WM_BORROW_APPROVE') > -1) {
        this.modalLoading.show();
        const rs: any = await this.borrowItemsService.approveAllOther(borrowIds);
        if (rs.ok) {
          this.alertService.success();
          this.selectedApproveOther = [];
          this.selectedApproveReceive = [];
          this.getBorrowOtherList();
          // this.getRequestBorrow();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      }
      else {
        this.alertService.error('คุณไม่มีสิทธิในการอนุมัติ')
      }
    } catch (error) {
      this.modalLoading.hide();
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  async approveReturned(returnedIds: any[]) {
    try {
      if (_.indexOf(this.rights, 'WM_BORROW_APPROVE') > -1) {
        this.modalLoading.show();
        const rs: any = await this.borrowItemsService.approveAllReturned(returnedIds);
        if (rs.ok) {
          this.alertService.success();
          this.selectedApproveReturned = [];
          this.getReturnedList();
          // this.getRequestBorrow();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      }
      else {
        this.alertService.error('คุณไม่มีสิทธิในการอนุมัติ')
      }
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

  async saveMemory(data: any) {
    if(data.length){
      for (const v of data) {
        const notes: any = {};
        notes.remark = 'ยืมนอก Stock';
        notes.people_id = v.people_id;
        notes.wm_withdarw = v.src_warehouse_id;
        notes.wm_borrow = v.dst_warehouse_id;

        await this.borrowNoteService.save(notes, v.products);
      }
    }
  }

  printApprove() {
    const borrow_id: any = []
    let count: any = 0
    this.selectedApprove.forEach(e => {
      if (e.mark_deleted !== 'Y') {
        borrow_id.push('borrow_id=' + e.borrow_id);
        count++;
      }
    });
    if (count > 0) {
      const url = this.apiUrl + `/report/approve/borrow?token=${this.token}&` + borrow_id.join('&');
      this.htmlPreview.showReport(url);
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }

  printSetProduct() {
    const borrow_id: any = []
    let count: any = 0
    this.selectedApprove.forEach(e => {
      if (e.mark_deleted !== 'Y') {
        borrow_id.push('borrow_id=' + e.borrow_id);
        count++;
      }
    });
    if (count > 0) {
      const url = this.apiUrl + `/report/list-borrow?token=${this.token}&` + borrow_id.join('&');
      this.htmlPreview.showReport(url, 'landscape');
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }
}

