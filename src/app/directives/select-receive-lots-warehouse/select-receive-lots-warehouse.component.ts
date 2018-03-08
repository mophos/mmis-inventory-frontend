import { Component, OnInit, Input, Inject, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-receive-lots-warehouse',
  templateUrl: './select-receive-lots-warehouse.component.html'
})
export class SelectReceiveLotsWarehouseComponent implements OnInit {

  @Input() public selectedLotNo: any;
  @Input() public productId: any;
  @Input() public warehouseId: any;
  @Input() public showAdd: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  lots: any = [];
  lotNo: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  ngOnInit() {
    if (this.productId) this.getLots(this.productId, this.warehouseId);
  }

  setProductId(productId: any) {
    if (productId) {
      this.productId = productId;
      this.getLots(this.productId, this.warehouseId);
    }
  }

  async getLots(productId: any, warehouseId: any) {
    // this.productId = productId;
    try {
      let res = await this.basicService.getProductLotsWarehouse(productId, warehouseId);
      if (res.ok) {
        this.lots = res.rows;
        if (this.lots.length) {
          if (this.selectedLotNo) this.lotNo = this.selectedLotNo;
          else {
            this.lotNo = this.lots[0].lot_no;
            this.onSelect.emit(this.lots[0]);
          }
        }
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    let lotNo = event.target.value;
    // if (lotNo === '_ADD_') {
    //   this.addLots();
    //   this.modalLot.setProductId(this.productId);
    // } else {
      let idx = _.findIndex(this.lots, { lot_no: lotNo });
      this.onSelect.emit(this.lots[idx]);
    // }
  }

  clearLots() {
    this.lots = [];
    this.productId = null;
    // this.modalLot.clearLots();
  }

}
