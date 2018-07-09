import { Component, OnInit, Input, Inject, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-receive-lots',
  templateUrl: './select-receive-lots.component.html',
  styleUrls: ['./select-receive-lots.component.css']
})
export class SelectReceiveLotsComponent implements OnInit {

  @Input() public selectedLotNo: any;
  @Input() public productId: any;
  @Input() public showAdd: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('modalLot') public modalLot;

  lots: any = [];
  lotNo: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  ngOnInit() {
    if (this.productId) {
      this.getLots(this.productId);
    }
  }

  setProductId(productId: any) {
    if (productId) {
      this.productId = productId;
      this.getLots(this.productId);
    }
  }

  async getLots(productId: any) {
    try {
      const res = await this.basicService.getProductLots(productId);
      if (res.ok) {
        this.lots = res.rows;
        if (this.lots.length) {
          if (this.selectedLotNo) {
            this.lotNo = this.selectedLotNo;
          } else {
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
    const lotNo = event.target.value;
    const idx = _.findIndex(this.lots, { lot_no: lotNo });
    this.onSelect.emit(this.lots[idx]);
  }

  clearLots() {
    this.lots = [];
    this.productId = null;
  }

  addLots() {
    if (this.productId) {
      this.modalLot.openModal();
    } else {
      this.alertService.error('กรุณาระบุรายการสินค้า');
    }
  }

  onCloseLotModal(event) {
    this.getLots(this.productId);
  }
}
