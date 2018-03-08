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
  loading: boolean = false;
  total = 0;
  perPage = 20;
  isSaving = false;
  status: any = '';

  selectedApprove: any = [];
  jwtHelper: JwtHelper = new JwtHelper();

  titel: any;
  isConfirm: any;
  openModalConfirm: boolean = false
  confirmApprove: boolean = false
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

  ) { }

  ngOnInit() {
    this.getIssues();
  }

  async getIssues() {
    this.modalLoading.show();
    try {
      let rs = await this.issueService.list();
      if (rs.ok) {
        this.issues = rs.rows;
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
    this.isSaving = true;
    this.alertService.confirm(`ต้องการลบรายการนี้ [${s.issue_code}] ใช่หรือไม่?`)
      .then(async () => {
        try {
          let rs: any = await this.issueService.removeIssue(s.issue_id);
          if (rs.ok) {
            this.alertService.success();
            this.getIssues();
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
    let rs: any = await this.issueService.checkApprove(username, password, this.action);

    if (rs.ok) {
      if (this.page === 1) {
        this.approveIssue()
        this.openModalConfirm = false
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ'+this.titel);
    }
  }

  close() {
    this.openModalConfirm = false
    this.username = ''
    this.password = ''
  }

  approveIssue() {
    // console.log(this.selectedApprove);
    const issueIds = [];
    this.selectedApprove.forEach((v: any) => {
      if (v.approved !== 'Y') {
        issueIds.push(v.issue_id);
      }
    });

    if (issueIds.length) {

      this.isSaving = true;

      this.alertService.confirm(`มีรายการ ${issueIds.length} รายการ ที่ต้องการอนุมัติรายการใบตัดจ่าย ยืนยันใช่หรือไม่?`)
        .then(async () => {
          try {
            let rs: any = await this.issueService.approveIssue(issueIds);
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
    this.isSaving = false;
  }

  refresh(state: State) {

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
    const url = this.apiUrl + '/report/issue/?' + poItems.join('&');
    this.htmlPreview.showReport(url);
  }

  async filterApproved(value: any) {
    try {
      let rs = await this.issueService.list();
      if (rs.ok) {
        if (value) {
          this.issues = rs.rows.filter(g => g.approved === value);
        } else {
          this.issues = rs.rows;
        }
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
    // console.log(this.issues);
  }
}
