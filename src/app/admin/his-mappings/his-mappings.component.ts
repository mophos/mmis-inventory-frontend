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
  query = '';

  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getMappings();
  }

  async getMappings() {
    this.modalLoading.show();
    try {
      const rs: any = await this.warehouseService.getMappingsGenerics();
      this.mappings = rs.rows;
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
    console.log(generic);
  }

  async removeMapping(generic: any) {
    this.alertService.confirm('ต้องการลบ Mapping นี้ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.warehouseService.removeMapping(generic.generic_id);
          this.modalLoading.hide();
          if (rs.ok) {
            const idx = _.findIndex(this.mappings, { generic_id: generic.generic_id });
            if (idx > -1) {
              this.mappings[idx].conversion = 1;
              this.mappings[idx].his = null;
            }
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        }
      }).catch(() => { });
  }

  enterSearchGeneric(e) {
    if (e.keyCode === 13) {
      // this.searchGenerics();
      console.log(this.query, 'asd');
    }
  }
}
