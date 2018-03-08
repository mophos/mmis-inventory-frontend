import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasicService } from 'app/basic.service';
import { AlertService } from 'app/alert.service';
import { WarehouseService } from 'app/admin/warehouse.service';

import * as _ from 'lodash';

@Component({
  selector: 'wm-warehouse-product-planning',
  templateUrl: './warehouse-product-planning.component.html',
  styles: []
})
export class WarehouseProductPlanningComponent implements OnInit {

  warehouseId: any;
  warehouseName: any;
  groups: any = [];
  products: any = [];
  groupId: any;
  selected: any;

  @ViewChild('wmProductSeach') wmProductSeach;
  @ViewChild('modalLoading') modalLoading;

  constructor(
    private route: ActivatedRoute,
    private basicService: BasicService,
    private warehouseService: WarehouseService,
    private alertService: AlertService) {
    this.warehouseId = this.route.snapshot.paramMap.get('warehouseId');
  }

  ngOnInit() {
    this.getGroups();
    this.getPlanning();
    this.getWarehouseDetail();
  }

  async getWarehouseDetail() {
    try {
      let rs: any = await this.warehouseService.detail(this.warehouseId);
      if (rs.ok) {
        this.warehouseId = rs.detail.warehouse_id;
        this.warehouseName = rs.detail.warehouse_name;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }


  async getGroups() {
    try {
      let rs: any = await this.basicService.getGenericGroupsList();
      if (rs.ok) {
        this.groups = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async getPlanning() {
    try {
      this.modalLoading.show();
      let rs: any = await this.warehouseService.getProductPlannings(this.warehouseId);
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getProductInGroups() {
    if (this.groupId) {
      try {
        this.alertService.confirm('ต้องการเพิ่มรายการทั้งหมดใช่หรือไม่?')
          .then(() => {
            this.modalLoading.show();
            this.basicService.getGenericInGroups(this.groupId)
              .then((rs: any) => {
                if (rs.ok) {
                  // this.products = rs.rows;
                  rs.rows.forEach(v => {
                    let idx = _.findIndex(this.products, { generic_id: v.generic_id });
                    if (idx === -1) {
                      this.products.push(v);
                    }
                  });
                } else {
                  this.alertService.error(rs.error);
                }
                this.modalLoading.hide();

              })
              .catch((error: any) => {
                this.alertService.error(JSON.stringify(error));
                this.modalLoading.hide();
              });
          })
          .catch(() => {

          });
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error));
      }
    }
  }

  remove(genericId: any) {
    this.alertService.confirm('ต้องการลบรายการ ใช่หรือไม่?')
      .then(() => {
        let idx = _.findIndex(this.products, { generic_id: genericId });
        if (idx > -1) {
          this.products.splice(idx, 1);
        }
      }).catch(() => { });
  }

  changeMax(genericId: any, qty: any) {
    console.log(qty);

    let idx = _.findIndex(this.products, { generic_id: genericId });
    if (idx > -1) {
      this.products[idx].max_qty = qty;
    }
  }

  changeMin(genericId: any, qty: number) {
    let idx = _.findIndex(this.products, { generic_id: genericId });
    if (idx > -1) {
      this.products[idx].min_qty = qty;
    }
  }

  changeModifier(genericId: any, qty: number) {
    let idx = _.findIndex(this.products, { generic_id: genericId });
    if (idx > -1) {
      this.products[idx].min_modifier_qty = qty;
    }
  }

  changeQuota(genericId: any, qty: number) {
    let idx = _.findIndex(this.products, { generic_id: genericId });
    if (idx > -1) {
      this.products[idx].requisition_quota_qty = qty;
    }
  }

  setSelectedProduct(event) {
    let obj = {
      generic_name: event.generic_name,
      max_qty: 0,
      min_modifier_qty: 0,
      min_qty: 0,
      primary_unit_id: event.primary_unit_id,
      generic_id: event.generic_id,
      requisition_quota_qty: 0,
      unit_name: event.primary_unit_name,
      working_code: event.working_code
    }

    let idx = _.findIndex(this.products, { generic_id: event.generic_id });

    if (idx > -1) {
      this.alertService.error('รายการนี้มีอยู่แล้วไม่สามารถเพิ่มได้');
    } else {
      this.products.push(obj);
      this.alertService.success();
    }
  }

  // doAddProduct() {
  //   let idx = _.findIndex(this.products, { product_id: this.selected.product_id });
  //   if (idx > -1) {
  //     this.alertService.error('รายการนี้มีอยู่แล้วไม่สามารถเพิ่มได้');
  //   } else {
  //     this.products.push(this.selected);
  //     this.alertService.success();
  //     this.wmProductSeach.clearProductSearch();
  //     this.selected = null;
  //   }
  // }

  save() {
    if (this.products.length) {
      this.alertService.confirm('ต้องการบันทึกรายการ ใช่หรือไม่?')
        .then(() => {
          this.modalLoading.show();
          this.warehouseService.saveAllProductPlanningWarehouse(this.warehouseId, this.products)
            .then((rs: any) => {
              if (rs.ok) {
                this.alertService.success();
                this.getPlanning();
              } else {
                this.alertService.error(rs.error);
              }
              this.modalLoading.hide();
            })
            .catch((error: any) => {
              this.modalLoading.hide();
              this.alertService.serverError();
            });
        })
        .catch(() => {

        });
    } else {
      this.alertService.error('ไม่พบรายการท่ี่ต้องการบันทึก');
    }
  }

  cancelAll() {
    this.alertService.confirm('คุณต้องการยกเลิกรายการทั้งหมด ใช่หรือไม่? หลังจากยกเลิกแล้วกรุณาบันทึก')
      .then(() => {
        this.products = [];
      }).catch(() => { /* cancel */ });
  }

}
