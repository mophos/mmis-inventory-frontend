import { Component, OnInit, Input } from '@angular/core';
import { RequisitionService } from './../../admin/requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-requisition-success-detail',
  templateUrl: './requisition-success-detail.component.html',
  styleUrls: ['./requisition-success-detail.component.css']
})
export class RequisitionSuccessDetailComponent implements OnInit {
  @Input() requisitionId: any;
  loading = false;
  requisitionSuccessDetail = [];
  constructor(
    private requisitionService: RequisitionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    console.log(this.requisitionId);
    this.loading = true;
    this.showSuccessDetail(this.requisitionId);
  }

    showSuccessDetail(requisitionId) {
    this.requisitionService.getSuccessDetail(requisitionId)
      .then((result: any) => {
        this.loading = false;
        if (result.ok) {
          this.requisitionSuccessDetail = result.rows;
          console.log(this.requisitionSuccessDetail);
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
