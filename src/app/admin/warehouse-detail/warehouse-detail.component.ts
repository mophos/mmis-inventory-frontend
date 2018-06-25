import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../warehouse.service';
import { AlertService } from '../../alert.service';
import { ToThaiDatePipe } from '../../helper/to-thai-date.pipe';
import { EditLotExpiredComponent } from '../../modals/edit-lot-expired/edit-lot-expired.component';

import * as _ from 'lodash';

@Component({
  selector: 'wm-warehouse-detail',
  templateUrl: './warehouse-detail.component.html'
})
export class WarehouseDetailComponent implements OnInit {

  @ViewChild('modalAdjust') modalAdjust: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('modalEditLotExpired') private modalEditLotExpired: EditLotExpiredComponent;

  openCost: boolean = false;

  warehouseCreateDate: string;
  warehouseName: string;
  warehouseLocation: string;
  warehouseType: string;
  warehouseId: string;
  query: string;
  openModalQty = false;

  adjProductName: string;
  adjQty = 0;
  oldQty = 0;
  adjReason: string;
  adjProductId: any;
  adjProductNewId: any;
  adjLot: any;
  adjExpiredDate: string;
  adjLargeUnit: string;
  adjSmallUnit: string;

  products: any = [];
  logs: any = [];
  cost: any = 0;
  productId: any;
  productName: any;

  constructor(
    private warehouseService: WarehouseService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private toThaiDate: ToThaiDatePipe
  ) { }

  ngOnInit() {
    this.warehouseId = this.route.snapshot.params.warehouseId;
    if (!this.warehouseId) {
      this.alertService.error('ไม่พบรหัสคลังสินค้า');
      this.router.navigate(['/admin/warehouse']);
    } else {
      this.getWarehouseDetail();
      this.getProducts();
    }
  }

  getWarehouseDetail() {
    this.warehouseService.detail(this.warehouseId)
      .then((result: any) => {
        if (result.ok && result.detail) {
          this.warehouseLocation = result.detail.location;
          this.warehouseName = result.detail.warehouse_name;
          this.warehouseCreateDate = result.detail.created_at;
          this.warehouseType = result.detail.type_name;
        } else {
          this.alertService.error('ไม่พบข้อมูลคลังสินค้าที่ต้องการ');
          this.router.navigate(['/admin/warehouse']);
        }
      })
      .catch(() => {
        this.alertService.serverError();
        this.router.navigate(['/admin/warehouse']);
      });
  }

  getProducts() {
    this.modalLoading.show();
    this.warehouseService.getProductsWarehouse(this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  searchProduct() {
    if (this.query) {
      this.modalLoading.show();
      // clear old product list
      this.products = [];
      this.warehouseService.searchProductsWarehouse(this.warehouseId, this.query)
        .then((result: any) => {
          if (result.ok) {
            this.products = result.rows;
            this.ref.detectChanges();
          } else {
            this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
          }
          this.modalLoading.hide();
        })
        .catch(() => {
          this.modalLoading.hide();
          this.alertService.serverError();
        });
    } else {
      this.getProducts();
    }
  }

  // search when press ENTER
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchProduct();
    }
  }

  changeQty(product: any) {
    this.modalAdjust.getProductDetail(product.wm_product_id, product.qty);
    this.openModalQty = true;
  }

  changeCost(product: any) {
    this.cost = product.cost;
    this.productId = product.product_id;
    this.productName = product.product_name;
    this.openCost = true;
  }

  async saveCost() {
    if (this.productId && this.cost) {
      try {
        this.modalLoading.show();
        let rs: any = await this.warehouseService.changeCost(this.productId, this.cost);
        this.modalLoading.hide();
        if (rs.ok) {
          this.alertService.success();
          this.cost = 0;
          this.productId = null;
          this.openCost = false;
          this.productName = null;
        } else {
          this.alertService.error(rs.error);
        }
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(JSON.stringify(error));
      }
    } else {
      this.alertService.error('กรุณาระบุรายการสินค้า/ราคา');
    }
  }

  async editLotExpired(product: any) {
    try {
      this.modalLoading.show();
      const rs = await this.warehouseService.getExpiredSetting();
      if (rs.ok) {
        this.productId = product.product_id;
        product.expired_setting = rs.value;
        this.modalEditLotExpired.show(product);
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      console.log(error)
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  async onSaveLotExpired(event) {
    try {
      this.modalLoading.show();
      const rs: any = await this.warehouseService.updateProductLotExpired(event);
      if (rs.ok) {
        this.getProductHistory();
        this.getProducts();
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      console.log(error)
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  async getProductHistory() {
    try {
      this.modalLoading.show();
      const rs = await this.warehouseService.getProductHistory(this.productId);
      if (rs.ok) {
        this.modalEditLotExpired.setHistory(rs.rows);
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      console.log(error)
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  successAdjust(event) {
    this.openModalQty = false;
    this.getProducts();
  }

}
