import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from './../warehouse.service';
import { AlertService } from '../../alert.service';

import * as _ from 'lodash';  

@Component({
  selector: 'wm-his-mappings',
  templateUrl: './his-mappings.component.html'
})
export class HisMappingsComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  mappings = [];

  constructor(
    private warehouseService: WarehouseService, 
    private alertService: AlertService) { }

  ngOnInit() {
    this.getMappings();
  }

  async getMappings() {
    this.modalLoading.show();
    try {
      let rs: any = await this.warehouseService.getMappingsGenerics();
      this.mappings = rs.rows;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  onChangeCode(his: any, generic: any) {
    let idx = _.findIndex(this.mappings, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.mappings[idx].mmis = generic.generic_id;
      this.mappings[idx].his = his;
    }
  }

  onChangeConversion(conversion: any, generic: any) {
    let idx = _.findIndex(this.mappings, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.mappings[idx].mmis = generic.generic_id;
      this.mappings[idx].conversion = +conversion;
    }
  }

  async save(generic: any) {
    if (generic.mmis && generic.his) {
      try {
        let conversion = generic.conversion || 1;
        let rs: any = await this.warehouseService.saveMapping(generic.mmis, generic.his, conversion);
        if (rs.ok) {
          this.alertService.success();
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        console.log(error);
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบ')
    }
    console.log(generic);
  }
}
