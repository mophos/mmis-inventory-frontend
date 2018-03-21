import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BasicService } from '../../basic.service';
import { AlertService } from '../../alert.service';

import * as _ from 'lodash';

@Component({
  selector: 'wm-select-warehouses',
  templateUrl: './select-warehouses.component.html',
  styles: []
})
export class SelectWarehousesComponent implements OnInit {

  warehouses = [];
  warehouseId = null;
  loading = false;

  @Input('disabled') disabled;

  @Input('selectedId')
  set setSelectedId(val) {
    this.warehouseId = val;
  }

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();


  constructor(private basicService: BasicService, private alertService: AlertService) { }

  ngOnInit() {
    this.getWarehouses();
  }

  async getWarehouses() {
    this.loading = true;
    try {
      this.warehouses = [];
      const res = await this.basicService.getWarehouses();
      this.loading = false;
      if (res.ok) {
        this.warehouses = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    const idx = _.findIndex(this.warehouses, { warehouse_id: +this.warehouseId });
    this.onSelect.emit(this.warehouses[idx]);
  }

  clearSelected() {
    this.warehouseId = null;
  }

  clearWarehouses() {
    this.warehouses = [];
  }
}