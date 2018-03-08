import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-product-warehouse',
  templateUrl: './select-product-warehouse.component.html',
  styleUrls: ['./select-product-warehouse.component.css']
})
export class SelectProductWarehouseComponent implements OnInit {
  @Input() public selectedId: any;
  @Input() public productId: any;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  warehouses: any = [];
  warehouseId: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  ngOnInit() {
    // console.log('warehouseid: ', this.selectedId);
    
    if (this.productId) this.getWarehouses(this.productId);
  }

  async getWarehouses(productId: any) {
    try {
      let res = await this.basicService.getProductWarehouses(productId);
      if (res.ok) {
        this.warehouses = res.rows;
        if (this.warehouses.length) {
          if (this.selectedId) this.warehouseId = this.selectedId;
          else this.warehouseId = this.warehouses[0].warehouse_id;
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
