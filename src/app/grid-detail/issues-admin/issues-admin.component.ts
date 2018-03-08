import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input } from '@angular/core';
import { IssueService } from 'app/admin/issue.service';

@Component({
  selector: 'wma-issues-list',
  templateUrl: './issues-admin.component.html',
  styleUrls: ['./issues-admin.component.css']
})
export class IssuesAdminComponent implements OnInit {
    @Input() issueId: any;
    loading = false;
    list = [];
  
    constructor(private issueService: IssueService, private alertService: AlertService) { }
  
    ngOnInit() {
      this.getProductList(this.issueId);
    }
  
    async getProductList(issue_id) {
      this.loading = true;
      try {
        const result: any = await this.issueService.getGenericsDetail(issue_id);
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