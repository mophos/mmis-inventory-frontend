import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input } from '@angular/core';
import { IssueTransactionService } from 'app/staff/issue-transaction.service';

@Component({
  selector: 'wm-issues-list',
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent implements OnInit {
  @Input() issueId: any;
  loading = false;
  list = [];

  constructor(private issueService: IssueTransactionService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProductList(this.issueId);
  }

  async getProductList(issue_id) {
    this.loading = true;
    try {
      const result: any = await this.issueService.getEditGenericList(issue_id);
      this.loading = false;
      if (result.ok) {
        this.list = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }
}
