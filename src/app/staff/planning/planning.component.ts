import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingModalComponent } from 'app/modals/loading-modal/loading-modal.component';
import { AlertService } from 'app/alert.service';
import { StaffService } from 'app/staff/staff.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';

@Component({
  selector: 'wm-planning',
  templateUrl: './planning.component.html',
  styles: []
})
export class PlanningComponent implements OnInit {

  products: any = [];
  generics: any = [];
  genericTypes = [];
  genericType: any = "";
  token: string;
  jwtHelper: JwtHelper = new JwtHelper();
  warehouseId: any;
  query: any;
  _generics: any = [];
  @ViewChild('modalLoading') public modalLoading: LoadingModalComponent;

  constructor(
    private alertService: AlertService,
    private staffService: StaffService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  async ngOnInit() {
    await this.getGenericType();
    await this.getProducts();
  }

  async getProducts() {
    this.modalLoading.show();
    try {
      let rs: any = await this.staffService.getProductsWarehouse(this.genericType);
      if (rs.ok) {
        rs.rows.forEach(v => {
          try {
            v.old_qty = v.qty;
            v.large_qty = (v.qty / v.conversion);
          } catch (error) {
            v.old_qty = 0;
            v.large_qty = 0;
          }
        });
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getGenerics() {
    this.modalLoading.show();
    try {
      let rs: any = await this.staffService.getGenericsWarehosue(this.genericType);
      if (rs.ok) {
        this.generics = rs.rows;
        this._generics = _.clone(this.generics)
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  onChangeQty(product: any, qty: any) {
    let idx = _.findIndex(this.products, { wm_product_id: product.wm_product_id });
    if (idx > -1) {
      this.products[idx].qty = +qty;
    }
  }

  onChangeMin(generic: any, qty: any) {
    try {
      const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
      if (idx > -1) {
        this.generics[idx].min_qty = +qty;
      }
      const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
      if (_idx > -1) {
        this._generics[_idx].min_qty = +qty;
      }
      console.log(this._generics[idx]);

    } catch (error) {
      console.log(error);
    }
  }

  onChangeMax(generic: any, qty: any) {
    try {
      const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
      if (idx > -1) {
        this.generics[idx].max_qty = +qty;
      }
      const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
      if (_idx > -1) {
        this._generics[_idx].max_qty = +qty;
      }
    } catch (error) {
      console.log(error);
    }
  }

  saveQty(product: any) {
    this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          let reason = 'ปรับยอดจาก Planning';
          let idx = _.findIndex(this.products, { wm_product_id: product.wm_product_id });
          let oldQty = +this.products[idx].old_qty;
          let newQty = +this.products[idx].qty;
          let wmProductId = this.products[idx].wm_product_id;

          let rs: any = await this.staffService.saveAdjQty(wmProductId, newQty, oldQty, reason);
          if (rs.ok) {
            this.alertService.success();
            this.products[idx].old_qty = +this.products[idx].qty;
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          console.log(error);
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        }
      })
      .catch(() => {

      });
  }

  saveMinMax() {
    console.log(this._generics);
    this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.staffService.saveGenericMinMax(this._generics);
          if (rs.ok) {
            this.alertService.success();
          } else {
            this.alertService.error(rs.error);
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        }
      })
      .catch(() => {
        // cancel
      });
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
  // searchProduct() {
  //   // if (this.query) {
  //     this.modalLoading.show();
  //     // clear old product list
  //     this.products = [];
  //     let rs: any = this.staffService.searchProductsWarehouse(this.warehouseId, this.query)
  //     if (rs.ok) {
  //       rs.rows.forEach(v => {
  //         try {
  //           v.old_qty = v.qty;
  //           v.large_qty = (v.qty / v.conversion);
  //         } catch (error) {
  //           v.old_qty = 0;
  //           v.large_qty = 0;
  //         }
  //       });
  //       this.products = rs.rows;
  //       this.modalLoading.hide();
  //     } else {
  //       this.modalLoading.hide();
  //       this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
  //     }
  // }
  async searchProduct() {
    this.modalLoading.show();
    try {
      let rs: any = await this.staffService.searchProductsWarehouse(this.genericType, this.query);
      if (rs.ok) {
        rs.rows.forEach(v => {
          try {
            v.old_qty = v.qty;
            v.large_qty = (v.qty / v.conversion);
          } catch (error) {
            v.old_qty = 0;
            v.large_qty = 0;
          }
        });
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async searchGenerics() {
    this.modalLoading.show();
    try {
      let rs: any = await this.staffService.searchGenericsWarehosue(this.genericType, this.query);
      if (rs.ok) {
        this.generics = rs.rows;
        for (let g of this.generics) {
          console.log(g);

          const idx = _.findIndex(this._generics, { generic_id: g.generic_id });
          if (idx > -1) {
            g.min_qty = this._generics[idx].min_qty;
            g.max_qty = this._generics[idx].max_qty;
          }
        }
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  // search when press ENTER
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchProduct();
    }
  }
  enterSearchMinMax(e) {
    if (e.keyCode === 13) {
      this.searchGenerics();
    }
  }
}
