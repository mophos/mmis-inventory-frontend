import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { RequisitionService } from '../../admin/requisition.service';


import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-view-requsition-reserve',
  templateUrl: './view-requsition-reserve.component.html',
  styleUrls: ['./view-requsition-reserve.component.css']
})
export class ViewRequsitionReserveComponent implements OnInit {
  @Input() public productId: any;
  @Input() public srcWarehouseId: any;
  requisition_reseve_all_qty: any;
  loading = false;


  constructor(
    private requisitionService: RequisitionService,
    private alertService: AlertService)
     { }

  ngOnInit() {
  }

  getAllReseveRequisitonQty() {
    this.requisitionService.getAllReseveRequisitionQty(this.productId, this.srcWarehouseId)
    .then((result: any) => {
      this.loading = false;
      console.log(result);
      if (result.ok) {
        if (result.rows[0]) {
          this.requisition_reseve_all_qty = result.rows[0].allqty || 0;
        }
      } else {
        console.log("ตรงนี้ Error");
        console.log(result.error);
        this.alertService.error(JSON.stringify(result.error));
      }
    })
    .catch(error => {
      this.alertService.error(error.message);
    });
  }

}
