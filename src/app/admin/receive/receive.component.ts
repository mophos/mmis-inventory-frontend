import { UploadingService } from './../../uploading.service';
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

import * as moment from 'moment';
import * as _ from 'lodash';

import { State } from "@clr/angular";
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AccessCheck } from '../../access-check';

@Component({
  selector: 'wm-receive',
  templateUrl: './receive.component.html'
})
export class ReceiveComponent implements OnInit {
  @ViewChild('modalApprove') public modalApprove: any;
  @ViewChild('modalApproveOther') public modalApproveOther: any;
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;

  expired = [];
  otherExpired = [];
  waitings: any = [];
  others: any = [];
  purchases: any = [];
  totalReceive = 0;
  totalReceiveOther = 0;
  perPage = 15;
  query: string;
  isSearching = false;
  isSearch = false;
  openModal = false;
  sDate: any;
  eDate: any;
  sID: any;
  eID: any;
  sIDpo: any;
  eIDpo: any;
  showOption = 1
  token: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    width: '100%'
  };

  loading = false;
  loadingOther = false;

  selectedApprove = [];
  selectedOtherApprove = [];

  titel: any;
  isConfirm: any;
  openModalConfirm = false;
  confirmApprove = false;
  tmpOderApprove: any;
  username: any;
  password: any;
  action: any;
  page: any;
  receiveIds = [];
  receiveOtherIds = [];
  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService,
    private router: Router,
    private accessCheck: AccessCheck,
    @Inject('REV_PREFIX') private documentPrefix: string,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token')
  }

  ngOnInit() {
    this.getPurchaseList();
  }

  async getPurchaseList() {
    this.modalLoading.show();
    try {
      const res: any = await this.receiveService.getPurchasesList();
      this.modalLoading.hide();
      if (res.ok) {
        this.purchases = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }


  async refresh(state: State) {
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.isSearch = false;
    this.modalLoading.show();
    if (!this.isSearching) {
      try {
        const rs = await this.receiveService.getWaiting(limit, offset);
        await this.getReceiveExpired();
        this.waitings = rs.rows;
        this.totalReceive = rs.total;
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
    } else {
      const rs = await this.receiveService.getWaitingSearch(limit, offset, this.query);
      await this.getReceiveExpiredSearch(this.query);
      this.waitings = rs.rows;
      this.totalReceive = rs.total;
      this.isSearching = true;
      this.modalLoading.hide();
    }
  }

  searchWaiting(event) {
    this.doSearchWaiting();
  }

  async doSearchWaiting() {
    try {
      this.modalLoading.show();
      let rs: any;
      if (!this.isSearch) {
        rs = await this.receiveService.getWaitingSearch(this.perPage, 0, this.query);
        await this.getReceiveExpiredSearch(this.query);
        await this.getReceiveOtherExpiredSearch();
        this.waitings = rs.rows;
        this.totalReceive = rs.total;
        this.isSearching = true;
        this.modalLoading.hide();
      } else {
        rs = await this.receiveService.getWaitingSearchOther(this.perPage, 0, this.query);
        await this.getReceiveExpiredSearch(this.query);
        await this.getReceiveOtherExpiredSearch();
        this.others = rs.rows;
        this.totalReceive = rs.total;
        this.isSearching = true;
        this.modalLoading.hide();
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async refreshOther(state: State) {
    this.isSearch = true;
    const offset = +state.page.from;
    const limit = +state.page.size;
    this.modalLoading.show();
    if (!this.isSearching) {
      try {
        const rs = await this.receiveService.getReceiveOther(limit, offset);
        await this.getReceiveOtherExpired();
        this.others = rs.rows;
        this.totalReceive = rs.total;
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
    } else {
      const rs = await this.receiveService.getWaitingSearchOther(limit, offset, this.query);
      await this.getReceiveOtherExpiredSearch();
      this.others = rs.rows;
      this.totalReceive = rs.total;
      this.isSearching = true;
      this.modalLoading.hide();
    }
  }

  removeReceive(w) {
    this.alertService.confirm('คุณต้องการลบรายการรับสินค้านี้ [' + w.receive_code + '] ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.receiveService.removeReceive(w.receive_id);
          if (rs.ok) {
            this.alertService.success();
            const idx = _.findIndex(this.waitings, { receive_id: w.receive_id });
            if (idx > -1) {
              this.waitings.splice(idx, 1);
            }
          } else {
            this.alertService.error();
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.serverError();
        }
      })
      .catch(() => {
        this.modalLoading.hide();
      });
  }

  removeReceiveOther(receive: any) {
    this.loading = true;
    this.alertService.confirm(`ต้องการลบรายการนี้ [${receive.receive_code}] ใช่หรือไม่?`)
      .then(async () => {
        try {
          const rs: any = await this.receiveService.removeReceiveOther(receive.receive_other_id);
          if (rs.ok) {
            const idx = _.findIndex(this.others, { receive_other_id: receive.receive_other_id });
            if (idx > -1) {
              this.others.splice(idx, 1);
            }
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();

        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }

      }).catch(() => {
        this.modalLoading.hide();
      });
  }

  clearSelectedApproved() {
    this.selectedApprove = [];
    this.selectedOtherApprove = [];
  }

  async getWaitingList() {
    try {
      this.loading = true;
      this.selectedApprove = [];
      const rs = await this.receiveService.getWaiting(this.perPage, 0);
      if (rs.ok) {
        this.waitings = rs.rows;
        this.totalReceive = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  async getOtherList() {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getReceiveOther(this.perPage, 0);
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
  async getReceiveExpired() {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getExpired();
      if (rs.ok) {
        this.expired = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getReceiveExpiredSearch(q) {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getExpiredSearch(q);
      if (rs.ok) {
        this.expired = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getReceiveOtherExpired() {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getOtherExpired();
      if (rs.ok) {
        this.otherExpired = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getReceiveOtherExpiredSearch() {
    try {
      this.modalLoading.show();
      this.selectedOtherApprove = [];
      const rs = await this.receiveService.getOtherExpiredSearch(this.query);
      if (rs.ok) {
        this.otherExpired = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async approveReceiveCheck(access: any, action: any) {
    let check = false
    let accessName: any
    this.titel = 'รายการรับสินค้า'
    if (access === 1) {
      accessName = 'WM_RECEIVE_APPROVE'
      this.action = 'WM_RECEIVES'
      this.page = 1
      _.forEach(this.selectedApprove, (v) => {
        if (!v.approve_id && v.purchase_order_number) {
          this.receiveIds.push(v.receive_id);
        }
      });
      this.receiveIds.length ? check = true : this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    } else if (access = 2) {
      accessName = 'WM_RECEIVE_OTHER_APPROVE'
      this.action = 'WM_RECEIVES_OTHER'
      this.page = 2
      _.forEach(this.selectedOtherApprove, (v) => {
        if (!v.approve_id) {
          this.receiveOtherIds.push(v.receive_other_id);
        }
      });
      this.receiveOtherIds.length ? check = true : this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }

    if (check) {
      const rs = await this.accessCheck.can(accessName);
      if (rs) {
        this.page === 1 ? this.saveApprove() : this.saveApproveOther();
      } else {
        this.username = ''
        this.password = ''
        this.openModalConfirm = true
      }
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

  saveApprove() {
    this.alertService.confirm('มีรายการที่ต้องการอนุมัติจำนวน ' + this.receiveIds.length + ' รายการ ต้องการอนุมัติใช่หรือไม่?')
      .then(() => {
        this.modalApprove.setReceiveIds(this.receiveIds);
        // this.receiveService.getProductReceives()
        //   .then((results: any) => {
        //     results.rows.forEach(e => {
        //       this.receiveService.updatePurchaseCompleted(e.purchase_order_id);
        //     });
        //   }).catch((error) => {
        //     // console.log(error)
        //   })
        this.modalApprove.openModal();
      }).catch(() => {
        // cancel
      });
  }

  async printDeliveryDate(showOption: any, sDate: any, eDate: any) {
    this.openModal = false;
    sDate = sDate.date.year + '-' + sDate.date.month + '-' + sDate.date.day
    eDate = eDate.date.year + '-' + eDate.date.month + '-' + eDate.date.day
    let url: any
    if (showOption === 1) {
      const urls = await `${this.apiUrl}/report/list/receiveDate/${sDate}/${eDate}?token=${this.token}`;
      url = urls
    } else if (showOption === 2) {
      const urls = await `${this.apiUrl}/report/list/receiveDateOther/${sDate}/${eDate}?token=${this.token}`;
      url = urls
    } else {
      // const urls = await `${this.apiUrl}/report/list/receive/${sDate}/${eDate}`;
      // url = urls
    }
    this.htmlPreview.showReport(url, 'landscape')

  }
  async printDeliveryId(showOption: any, sID: any, eID: any) {
    this.openModal = false;
    let url: any
    if (showOption === 1) {
      const urls = await `${this.apiUrl}/report/list/receiveCode/${sID}/${eID}?token=${this.token}`;
      url = urls
    } else if (showOption === 2) {
      const urls = await `${this.apiUrl}/report/list/receiveCodeOther/${sID}/${eID}?token=${this.token}`;
      url = urls
    } else {
      // const urls = await `${this.apiUrl}/report/list/receive/${sDate}/${eDate}`;
      // url = urls
    }
    this.htmlPreview.showReport(url, 'landscape');
    this.sID = ''
    this.eID = ''
  }

  async printPoId(showOption: any, sID: any, eID: any) {
    this.openModal = false;
    let url: any
    if (showOption === 1) {
      const urls = await `${this.apiUrl}/report/list/receivePo/${sID}/${eID}?token=${this.token}`;
      url = urls
    }
    this.htmlPreview.showReport(url, 'landscape')
    this.sIDpo = ""
    this.eIDpo = ""
  }

  printSelecOption() {
    const date = new Date();
    this.sDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.eDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.openModal = true;
  }

  printDeliveryNoteOther() {
    const receiveOtherIds = [];
    console.log(this.selectedOtherApprove);
    _.forEach(this.selectedOtherApprove, (v) => {
      if (true) {
        receiveOtherIds.push(v.receive_other_id);
      }
    });
    console.log(receiveOtherIds);
    if (receiveOtherIds.length) {
      this.alertService.confirm('พิมพ์ใบนำส่ง ' + receiveOtherIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          let strIds = '';
          receiveOtherIds.forEach((v: any) => {
            strIds += `receiveOtherID=${v}&`;
          });
          //       console.log(strIds);
          const url = `${this.apiUrl}/report/list/receiveOther?${strIds}&token=${this.token}`;
          this.htmlPreview.showReport(url, 'landscape');
        }).catch(() => {
          // cancel
        });

    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการพิมพ์ (เลือกรายการที่มีใบสั่งซื้อเท่านั้น)');
    }
  }

  printDeliveryNote() {
    const receiveIds = [];
    //  console.log(this.selectedApprove);
    _.forEach(this.selectedApprove, (v) => {
      if (v.purchase_order_number) {
        receiveIds.push(v.receive_id);
      }
    });

    if (receiveIds.length) {
      this.alertService.confirm('พิมพ์ใบนำส่ง ' + receiveIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          let strIds = '';
          receiveIds.forEach((v: any) => {
            strIds += `receiveID=${v}&`;
          });
          console.log(strIds);
          const url = `${this.apiUrl}/report/list/receive?${strIds}&token=${this.token}`;
          this.htmlPreview.showReport(url, 'landscape');
        }).catch(() => {
          // cancel
        });

    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการพิมพ์ (เลือกรายการที่มีใบสั่งซื้อเท่านั้น)');
    }
  }

  printProductRecive() {
    const receiveIds = [];
    _.forEach(this.selectedApprove, (v) => {
      if (v.purchase_order_number) {
        receiveIds.push(v.receive_id);
      }
    });

    if (receiveIds.length) {
      this.alertService.confirm('พิมพ์รายงานเวชภัณฑ์ที่รับจากการสั่งซื้อ ' + receiveIds.length + ' รายการ ใช่หรือไม่?')
        .then(() => {
          let strIds = '';
          receiveIds.forEach((v: any) => {
            strIds += `receiveID=${v}&`;
          });

          const url = `${this.apiUrl}/report/product/receive?${strIds}&token=${this.token}`;
          this.htmlPreview.showReport(url, 'landscape');
        }).catch(() => {

        });

    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการพิมพ์ (เลือกรายการที่มีใบสั่งซื้อเท่านั้น)');
    }
  }

  saveApproveOther() {
    this.alertService.confirm('มีรายการที่ต้องการอนุมัติจำนวน ' + this.receiveOtherIds.length + ' รายการ ต้องการอนุมัติใช่หรือไม่?')
      .then(() => {
        this.modalApproveOther.setReceiveIds(this.receiveOtherIds);
        this.modalApproveOther.openModal();
      }).catch(() => {
        // cancel
      });
  }

  approveSuccess(event: any) {
    this.getWaitingList();
  }

  approveSuccessOther(event: any) {
    this.getOtherList();
  }

  setShowOption(event: any) {
    this.showOption = event
  }

  closePurchase(purchaseId: any) {
    this.alertService.confirm('ต้องการเปลี่ยนสถานะใบสั่งซื้อนี้เป็น เสร็จสมบูรณ์ (ปิดรับ) ใช่หรือไม่? กรุณาตรวจสอบรายการรับที่ยังไม่อนุมัติรับเข้าคลังเพื่อความถูกต้อง')
      .then(() => {
        this.modalLoading.show();
        this.receiveService.updatePurchaseCompleted(purchaseId)
          .then((res: any) => {
            if (res.ok) {
              this.alertService.success();
              this.getPurchaseList();
            } else {
              this.alertService.error(res.error);
            }

            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(JSON.stringify(error));
          })
      })
      .catch(() => { });
  }
}
