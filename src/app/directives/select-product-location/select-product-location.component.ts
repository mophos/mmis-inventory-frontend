import { Component, OnInit, Input, Inject, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-product-location',
  templateUrl: './select-product-location.component.html'
})
export class SelectProductLocationComponent implements OnInit {
  @Output() public onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public selectedId: any;
  @Input() public warehouseId: any;
  locations: any = [];
  locationId: any;

  constructor(
    @Inject('API_URL') private url: string,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  async ngOnInit() {
    if (this.warehouseId) {
      await this.getLocations(this.warehouseId);
    }
  }

  async getLocations(warehouseId: any) {
    try {
      if (warehouseId) {
        const res = await this.basicService.getProductLocation(warehouseId);
        if (res.ok) {
          this.locations = res.rows;
          if (this.locations.length) {
            if (!this.selectedId) {
              this.locationId = this.locations.lenght ? this.locations[0].location_id : null;
              this.onSelect.emit(this.locations[0]);
            } else {
              this.locationId = this.selectedId;
            }
          } 
        } else {
          this.alertService.error(res.error);
        }
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    const idx = _.findIndex(this.locations, { location_id: +this.locationId });
    this.onSelect.emit(this.locations[idx]);
  }

  clearLocation() {
    this.locations = [];
  }

}
