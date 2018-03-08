import { Component, OnInit, ViewChild } from '@angular/core';
import { WarehouseService } from './../warehouse.service';
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-his-mappings',
  templateUrl: './his-mappings.component.html'
})
export class HisMappingsComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;

  mappings = [];

  constructor(private warehouseService: WarehouseService, private alertService: AlertService) { }

  ngOnInit() {
    this.getMappings();
  }

  async getMappings() {
    this.modalLoading.show();
    try {
      let rs: any = await this.warehouseService.getMappings();
      this.mappings = rs.rows;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  removeItem(idx: any, productId: any) {
    this.alertService.confirm('ต้องการยกเลิกรายการ Mapping นี้ ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.warehouseService.removeMapping(productId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.mappings[idx].conversion = 1;
              this.mappings[idx].his = null;
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch((error: any) => {
            this.modalLoading.hide();
            this.alertService.error(error.message);
          });
      }).catch(() => { });
  }

  saveItem(mmis: any, his: any, conversion: any) {
    this.modalLoading.show();
    this.warehouseService.saveMapping(mmis, his, conversion)
      .then((rs: any) => {
        if (rs.ok) {
          this.alertService.success();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      });
  }
}
