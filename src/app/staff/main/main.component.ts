import { StaffService } from './../staff.service';
import { JwtHelper } from 'angular2-jwt';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AlertService } from "../../alert.service";
import { ToThaiDatePipe } from "../../helper/to-thai-date.pipe";

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

  @ViewChild('modalAdjust') modalAdjust: any;
  @ViewChild('modalLoading') public modalLoading: any;

  openModalAdjust = false;
  productNewId: any;

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
  genericTypes = [];
  genericType: any = "";
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private toThaiDate: ToThaiDatePipe,
    private staffService: StaffService
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
      // this.getWarehouseDetail();
      this.getProducts();
    }
  }

  // getWarehouseDetail() {
  //   this.staffService.getWarehouseDetail(this.warehouseId)
  //     .then((result: any) => {
  //       if (result.ok && result.detail) {
  //         this.warehouseLocation = result.detail.location;
  //         this.warehouseName = result.detail.warehouse_name;
  //         this.warehouseCreateDate = result.detail.created_at;
  //         this.warehouseType = result.detail.type_name;
  //       } else {
  //         this.alertService.error('ไม่พบข้อมูลคลังสินค้าที่ต้องการ');
  //       }
  //     })
  //     .catch((e) => {
  //       this.alertService.error(e.message);
  //     });
  // }

  getProducts() {
    this.modalLoading.show();
    this.staffService.getProductsWarehouse(this.genericType)
      .then((result: any) => {
        if (result.ok) {
          result.rows.forEach(v => {
            try {
              v.large_qty = (v.qty / v.conversion);
            } catch (error) {
              v.large_qty = 0;
            }
          });
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

  searchProduct() {
    // if (this.query) {
      this.modalLoading.show();
      // clear old product list
      this.products = [];
      this.staffService.searchProductsWarehouse(this.warehouseId, this.query)
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
    // } else {
    //   this.alertService.error('กรุณาระบุคำค้นหา');
    // }
  }

  // search when press ENTER
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchProduct();
    }
  }

  changeQty(product) {
    this.doAdjust(product.wm_product_id, product.qty);
    // console.log(product.wm_product_id);

    //   const _p = _.clone(product);
    //   this.oldQty = _p.qty;
    //   this.adjProductNewId = product.id;
    //   this.adjProductName = product.product_name;
    //   this.adjProductId = product.product_id;
    //   this.adjLot = product.lot_no;
    //   this.adjExpiredDate = this.toThaiDate.transform(product.expired_date);
    //   this.adjSmallUnit = `${product.small_qty} x ${product.small_unit}`;
    //   this.adjLargeUnit = `${product.large_qty} x ${product.large_unit}`;
    //   this.adjQty = product.qty;
    //   this.adjReason = null;

    //   this.getAdjLogs(product.id);
    //   this.openModalQty = true;
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


}
