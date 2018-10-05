import { Component, OnInit, Input } from '@angular/core';
import { PayRequisitionService } from './../../staff/pay-requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-pay-requisition-order-unpaid-items',
  templateUrl: './staff-pay-requisition-order-unpaid-items.component.html',
  styleUrls: ['./staff-pay-requisition-order-unpaid-items.component.css']
})
export class StaffPayRequisitionOrderUnpaidItemsComponent implements OnInit {
  @Input() unpaidId: any;
  loading = false;
  items = [];

  constructor(private requisitionService: PayRequisitionService, private alertService: AlertService) { }

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