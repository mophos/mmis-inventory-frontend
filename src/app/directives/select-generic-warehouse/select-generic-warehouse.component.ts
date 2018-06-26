import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { JwtHelper } from 'angular2-jwt';
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

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    // console.log('warehouseid: ', this.selectedId);
    this.getWarehouse();
  }

  async getWarehouse() {
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);

    try {
      let res = await this.basicService.getWarehouses();
      if (res.ok) {
        this.warehouses = res.rows;
        if (this.warehouses.length) {
          this.warehouseId = decodedToken.warehouseId;
          let idx = _.findIndex(this.warehouses, { "warehouse_id": +this.warehouseId });
          this.onSelect.emit(this.warehouses[idx]);
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
    let idx = _.findIndex(this.warehouses, { "warehouse_id": +warehouseId });
    this.onSelect.emit(this.warehouses[idx]);
  }

  clearWarehousList() {
    this.warehouses = [];
  }

}
