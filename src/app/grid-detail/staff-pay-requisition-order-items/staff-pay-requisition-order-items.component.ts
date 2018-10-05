import { Component, OnInit, Input } from '@angular/core';
import { PayRequisitionService } from './../../staff/pay-requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-pay-requisition-order-items',
  templateUrl: './staff-pay-requisition-order-items.component.html',
  styleUrls: ['./staff-pay-requisition-order-items.component.css']
})
export class StaffPayRequisitionOrderItemsComponent implements OnInit {

  @Input() requisitionId: any;
  loading = false;
  items = [];

  constructor(private payRequisitionService: PayRequisitionService, private alertService: AlertService) { }

  ngOnInit() {
    this.loading = true;
    this.getGenericList();
  }

  async getGenericList() {

    try {
      const rs: any = await this.payRequisitionService.getRequisitionOrderItems(this.requisitionId);
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
