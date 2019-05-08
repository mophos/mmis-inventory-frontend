import { StaffService } from './../staff.service';
import { JwtHelper } from 'angular2-jwt';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { AlertService } from "../../alert.service";

import * as _ from 'lodash';
@Component({
  selector: 'wm-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();
  token: string;
  logs: any = [];

  openModalAdjust = false;
  productNewId: any;

  warehouseCreateDate: string;
  warehouseName: string;
  warehouseLocation: string;
  warehouseType: string;
  warehouseId: string;
  query = '';
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

  generics: any = [];
  products: any = [];
  genericTypes = [];
  genericType: any = "";


  genericTypeMultis: any;
  @ViewChild('genericMultiGeneric') public genericMultiGeneric: any;
  @ViewChild('modalAdjust') modalAdjust: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('htmlPreview') public htmlPreview: any;
  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private staffService: StaffService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  async ngOnInit() {

    if (!this.warehouseId) {
      this.alertService.error('ไม่พบรหัสคลังสินค้า');
    } else {
      await this.getGenericType();
      this.getProducts();
      this.getGenerics();
    }
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.genericTypeMultis = this.genericMultiGeneric.getDefaultGenericType();
  }

  getProducts() {
    this.modalLoading.show();
    this.staffService.getProductsWarehouse(this.genericTypeMultis)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((e) => {
        this.modalLoading.hide();
        this.alertService.error(e.message);
      });
  }

  getGenerics() {
    this.modalLoading.show();
    this.staffService.getGenericsWarehouse(this.genericTypeMultis)
      .then((result: any) => {
        if (result.ok) {
          this.generics = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((e) => {
        this.modalLoading.hide();
        this.alertService.error(e.message);
      });
  }

  searchProducts() {
    this.modalLoading.show();
    // clear old product list
    this.products = [];
    this.staffService.getProductsWarehouse(this.genericTypeMultis, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((e) => {
        this.modalLoading.hide();
        this.alertService.error(e.message);
      });
  }

  async selectGenericTypeMulti(e) {
    this.genericTypeMultis = e;
    this.modalLoading.show();
    // clear old product list
    this.generics = [];
    this.staffService.getGenericsWarehouseSearch(e, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.generics = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((err) => {
        this.modalLoading.hide();
        this.alertService.error(err.message);
      });
  }

  async selectGenericTypeMultiProduct(e) {
    this.genericTypeMultis = e;
    this.modalLoading.show();
    // clear old product list
    this.products = [];
    this.staffService.getProductsWarehouse(e, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((err) => {
        this.modalLoading.hide();
        this.alertService.error(err.message);
      });
  }

  searchGenerics() {
    this.modalLoading.show();
    // clear old product list
    this.generics = [];
    this.staffService.getGenericsWarehouseSearch(this.genericTypeMultis, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.generics = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch((e) => {
        this.modalLoading.hide();
        this.alertService.error(e.message);
      });
  }

  // search when press ENTER
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchProducts();
    }
  }

  enterSearchGeneric(e) {
    if (e.keyCode === 13) {
      this.searchGenerics();
    }
  }

  changeQty(product) {
    this.doAdjust(product.wm_product_id, product.qty);
  }

  doAdjust(productNewId, adjQty) {
    this.productNewId = productNewId;
    this.modalAdjust.getProductDetail(productNewId, adjQty);
    this.openModalAdjust = true;
  }

  async successAdjust(event) {
    if (event) {
      this.getProducts();
    }
    this.openModalAdjust = false;
  }

  getStockCard(p) {

  }

  async getGenericType() {
    try {
      this.modalLoading.show();
      const rs = await this.staffService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
        this.genericType = rs.rows.length === 1 ? rs.rows[0].generic_type_id : "";
      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
      this.alertService.serverError();
    }
  }

  async deleteGeneric(genericId) {
    try {
      this.modalLoading.show();
      this.alertService.confirm('คุณต้องการลบรายการนี้')
        .then(async () => {
          const rs = await this.staffService.removeGeneric(genericId);
          this.modalLoading.hide();
          if (rs.ok) {
            await this.getGenerics();
            this.alertService.success();
          } else {
            this.alertService.error(rs.error)
          }
        })
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error);
    }
  }

  async deleteProduct(productId) {
    try {
      this.modalLoading.show();
      this.alertService.confirm('คุณต้องการลบรายการนี้')
        .then(async () => {
          const rs = await this.staffService.removeProduct(productId);
          this.modalLoading.hide();
          if (rs.ok) {
            await this.getProducts();
            this.alertService.success();
          } else {
            this.alertService.error(rs.error)
          }
        })
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error);
    }
  }

  reportRemain() {
    const url = `${this.apiUrl}/report/print/staff-remain?token=${this.token}`;
    console.log(url)
    this.htmlPreview.showReport(url);
  }

  exportRemain() {
    const url = `${this.apiUrl}/report/export/staff-remain?token=${this.token}`;
    window.open(url, '_blank');
  }
}
