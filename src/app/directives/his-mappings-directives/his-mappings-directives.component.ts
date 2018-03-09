import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { AlertService } from '../../alert.service';
import { WarehouseService } from './../../admin/warehouse.service';

@Component({
  selector: 'wm-his-mappings-directives',
  templateUrl: './his-mappings-directives.component.html',
  styleUrls: ['./his-mappings-directives.component.css']
})
export class HisMappingsDirectivesComponent implements OnInit {
  @Input() public genericId: any;

  products: any = []

  constructor(
    private warehouseService: WarehouseService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getProducts();
  }

  async getProducts() {
    try {
      let rs: any = await this.warehouseService.getMappingsProducts(this.genericId);
      this.products = rs.rows;
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  removeItem(idx: any, productId: any) {
    this.alertService.confirm('ต้องการยกเลิกรายการ Mapping นี้ ใช่หรือไม่?')
      .then(() => {
        this.warehouseService.removeMapping(productId)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.products[idx].conversion = 1;
              this.products[idx].his = null;
            } else {
              this.alertService.error(rs.error);
            }
          })
          .catch((error: any) => {
            this.alertService.error(error.message);
          });
      }).catch(() => { });
  }

  saveItem(mmis: any, his: any, conversion: any) {
    this.warehouseService.saveMapping(mmis, his, conversion)
      .then((rs: any) => {
        if (rs.ok) {
          this.alertService.success();
        } else {
          this.alertService.error(rs.error);
        }
      })
      .catch((error: any) => {
        this.alertService.error(error.message);
      });
  }
}
