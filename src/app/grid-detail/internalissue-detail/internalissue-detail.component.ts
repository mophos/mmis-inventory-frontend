import { Component, OnInit, Input } from '@angular/core';
import { AlertService } from './../../alert.service';
import { IssueService } from './../../staff/issue.service';

@Component({
  selector: 'wm-internalissue-detail',
  templateUrl: './internalissue-detail.component.html',
  styleUrls: ['./internalissue-detail.component.css']
})
export class InternalissueDetailComponent implements OnInit {
  @Input() internalissueID: any;
  loading = false;
  internalissueDetail = [];


  constructor(
    private alertService: AlertService,
    private issueService: IssueService
  ) { }

  ngOnInit() {
    console.log("in_ng_onInit");
    console.log(this.internalissueID);
    this.loading = true;
    this.getProductList(this.internalissueID);
  }

  getProductList(internalIssueID: any) {
    this.issueService.getInternalIssueDetail(internalIssueID)
      .then((result: any) => {
        this.loading = false;
        if (result.ok) {
          this.internalissueDetail = result.rows;
          // console.log(result.rows);
          console.log(this.internalissueDetail);
        } else {
          console.log(result.error);
          this.alertService.error();
        }
      })
      .catch(error => {
        this.alertService.error(error.message)
      });
  }

}
