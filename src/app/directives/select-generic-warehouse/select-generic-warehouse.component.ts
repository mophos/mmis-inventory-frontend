import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-generic-warehouse',
  templateUrl: './select-generic-warehouse.component.html'
})
export class SelectGenericWarehouseComponent implements OnInit {
  @Input() public selectedId: any;
  @Input() public genericId: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  warehouses: any = [];
  warehouseId: any;
  token: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  ngOnInit() {
    if (this.genericId) this.getWarehouse(this.genericId);
  }

  async getWarehouse(genericId: any) {
    console.log(genericId)
    try {
      let res = await this.basicService.getGenericWarehouses(genericId);
      if (res.ok) {
        this.warehouses = res.rows;
        if (this.warehouses.length) {
          if (this.selectedId) this.warehouseId = this.selectedId;
          else this.warehouseId = this.warehouseId[0].warehouse_id;
          this.onSelect.emit(this.warehouses[0]);
        }
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    let warehouseId = event.target.value;
    let idx = _.findIndex(this.warehouses, { warehouse_id: +warehouseId });
    this.onSelect.emit(this.warehouses[idx]);
  }

  clearWarehousList() {
    this.warehouses = [];
  }

}
