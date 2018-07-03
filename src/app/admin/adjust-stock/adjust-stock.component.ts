import { AdjustStockService } from './../adjust-stock.service';
import { GenericService } from './../generic.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WarehouseService } from '../warehouse.service';
import { AlertService } from '../../alert.service';
import { EditLotExpiredComponent } from '../../modals/edit-lot-expired/edit-lot-expired.component';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import { ProductsService } from '../products.service';
@Component({
  selector: 'wm-adjust-stock',
  templateUrl: './adjust-stock.component.html'
})
export class AdjustStockComponent implements OnInit {


  @ViewChild('modalLoading') public modalLoading: any;

  jwtHelper: JwtHelper = new JwtHelper();
  decodedToken: any;
  warehouseId: any;
  lists: any;
  constructor(
    private adjustStockService: AdjustStockService,
    private alertService: AlertService,
  ) {
    const token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(token);
  }

  ngOnInit() {
    this.warehouseId = this.decodedToken.warehouseId;
    this.getLists();
  }

  async getLists() {
    this.modalLoading.show();
    try {
      const rs: any = await this.adjustStockService.getList();
      if (rs) {
        this.lists = rs.rows;
        await this.getDetails();
        this.modalLoading.hide();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error)
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(error.error));
    }

  }

  async getDetails() {
    try {
      for (const l of this.lists) {
        const rs: any = await this.adjustStockService.getGeneric(l.adjust_id);
        if (rs) {
          l.generics = rs.rows;
        }
      }
    } catch (error) {
      this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(error.error));
    }

  }

  // getGenerics() {
  //   this.modalLoading.show();
  //   this.genericService.getGenericInWarehouse()
  //     .then((result: any) => {
  //       if (result.ok) {
  //         this.generics = result.rows;
  //         this.getProducts();
  //       } else {
  //         this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
  //       }
  //       this.modalLoading.hide();
  //     })
  //     .catch(() => {
  //       this.modalLoading.hide();
  //       this.alertService.serverError();
  //     });
  // }

  // searchProduct() {
  //   if (this.query) {
  //     this.modalLoading.show();
  //     // clear old product list
  //     this.products = [];
  //     this.warehouseService.searchProductsWarehouse(this.warehouseId, this.query)
  //       .then((result: any) => {
  //         if (result.ok) {
  //           this.products = result.rows;
  //           this.ref.detectChanges();
  //         } else {
  //           this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
  //         }
  //         this.modalLoading.hide();
  //       })
  //       .catch(() => {
  //         this.modalLoading.hide();
  //         this.alertService.serverError();
  //       });
  //   } else {
  //     this.getProducts();
  //   }
  // }

  // search when press ENTER
  // enterSearch(e) {
  //   if (e.keyCode === 13) {
  //     this.searchProduct();
  //   }
  // }

  // changeQty(product: any) {
  //   this.modalAdjust.getProductDetail(product.wm_product_id, product.qty);
  //   this.openModalQty = true;
  // }

  // changeCost(product: any) {
  //   this.cost = product.cost;
  //   this.productId = product.product_id;
  //   this.productName = product.product_name;
  //   this.openCost = true;
  // }

  // successAdjust(event) {
  //   this.openModalQty = false;
  //   this.getProducts();
  // }

  // editChangeAdjust(genericId, qty) {
  //   let check = true;
  //   const idx = _.findIndex(this.generics, { 'generic_id': genericId });
  //   if (idx > -1) {
  //     this.generics[idx].qty = qty.value;
  //   }
  //   const qtyAdjust = qty.value / this.generics[idx].products.length;
  //   const isDigit = qtyAdjust - Math.floor(qtyAdjust) > 0 ? true : false;
  //   for (const p of this.generics[idx].products) {
  //     if (isDigit) {
  //       if (check) {
  //         check = false;
  //         p.qty = Math.floor(qtyAdjust) + 1
  //       } else {
  //         p.qty = Math.floor(qtyAdjust);
  //       }
  //     } else {
  //       p.qty = qtyAdjust;
  //     }
  //   }
  // }

  // changeQtyGrid(e) {
  //   console.log(e);

  //   let total_base = 0;
  //   e.forEach(v => {
  //     total_base += (+v.qty);
  //   });

  //   const idx = _.findIndex(this.generics, { 'generic_id': e[0].generic_id });
  //   if (idx > -1) {
  //     this.generics[idx].qty = total_base;
  //   }
  // }
}
