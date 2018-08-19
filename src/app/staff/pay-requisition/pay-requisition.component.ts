import { AccessCheck } from './../../access-check';
import { State } from '@clr/angular';
import { UploadingService } from './../../uploading.service';
import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  ChangeDetectorRef,
} from '@angular/core';

// import { RequisitionService } from "../requisition.service";
import { PayRequisitionService } from '../pay-requisition.service';
import { WarehouseService } from "../warehouse.service";
import { AlertService } from "../../alert.service";

import { JwtHelper } from 'angular2-jwt';
import { IRequisitionOrder } from 'app/shared';

@Component({
  selector: 'wm-pay-requisition',
  templateUrl: './pay-requisition.component.html',
  styles: []
})
export class PayRequisitionComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;

  filesToUpload: Array<File> = [];
  token: any;
  orders: any = [];
  approveds: any = [];
  unpaids: any = [];
  waitingApproves: any = [];
  requisitionSelected: Array<any> = [];
  // tabSelect: any = 0;
  selectedTab: any = 'waiting';
  offset = 0;
  perPage = 15;
  currentPage = 1;

  totalUnPaid = 0;
  totalApprove = 0;
  totalWaiting = 0;
  totalWaitingApprove = 0;
  totalApproveds
  jwtHelper: JwtHelper = new JwtHelper();

  query: any;
  fillterCancel = 'nCancel';

  tmpOderApprove: any;
  username: any;
  password: any;
  action: any;
  page: any;
  selectedCancel = [];
  openModalConfirm = false;
  confirmApprove = false;

  constructor(
    private alertService: AlertService,
    private requisitionService: PayRequisitionService,
    private accessCheck: AccessCheck,
    @Inject('DOC_URL') private docUrl: string,
    @Inject('REQ_PREFIX') private documentPrefix: string,
    @Inject('API_URL') private url: string,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.currentPage = +sessionStorage.getItem('currentPageRequisition') ? +sessionStorage.getItem('currentPageRequisition') : 1;
  }

  async ngOnInit() {
    this.loadData();
    this.selectedTab = sessionStorage.getItem('tabRequisitionStaff');
  }

  setTapActive(tab: any) {
    this.requisitionSelected = [];
    this.selectedTab = tab;
    sessionStorage.setItem('tabRequisitionStaff', tab);
  }

  async loadData() {
    await this.getWaiting();
    await this.getWaitingApprove();
    await this.getUnPaid();
    await this.getApproved();

  }

  async getWaiting() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionService.getWating(this.perPage, this.offset, this.query, this.fillterCancel);
      this.modalLoading.hide();
      if (rs.ok) {
        this.orders = rs.rows;
        this.totalWaiting = rs.total[0].total;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getUnPaid() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionService.getUnPaid(this.perPage, this.offset, this.query, null);
      this.modalLoading.hide();
      if (rs.ok) {
        this.unpaids = rs.rows;
        this.totalUnPaid = rs.total[0].total;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getWaitingApprove() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionService.getPayWaitingApprove(this.perPage, this.offset, this.query, this.fillterCancel);
      this.modalLoading.hide();
      if (rs.ok) {
        this.waitingApproves = rs.rows;
        this.totalWaitingApprove = rs.total[0].total;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getApproved() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionService.getApproved(this.perPage, this.offset, this.query);
      this.modalLoading.hide();
      if (rs.ok) {
        this.approveds = rs.rows;
        this.totalApprove = rs.total[0].total;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  refreshApprove(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageRequisitionStaff', this.currentPage.toString());
    this.getApproved();
  }

  refreshUnPaid(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageRequisitionStaff', this.currentPage.toString());
    this.getUnPaid();
  }

  refreshWaitingApprove(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageRequisitionStaff', this.currentPage.toString());
    this.getWaitingApprove();
  }

  refreshWaiting(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageRequisitionStaff', this.currentPage.toString());
    this.getWaiting();
  }

  async removeOrder(order: IRequisitionOrder) {
    this.alertService.confirm('ต้องการลบรายการนี้ [' + order.requisition_code + ']')
      .then(async () => {
        this.modalLoading.show();
        try {
          const rs: any = await this.requisitionService.removeRequisitionOrder(order.requisition_order_id);
          this.modalLoading.hide();
          if (rs.ok) {
            this.alertService.success();
            this.loadData();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(error.message);
        }
      }).catch(() => {
        this.modalLoading.hide();
      });
  }

  async approveRequisitionCheck(order: any) {
    const accessName = 'WM_REQUISITION_APPROVE'
    this.page = 1
    this.action = 'WM_REQUISITION_APPROVE'
    this.tmpOderApprove = order
    if (this.accessCheck.can(accessName)) {
      this.doApprove(this.tmpOderApprove)
    } else {
      this.openModalConfirm = true
    }
  }

  async checkApprove(username: any, password: any) {
    const rs: any = await this.requisitionService.checkApprove(username, password, this.action);
    if (rs.ok) {
      if (this.page === 1) {
        this.doApprove(this.tmpOderApprove)
        this.openModalConfirm = false
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ รายการเบิกสินค้า');
    }
  }

  close() {
    this.openModalConfirm = false
    this.username = ''
    this.password = ''
  }

  doApprove(order: any) {
    this.alertService.confirm('ต้องการอนุมัติรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        this.modalLoading.show();
        try {
          const rs: any = await this.requisitionService.saveApproveOrderConfirm(order.confirm_id);
          this.modalLoading.hide();
          if (rs.ok) {
            this.alertService.success();
            this.loadData();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }
      })
      .catch(() => {
        this.modalLoading.hide();
      });
  }
  printApprove() {
    const requisition_id: any = []
    let count: any = 0
    this.requisitionSelected.forEach(e => {
      if (e.is_cancel !== 'Y') {
        requisition_id.push('requisId=' + e.requisition_order_id);
        count++;
      }
    });
    if (count > 0) {
      const url = this.url + `/report/approve/requis?token=${this.token}&` + requisition_id.join('&');
      this.htmlPreview.showReport(url);
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }

  printSetProduct() {
    const requisition_id: any = []
    let count: any = 0
    this.requisitionSelected.forEach(e => {
      if (e.is_cancel !== 'Y') {
        requisition_id.push('requisId=' + e.requisition_order_id);
        count++;
      }
    });
    if (count > 0) {
      const url = this.url + `/report/list/requis?token=${this.token}&` + requisition_id.join('&');
      this.htmlPreview.showReport(url, 'landscape');
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }

  printUnPaid() {
    const requisition_id: any = []
    let count: any = 0
    this.requisitionSelected.forEach(e => {
      if (e.is_cancel !== 'Y') {
        requisition_id.push('requisId=' + e.requisition_order_id);
        count++;
      }
    });
    if (count > 0) {
      const url = this.url + `/report/UnPaid/requis?token=${this.token}&` + requisition_id.join('&');
      this.htmlPreview.showReport(url);
    } else {
      this.alertService.error('กรุณาเลือกรายการที่จะพิมพ์');
    }
  }

  async search() {
    try {
      this.modalLoading.show();
      this.currentPage = 1;
      if (this.selectedTab === 'waiting') {
        const rs: any = await this.requisitionService.getWating(this.perPage, 0, this.query, this.fillterCancel);
        if (rs.ok) {
          this.orders = rs.rows;
          this.totalWaiting = rs.total[0].total;
        } else {
          this.alertService.error(rs.error);
        }
      } else if (this.selectedTab === 'waitingApprove') {
        const rs: any = await this.requisitionService.getWaitingApprove(this.perPage, 0, this.query, this.fillterCancel);
        if (rs.ok) {
          this.waitingApproves = rs.rows;
          this.totalWaitingApprove = rs.total[0].total;
        } else {
          this.alertService.error(rs.error);
        }
      } else if (this.selectedTab === 'unpaid') {
        const rs: any = await this.requisitionService.getUnPaid(this.perPage, this.offset, this.query, this.fillterCancel);
        if (rs.ok) {
          this.unpaids = rs.rows;
          this.totalUnPaid = rs.total[0].total;
        } else {
          this.alertService.error(rs.error);
        }
      } else if (this.selectedTab === 'approved') {
        const rs: any = await this.requisitionService.getApproved(this.perPage, this.offset, this.query);
        if (rs.ok) {
          this.approveds = rs.rows;
          this.totalApproveds = rs.total[0].total;
        } else {
          this.alertService.error(rs.error);
        }
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
    this.modalLoading.hide();
  }

  keyUpSearch(e) {
    if (e.keyCode === 13) {
      this.search();
    } else if (this.query === '') {
      this.search();
    }
  }

  clearQuery() {
    this.query = '';
    this.search();
  }

  changeFillter() {
    if (this.selectedTab === 'waiting') {
      this.getWaiting();
    } else if (this.selectedTab === 'waitingApprove') {
      this.getWaitingApprove();
    } else if (this.selectedTab === 'unpaid') {
      this.getUnPaid();
    }
  }

  async removeOrderConfirm(order: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ [' + order.requisition_code + ']')
      .then(async () => {
        this.modalLoading.show();
        try {
          const rs: any = await this.requisitionService.removeOrderConfirm(order.confirm_id);
          this.modalLoading.hide();
          if (rs.ok) {
            this.alertService.success();
            this.getWaitingApprove();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.alertService.error(error.message);
        }
      }).catch(() => {
        this.modalLoading.hide();
      });
  }
}

