import { ReceiveService } from "./../../admin/receive.service";
import { Component, OnInit, Input, EventEmitter, Output, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';

@Component({
  selector: 'wm-select-receive-unit',
  templateUrl: './select-receive-unit.component.html'
})
export class SelectReceiveUnitComponent implements OnInit {

  @Input() public genericId: any;
  @Input() public showAdd: boolean;
  @Input() public selectedUnitGenericId: any;
  @Input() public disabled: any;
  @Input('orderBy') orderBy = 'ASC';

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('modalUom') public modalUom: any;
  
  units = [];
  unitGenericId = null;
  loading = false;

  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    if (this.genericId) {
      this.getUnits(this.genericId);
    }
  }

  setSelect(event: any) {
    const idx = _.findIndex(this.units, { unit_generic_id: +event.target.value });
    if (idx > -1) {
      this.onSelect.emit(this.units[idx]);
    }
  }

  setSelectedUnit(unitGienericId: any) {
    this.unitGenericId = unitGienericId;
  }

  setGenericId(genericId: any, orderBy: any = 'ASC') {
    this.units = [];
    this.genericId = genericId;
    let _orderBy = this.orderBy ? this.orderBy : orderBy;

    this.getUnits(this.genericId, orderBy);
  }

  async getUnits(genericId: any, orderBy: any = 'ASC') {
    try {
      this.loading = true;
      this.units = [];
      let _orderBy = this.orderBy ? this.orderBy : orderBy;

      const rs: any = await this.receiveService.getUnitConversion(genericId, _orderBy);
      if (rs.ok) {
        this.units = rs.rows;
        this.loading = false;
        if (this.units.length) {
          if (this.selectedUnitGenericId) {
            this.unitGenericId = this.selectedUnitGenericId;
            const idx = _.findIndex(this.units, { unit_generic_id: this.selectedUnitGenericId });
            if (idx > -1) {
              this.onSelect.emit(this.units[idx]);
            } else {
              this.onSelect.emit(this.units[0]);
            }
          } else {
            this.selectedUnitGenericId = this.units[0].unit_generic_id;
            this.unitGenericId = this.selectedUnitGenericId;
            this.onSelect.emit(this.units[0]);
          }
        }
      } else {
        console.log(rs.error);
        this.loading = false;
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
    }

  }

   clearUnits() {
    this.genericId =  null;
    this.units =  [];
    this.selectedUnitGenericId = ''
    // this.modalUom.clearUnits();
  }

  successUnitModal(event) {
    this.getUnits(this.genericId);
  }
}
