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
    this.getLots();
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.lots, { lot_no: this.SelectedlotNo });
    if (idx > -1) {
      this.onSelect.emit(this.lots[idx]);
    }
  }

  getLots() {
    this.lotService.getLotsWarehouse(this.productId, this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.lots = result.rows;
          this.lotNo = this.SelectedlotNo;
        } else {
          console.log(result.error);
          this.alertService.error(result.error);
        }
      })
      .catch(error => {
        this.alertService.error(error.message)
      });
  }

}
