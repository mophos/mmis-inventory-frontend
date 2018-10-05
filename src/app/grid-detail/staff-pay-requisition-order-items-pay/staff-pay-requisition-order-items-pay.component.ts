import { Component, OnInit, Input } from '@angular/core';
import { PayRequisitionService } from './../../staff/pay-requisition.service';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-staff-pay-requisition-order-items-pay',
  templateUrl: './staff-pay-requisition-order-items-pay.component.html',
  styleUrls: ['./staff-pay-requisition-order-items-pay.component.css']
})
export class StaffPayRequisitionOrderItemsPayComponent implements OnInit {
  @Input() requisitionId: any;
  @Input() showUnpaid: boolean = true;
  @Input() confirmId: any;

  loading = false;
  items = [];

  constructor(private requisitionService: PayRequisitionService, private alertService: AlertService) { }

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
      console.log(this.items);
      
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}