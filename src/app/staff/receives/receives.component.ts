import {
  Component,
  OnInit,
  Inject,
  ChangeDetectorRef,
  ViewChild
} from '@angular/core';

import { ReceiveService } from '../receive.service';
import { AlertService } from '../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';

import { State } from "@clr/angular";
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AccessCheck } from '../../access-check';

@Component({
  selector: 'wm-receives',
  templateUrl: './receives.component.html',
  styles: []
})
export class ReceivesComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('modalApprove') public modalApprove: any;
  @ViewChild('modalApproveOther') public modalApproveOther: any;

  others: any = [];
  selectedOtherApprove = [];
  showOption: any = 1;
  tab: any;
  countApproveOther: any;
  perPage = 20;
  queryOther: string;
  totalReceiveOther = 0;
  token: any;
  offset: any;
  currentPage: any;
  titel: any;
  action: any;
  page: any;
  selectedApprove = [];
  username: any;
  password: any;
  openModalConfirm = false;
  isSearching = false;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService,
    private accessCheck: AccessCheck,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token')
  }
  fillterApprove = 'all';

  ngOnInit() {
    this.getApprove();
    this.tab = sessionStorage.getItem('tabReceive');
    this.currentPage = +sessionStorage.getItem('currentPageReceive') ? +sessionStorage.getItem('currentPageReceive') : 1;
    this.offset = +sessionStorage.getItem('offsetReceive') ? +sessionStorage.getItem('offsetReceive') : 0;
  }

  selectTabReceiveOther() {
    this.showOption = 2
    this.tab = "receiveOther";
    this.fillterApprove = 'all';
    sessionStorage.setItem('tabReceive', this.tab);
  }

  async changeFillterApprove() {
    if (this.tab === 'receiveOther') {
      if (!this.queryOther) {
        const rs = await this.receiveService.getReceiveOtherStatus(this.perPage, 0, this.fillterApprove);
        this.others = rs.rows;
        this.totalReceiveOther = rs.total;
      } else {
        const rs = await this.receiveService.getReceiveOtherStatusSearch(this.perPage, 0, this.queryOther, this.fillterApprove);
        this.others = rs.rows;
        this.totalReceiveOther = rs.total;
      }
    }
  }

  async refreshOther(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    const sort = state.sort;
    this.modalLoading.show();
    try {
      if (!this.queryOther) {
        const rs = await this.receiveService.getReceiveOtherStatus(limit, offset, this.fillterApprove, sort);
        this.others = rs.rows;
        this.totalReceiveOther = rs.total;
      } else {
        const rs = await this.receiveService.getReceiveOtherStatusSearch(limit, offset, this.queryOther, this.fillterApprove, sort);
        this.others = rs.rows;
        this.totalReceiveOther = rs.total;
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
    this.modalLoading.hide();
  }

  async getApprove() {
    try {
      const rs = await this.receiveService.getApprove();
      const rsOther = await this.receiveService.getApproveOther();
      if (rsOther.ok) {
        this.countApproveOther = rsOther.rows[0].count_approve;
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  async approveReceiveCheck(access: any, action: any) {
    let check = false
    let accessName: any;
    this.titel = 'รายการรับสินค้า';


    if (access === 1) {
      accessName = 'WM_RECEIVE_APPROVE'
      this.action = 'WM_RECEIVE_APPROVE'
      this.page = 1;

      this.selectedApprove.length ? check = true : this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    } else if (access = 2) {
      accessName = 'WM_RECEIVE_OTHER_APPROVE'
      this.action = 'WM_RECEIVE_OTHER_APPROVE'
      this.page = 2;

      this.selectedOtherApprove.length ? check = true : this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }

    if (check) { // ตรวจสอบสิทธิการอนุมัติใบรับ
      const rs = await this.accessCheck.can(accessName);
      console.log(rs);
      if (rs) {
        this.page === 1 ? this.saveApprove() : this.saveApproveOther();
      } else {
        this.username = ''
        this.password = ''
        this.openModalConfirm = true
      }
    }
  }

  saveApprove() {
    const ids = [];
    this.selectedApprove.forEach(v => {
      if (!v.approve_id && v.purchase_order_number) {
        ids.push(v.receive_id);
      }
    });

    this.alertService.confirm('มีรายการที่ต้องการอนุมัติจำนวน ' + ids.length + ' รายการ ต้องการอนุมัติใช่หรือไม่?')
      .then(() => {
        this.modalApprove.setReceiveIds(ids);
        this.modalApprove.openModal();
      }).catch(() => {
        // cancel
      });
  }

  saveApproveOther() {
    const ids = [];
    this.selectedOtherApprove.forEach(v => {
      if (!v.approve_id) {
        ids.push(v.receive_other_id);
      }
    });

    this.alertService.confirm('มีรายการที่ต้องการอนุมัติจำนวน ' + ids.length + ' รายการ ต้องการอนุมัติใช่หรือไม่?')
      .then(() => {
        this.modalApproveOther.setReceiveIds(ids);
        this.modalApproveOther.openModal();
      }).catch(() => {
        // cancel
      });
  }

  printProductReciveOther() {
    const receiveIds = [];
    _.forEach(this.selectedOtherApprove, (v) => {
      receiveIds.push(v.receive_other_id);
    });
    if (receiveIds.length) {
      this.alertService.confirm('พิมพ์รายงานเวชภัณฑ์ที่รับจากการบริจาค ' + receiveIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          let strIds = '';
          receiveIds.forEach((v: any) => {
            strIds += `receiveOtherID=${v}&`;
          });
          const url = `${this.apiUrl}/report/product/receive/other?${strIds}&token=${this.token}`;
          this.htmlPreview.showReport(url, 'landscape');
        }).catch(() => {

        });
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการพิมพ์');
    }
  }

  printDeliveryNoteOther() {
    const receiveOtherIds = [];
    _.forEach(this.selectedOtherApprove, (v) => {
      if (true) {
        receiveOtherIds.push(v.receive_other_id);
      }
    });

    if (receiveOtherIds.length) {
      this.alertService.confirm('พิมพ์ใบนำส่ง ' + receiveOtherIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          let strIds = '';
          receiveOtherIds.forEach((v: any) => {
            strIds += `receiveOtherID=${v}&`;
          });
          const url = `${this.apiUrl}/report/list/receiveOther?${strIds}&token=${this.token}`;
          this.htmlPreview.showReport(url, 'landscape');
        }).catch(() => {
          // cancel
        });

    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการพิมพ์ (เลือกรายการที่มีใบสั่งซื้อเท่านั้น)');
    }
  }

  async checkApprove(username: any, password: any) {
    const rs: any = await this.receiveService.checkApprove(username, password, this.action);
    if (rs.ok) {
      this.page === 1 ? this.saveApprove() : this.saveApproveOther();
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ' + this.titel);
    }
    this.openModalConfirm = false;
  }

  close() {
    this.openModalConfirm = false;
    this.username = '';
    this.password = '';
  }

  approveSuccessOther(event: any) {
    if (this.queryOther) {
      this.doSearchReceiveOther();
    } else {
      this.getOtherList();
    }
  }

  async doSearchReceiveOther() {
    try {
      this.modalLoading.show();
      const rs = await this.receiveService.getReceiveOtherStatusSearch(this.perPage, this.offset, this.queryOther, this.fillterApprove);
      this.others = rs.rows;
      this.totalReceiveOther = rs.total;
      this.isSearching = true;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getOtherList() {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getReceiveOtherStatus(this.perPage, this.offset, this.fillterApprove);
      if (rs.ok) {
        this.others = rs.rows;
        this.totalReceiveOther = rs.total;
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
