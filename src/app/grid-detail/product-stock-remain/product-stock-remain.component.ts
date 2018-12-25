import { Component, OnInit, Input, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AlertService } from './../../alert.service';
import { ProductsService } from './../../admin/products.service';

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

  constructor(
    private productService: ProductsService,
    private alertService: AlertService
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
    console.log(r);

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
}
