import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { State } from '@clr/angular';
import { IssueTransactionService } from 'app/staff/issue-transaction.service';
import { AlertService } from 'app/alert.service';
import { AccessCheck } from '../../access-check';

@Component({
  selector: 'wm-issue-transaction',
  templateUrl: './issue-transaction.component.html',
  styles: []
})
export class IssueTransactionComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;

  issues = [];
  total = 0;
  perPage = 20;
  status = '';
  
  selectedApprove: any = [];
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
    private issueService: IssueTransactionService,
    private alertService: AlertService,
    private accessCheck: AccessCheck,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
    this.getIssues();
  }



  async getIssues() {
    this.modalLoading.show();
    try {
      const rs = await this.issueService.list();
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

  close() {
    this.openModalConfirm = false
    this.username = ''
    this.password = ''
  }

  removeIssue(s: any) {
    this.alertService.confirm(`ต้องการลบรายการนี้ [${s.issue_code}] ใช่หรือไม่?`)
      .then(() => {
        this.modalLoading.show();
        this.modalLoading.hide();
        this.issueService.removeIssue(s.issue_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.getIssues();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.error);
          })
      })
      .catch(() => { })
  }

  async approveIssueCheck() {
   const accessName = 'WM_ISSUE_APPROVE'
    this.page = 1
    this.action = 'WM_ISSUES'
    this.titel = 'รายการใบตัดจ่าย'
    console.log(accessName);
    
    if (this.accessCheck.can(accessName)) {
      this.approveIssue()
      this.openModalConfirm = false
    } else {
      this.openModalConfirm = true
    }
  }

  async checkApprove(username: any, password: any) {
    let rs: any = await this.issueService.checkApprove(username, password, this.action);
    console.log(rs);

    if (rs.ok) {
      if (this.page === 1) {
        this.approveIssue()
      }
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ'+this.titel);
    }
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
      this.alertService.confirm(`มีรายการ ${issueIds.length} รายการ ที่ต้องการอนุมัติรายการใบตัดจ่าย ยืนยันใช่หรือไม่?`)
        .then(() => {
          this.modalLoading.show();
          this.issueService.approveIssue(issueIds)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getIssues();
              } else {
                this.alertService.error(rs.error);
              }
              this.modalLoading.hide();
            })
            .catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.error(error.message);
            });
        })
        .catch(() => {
          this.modalLoading.hide();
        })
    } else {
      this.alertService.error('ไม่พบรายการที่ต้องการอนุมัติ');
    }
    
    this.selectedApprove = [];
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
    const url = this.apiUrl + '/report/issueStraff/?' + poItems.join('&');
    console.log(poItems);
    console.log(url);

    this.htmlPreview.showReport(url);
  }

  async filterApproved(value: any) {
    try {
      const rs = await this.issueService.list();
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
  }

}
