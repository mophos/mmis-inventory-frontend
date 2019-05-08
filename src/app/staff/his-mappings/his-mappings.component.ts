import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from './../../admin/warehouse.service';
import { AlertService } from '../../alert.service';
import { StaffService } from './../staff.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-his-mappings',
  templateUrl: './his-mappings.component.html'
})
export class HisMappingsComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;

  mappings = [];
  query = '';
  genericType: any;
  @ViewChild('genericTypes') public genericTypes: any;
  constructor(
    private warehouseService: WarehouseService,
    private staffService: StaffService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.genericType = this.genericTypes.getDefaultGenericType();
    this.searchMappings();
  }
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchMappings();
    }
  }
  selectGenericTypeMulti(e) {
    this.genericType = e;
    this.searchMappings();
  }
  async searchMappings() {
    try {
      this.modalLoading.show();
      const rs: any = await this.warehouseService.getSearchStaffMappings(this.query, this.genericType);
      if (rs.ok) {
        this.mappings = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  onChangeCode(his: any, generic: any) {
    const idx = _.findIndex(this.mappings, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.mappings[idx].mmis = generic.generic_id;
      this.mappings[idx].his = his;
    }
  }

  onChangeConversion(conversion: any, generic: any) {
    const idx = _.findIndex(this.mappings, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.mappings[idx].mmis = generic.generic_id;
      this.mappings[idx].conversion = +conversion;
    }
  }

  async save(generic: any) {
    if (generic.mmis && generic.his) {
      try {
        const conversion = generic.conversion || 1;
        const rs: any = await this.warehouseService.saveMapping(generic.mmis, generic.his, conversion);
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
  }
}
