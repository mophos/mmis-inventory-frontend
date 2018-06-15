import { Component, OnInit, Input } from '@angular/core';
import { RequisitionService } from './../../staff/requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-requisition-order-items',
  templateUrl: './staff-requisition-order-items.component.html'
})
export class StaffRequisitionOrderItemsComponent implements OnInit {
  @Input() requisitionId: any;
  loading = false;
  items = [];

  constructor(private requisitionService: RequisitionService, private alertService: AlertService) { }

  ngOnInit() {
    this.loading = true;
    this.getGenericList();
  }

  async getGenericList() {

    try {
      const rs: any = await this.requisitionService.getRequisitionOrderItems(this.requisitionId);
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
