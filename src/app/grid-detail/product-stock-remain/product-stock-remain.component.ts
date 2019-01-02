
import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';

import { AlertService } from './../../alert.service';
import { ProductsService } from './../../admin/products.service';
import { WarehouseService } from './../../admin/warehouse.service';
import { EditLotExpiredComponent } from '../../modals/edit-lot-expired/edit-lot-expired.component';

@Component({
  selector: 'wm-product-stock-remain',
  templateUrl: './product-stock-remain.component.html',
  styleUrls: ['./product-stock-remain.component.css']
})
export class ProductStockRemainComponent implements OnInit {
  @ViewChild('unitList') public unitList: any;
  @Input() productId: any;
  @Input() warehouseId: any;
  loading = false;
  products = [];

  modalRepack = false;
  tmpProduct: any = [];
  selectQty: number = 0;
  selectUnit: any = [];

  cost: any;
  wmProductId: any;
  productName: any;
  openCost: boolean = false;


  @ViewChild('modalEditLotExpired') private modalEditLotExpired: EditLotExpiredComponent;
  constructor(
    private productService: ProductsService,
    private alertService: AlertService,
    private warehouseService: WarehouseService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductStockRemain();
    // this.getProductList(this.productId);
  }

  async getProductStockRemain() {
    this.loading = true;
    try {
      const rs = await this.productService.getProductStockDetail(this.productId, this.warehouseId)
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }


  async rePackage(r: any) {
    this.tmpProduct = r;
    this.selectQty = 0;
    this.unitList.setGenericId(this.tmpProduct.generic_id);
    this.unitList.setSelectedUnit(this.tmpProduct.unit_generic_id);
    this.modalRepack = true
  }

  async closeRepack() {
    this.modalRepack = false
    this.selectQty = 0;
    this.unitList.clearUnits();
  }

  async editChangeUnit(event) {
    this.selectUnit = event;
    this.selectQty = Math.floor((this.tmpProduct.qty - this.tmpProduct.reserve_qty) / this.selectUnit.qty)
  }
  onChangeQty(val) {
    let tmp = Math.floor((this.tmpProduct.qty - this.tmpProduct.reserve_qty) / this.selectUnit.qty)
    if (this.selectQty > tmp) {
      this.selectQty = tmp
    }
  }
  async saveRepack() {
    let param = {
      generic_id: this.tmpProduct.generic_id,
      wm_product_id: this.tmpProduct.wm_product_id,
      warehouse_id: this.tmpProduct.warehouse_id,
      product_id: this.tmpProduct.product_id,
      qty: this.selectQty * this.selectUnit.qty,
      lot_no: this.tmpProduct.lot_no,
      unit_generic_id: this.selectUnit.unit_generic_id,
      cost: this.tmpProduct.cost
    }

    this.tmpProduct
    this.alertService.confirm('ต้องการปรับ package ใช่ หรือ ไม่')
      .then(async () => {
        let rs = await this.productService.saveRepack(param)
        if (rs.ok) {
          this.alertService.success();
          this.closeRepack()
        } else {
          this.alertService.error(rs.message)
        }
      }).catch(async () => {

      })
  }

  changeCost(product: any) {
    this.cost = product.cost;
    this.wmProductId = product.wm_product_id;
    this.productName = product.product_name;
    this.openCost = true;
  }

  async saveCost() {
    if (this.wmProductId && this.cost) {
      try {
        const rs: any = await this.warehouseService.changeCost(this.wmProductId, this.cost);
        if (rs.ok) {
          this.getProductStockRemain();
          this.alertService.success();
          this.cost = 0;
          this.wmProductId = null;
          this.openCost = false;
          this.productName = null;
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      this.alertService.error('กรุณาระบุรายการสินค้า/ราคา');
    }
  }

  async editLotExpired(product: any) {
    try {
      const rs = await this.warehouseService.getExpiredSetting();
      if (rs.ok) {
        this.modalEditLotExpired.show(product);
        this.productId = product.product_id;
        product.expired_setting = rs.value;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error)
      this.alertService.serverError();
    }
  }

  async onSaveLotExpired(event) {
    try {
      const rs: any = await this.warehouseService.updateProductLotExpired(event);
      if (rs.ok) {
        this.getProductStockRemain();
        this.alertService.success();
        this.modalEditLotExpired.hide();
      } else {

        this.modalEditLotExpired.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalEditLotExpired.hide();
      console.log(error)
      this.alertService.serverError();
    }
  }
}
