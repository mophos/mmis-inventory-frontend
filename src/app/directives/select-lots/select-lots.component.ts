import { LotService } from './../../admin/lot.service';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'app-select-lots',
  templateUrl: './select-lots.component.html',
  styleUrls: ['./select-lots.component.css']
})
export class SelectLotsComponent implements OnInit {
  @Input() public productId: any;
  @Input() public SelectedlotNo: any;
  @Input() public warehouseId: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  lots = [];
  lotNo = null;

  constructor(
    private lotService: LotService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    console.log("OnInit");
    console.log(this.productId);
    console.log("Selected Lot No");
    console.log(this.SelectedlotNo);
    console.log("warehouseId");
    console.log(this.warehouseId);
    this.getLots();
  }

  setSelect(event: any) {
    // console.log(this.lotId);
    // console.log(this.lots);
    const idx = _.findIndex(this.lots, { lot_no: this.SelectedlotNo });
    console.log(idx);
    if (idx > -1) {
      this.onSelect.emit(this.lots[idx]);
    }
  }

  getLots() {
    this.lotService.getLotsWarehouse(this.productId, this.warehouseId)
      .then((result: any) => {
        // this.loading = false;
        if (result.ok) {
          this.lots = result.rows;
          this.lotNo = this.SelectedlotNo;
          // console.log(this.requisitionDetail);
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
