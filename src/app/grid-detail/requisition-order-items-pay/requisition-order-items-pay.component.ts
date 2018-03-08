import { Component, OnInit, Input } from '@angular/core';
import { RequisitionService } from './../../admin/requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-requisition-order-items-pay',
  templateUrl: './requisition-order-items-pay.component.html'
})
export class RequisitionOrderItemsPayComponent implements OnInit {
  @Input() requisitionId: any;
  @Input() showUnpaid: boolean = true;
  @Input() confirmId: any;

  loading = false;
  items = [];

  constructor(private requisitionService: RequisitionService, private alertService: AlertService) { }

  ngOnInit() {
    this.loading = true;
    this.getGenericList();
  }

  async getGenericList() {

    try {
      let rs: any = await this.requisitionService.getRequisitionOrderItemsPay(this.requisitionId, this.confirmId);
      this.loading = false;
      if (rs.ok) {
        this.items = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}
