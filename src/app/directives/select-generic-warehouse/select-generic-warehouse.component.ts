import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';
import { JwtHelper } from 'angular2-jwt';
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
  defaultWarehouse: any;
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.defaultWarehouse = decodedToken.warehouseId;
  }

  ngOnInit() {
    if (this.genericId) {
      this.getWarehouse(this.genericId);
    }
  }

  async getWarehouse(genericId: any) {
    try {
      const res = await this.basicService.getGenericWarehouses(genericId);
      if (res.ok) {
        this.warehouses = res.rows;
        if (this.warehouses.length) {
          if (this.selectedId) {
            this.warehouseId = this.selectedId;
            const idx = _.findIndex(this.warehouses, { "warehouse_id": this.warehouseId });
            this.onSelect.emit(this.warehouses[idx]);
          } else {
            const idx = _.findIndex(this.warehouses, { "warehouse_id": this.defaultWarehouse })
            if (idx > -1) {
              this.warehouseId = this.warehouses[idx].warehouse_id;
              this.onSelect.emit(this.warehouses[idx]);
            } else {
              this.warehouseId = this.warehouses[0].warehouse_id;
              this.onSelect.emit(this.warehouses[0]);
            }
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
    const warehouseId = event.target.value;
    const idx = _.findIndex(this.warehouses, { warehouse_id: +warehouseId });
    this.onSelect.emit(this.warehouses[idx]);
  }

  clearWarehousList() {
    this.warehouses = [];
  }

}
