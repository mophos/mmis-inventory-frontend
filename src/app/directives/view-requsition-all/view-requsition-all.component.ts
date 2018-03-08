import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProductsService } from '../../admin/products.service';
import { RequisitionService } from '../../admin/requisition.service';


import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-view-requsition-all',
  templateUrl: './view-requsition-all.component.html',
  styleUrls: ['./view-requsition-all.component.css']
})
export class ViewRequsitionAllComponent implements OnInit {
  @Input() public productId: any;
  @Input() public srcWarehouseId: any;
  requisition_all_qty: any;
  loading = false;

  constructor(
    private requisitionService: RequisitionService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if(this.productId && this.srcWarehouseId)
    {
     this.getAllRequisitionQty();
    }
  }

  getAllRequisitionQty(){
    this.requisitionService.getAllRequisitionQty(this.productId, this.srcWarehouseId)
    .then((result: any) => {
      this.loading = false;
      console.log(result);
      if (result.ok) {
        if (result.rows[0]) {
          this.requisition_all_qty = result.rows[0].allqty || 0;
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
