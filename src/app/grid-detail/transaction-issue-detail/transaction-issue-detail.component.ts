import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';
import { IssueService } from './../../admin/issue.service';

@Component({
  selector: 'wm-transaction-issue-detail',
  templateUrl: './transaction-issue-detail.component.html',
  styleUrls: ['./transaction-issue-detail.component.css']
})
export class TransactionIssuedetailComponent implements OnInit {
  @Input() issueId: any;
  loading = false;
  products = [];

  constructor(
    private issueService: IssueService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductList();
  }

  async getProductList() {
    this.loading = true;
    try {
      const rs = await this.issueService.getGenericList(this.issueId)
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}
