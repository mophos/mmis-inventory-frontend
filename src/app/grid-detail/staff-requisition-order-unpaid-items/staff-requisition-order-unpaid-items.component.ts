import { Component, OnInit, Input } from '@angular/core';
import { RequisitionService } from './../../staff/requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-requisition-order-unpaid-items',
  templateUrl: './staff-requisition-order-unpaid-items.component.html'
})
export class StaffRequisitionOrderUnpaidItemsComponent implements OnInit {
  @Input() unpaidId: any;
  loading = false;
  items = [];

  constructor(private requisitionService: RequisitionService, private alertService: AlertService) { }

  ngOnInit() {
    this.loading = true;
    this.getGenericList();
  }

  async getGenericList() {

    try {
      let rs: any = await this.requisitionService.getRequisitionOrderUnpaidItems(this.unpaidId);
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
