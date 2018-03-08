import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import * as _ from 'lodash';
import { AlertService } from './../../alert.service';
import { BasicService } from '../../basic.service';

@Component({
  selector: 'wm-select-vendor',
  templateUrl: './select-vendor.component.html',
  styleUrls: ['./select-vendor.component.css']
})
export class SelectVendorComponent implements OnInit {

  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  vendors: any = [];

  constructor(private basicService: BasicService, private alertService: AlertService) { }
  
  ngOnInit() { }

  async getVendors(genericId: any) {
    try {
      this.vendors = [];
      let res = await this.basicService.getProductVendors(genericId);
      if (res.ok) {
        this.vendors = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelect(event) {
    let labelerId = event.target.value;
    let idx = _.findIndex(this.vendors, { labeler_id: labelerId });
    this.onSelect.emit(this.vendors[idx]);
  }

  clearVendor() {
    this.vendors = [];
  }

}
