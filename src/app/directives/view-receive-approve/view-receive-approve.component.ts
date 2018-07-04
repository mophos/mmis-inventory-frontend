import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

import { ReceiveService } from '../../admin/receive.service';
import { RequisitionService } from '../../admin/requisition.service';

import { IProductReceive, IReceive } from "../../models";
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-view-receive-approve',
  templateUrl: './view-receive-approve.component.html',
  styleUrls: ['./view-receive-approve.component.css']
})
export class ViewReceiveApproveComponent implements OnInit {
  @Input() public productId: any;
  loading = false;
  products: any[] = [];
  receive_remain_qty: any;

  constructor(
    private requisitionService: RequisitionService,
    private alertService: AlertService,
  ) { }

  ngOnInit() {
    if (this.productId) {
      this.getProductList();
    }
  }

  getProductList() {
    this.requisitionService.getReceiveProductRemain(this.productId)
      .then((result: any) => {
        this.loading = false;
        if (result.ok) {
          if (result.rows[0]) {
            this.receive_remain_qty = result.rows[0].qty || 0;
          }
        } else {
          console.log(result.error);
          this.alertService.error(JSON.stringify(result.error));
        }
      })
      .catch(error => {
        this.alertService.error(error.message);
      });
  }

}
