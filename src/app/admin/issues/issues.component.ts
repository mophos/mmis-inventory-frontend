import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { IssueService } from 'app/admin/issue.service';
import { AlertService } from 'app/alert.service';

import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { AccessCheck } from '../../access-check';
@Component({
  selector: 'wm-issues',
  templateUrl: './issues.component.html',
  styles: []
})
export class IssuesComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;
  issues = [];
  loading = false;
  total = 0;
  perPage = 15;
  isSaving = false;
  status: any = '';
  token: any;
  currentPage = 0;
  offset = 0;

  selectedApprove: any = [];
  jwtHelper: JwtHelper = new JwtHelper();

  titel: any;
  isConfirm: any;
  openModalConfirm = false
  confirmApprove = false
  tmpOderApprove: any
  username: any
  password: any
  action: any
  page: any

  constructor(
    private issueService: IssueService,
    private alertService: AlertService,
    private router: Router,
    private accessCheck: AccessCheck,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    this.currentPage = +sessionStorage.getItem('currentPageIssue') ? +sessionStorage.getItem('currentPageIssue') : 1;
  }

  ngOnInit() { }

  async refresh(state: State) {
    this.offset = +state.page.from;
    sessionStorage.setItem('currentPageIssue', this.currentPage.toString());
    this.modalLoading.show();
    try {
      const rs = await this.issueService.list(this.perPage, this.offset, this.status);
      this.issues = rs.rows;
      this.total = rs.total;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getIssues() {
    this.modalLoading.show();
    try {
      const rs = await this.issueService.list(this.perPage, this.offset, this.status);
      if (rs.ok) {
        this.issues = rs.rows;
        this.total = +rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  removeIssue(s: any) {
    this.alertService.confirm(`ต้องการลบรายการนี้ [${s.issue_code}] ใช่หรือไม่?`)
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.issueService.removeIssue(s.issue_id);
          if (rs.ok) {
            this.alertService.success();
            await this.getIssues();
          } else {
            this.alertService.error(rs.error);
          }

          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.error);
        }
      })
      .catch(() => {
        this.modalLoading.hide();
      })
  }

  async approveIssueCheck() {
    const accessName = 'WM_ISSUE_APPROVE'
    this.page = 1
    this.action = 'WM_ISSUES'
    this.titel = 'รายการใบตัดจ่าย'

    if (this.accessCheck.can(accessName)) {
      this.approveIssue()
    } else {
      this.openModalConfirm = true
    }
  }

  async checkApprove(username: any, password: any) {
    const rs: any = await this.issueService.checkApprove(username, password, this.action);

    if (rs.ok) {
      if (this.page === 1) {
        this.approveIssue()
        this.openModalConfirm = false
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ' + this.titel);
    }
  }

  close() {
    this.openModalConfirm = false
    this.username = ''
    this.password = ''
  }

  approveIssue() {
    const issueIds = [];
    this.selectedApprove.forEach((v: any) => {
      if (v.approved !== 'Y' && v.is_cancel !== 'Y') {
        issueIds.push(v.issue_id);
      }
    });

    if (issueIds.length) {
      this.alertService.confirm(`มีรายการ ${issueIds.length} รายการ ที่ต้องการอนุมัติรายการใบตัดจ่าย ยืนยันใช่หรือไม่?`)
        .then(async () => {
          try {
            this.modalLoading.show();
            const rs: any = await this.issueService.approveIssue(issueIds);
            if (rs.ok) {
              this.alertService.success();
              this.getIssues();
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
          // cancel
          this.modalLoading.hide();
        })
    } else {
      this.selectedApprove = [];
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
  }

  showReport(issues_id: any) {
    const poItems: Array<any> = [];
    if (issues_id === '') {
      this.selectedApprove.forEach((value: any, index: number) => {
        poItems.push('issue_id=' + value.issue_id);
      });
    } else {
      poItems.push('issue_id=' + issues_id);
    }
    const url = this.apiUrl + `/report/issue/?token=${this.token}&` + poItems.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }

  changeStatus() {
    this.getIssues();
  }

}
