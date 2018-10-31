import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-product-location',
  templateUrl: './select-product-location.component.html'
})
export class SelectProductLocationComponent implements OnInit {
  _warehouseId: any;
  @Output() public onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public selectedId: any;
  @Input() public disabled: boolean;
  @Input('warehouseId')
  set setWarehouseId(value) {
    this._warehouseId = value;
    this.getLocations(this._warehouseId);
  }
  locations: any = [];
  locationId: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  async ngOnInit() {
    // if (this.warehouseId) {
    //   await this.getLocations(this.warehouseId);
    // }
  }

  async getLocations(warehouseId: any) {
    try {
      if (warehouseId) {
        const res = await this.basicService.getProductLocation(warehouseId);
        if (res.ok) {
          this.locations = res.rows;
          if (this.locations.length) {
            if (!this.selectedId) {
              this.locationId = this.locations[0].location_id;
              this.onSelect.emit(this.locations[0]);
            } else {
              this.locationId = this.selectedId;
              const idx = _.findIndex(this.locations, { 'location_id': this.locationId });
              if (idx > -1) {
                this.onSelect.emit(this.locations[idx]);
              }
            }
          } else {
            this.locationId = null;
          }
        } else {
          console.log(res.error);
          this.alertService.error(res.error);
        }
      }
    } catch (error) {
      console.log(error);

      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    const idx = _.findIndex(this.locations, { location_id: +this.locationId });
    if (idx > -1) {
      this.onSelect.emit(this.locations[idx]);
    }
  }

  clearLocation() {
    this.locations = [];
  }

}
