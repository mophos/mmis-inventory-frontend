import { Component, OnInit, ViewChild } from '@angular/core';
import { LoadingModalComponent } from 'app/modals/loading-modal/loading-modal.component';
import { AlertService } from 'app/alert.service';
import { StaffService } from 'app/staff/staff.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';

@Component({
  selector: 'wm-planning',
  templateUrl: './planning.component.html',
  styles: []
})
export class PlanningComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: LoadingModalComponent;
  products: any = [];
  generics: any = [];
  genericTypes = [];
  genericType: any = "";
  token: string;
  jwtHelper: JwtHelper = new JwtHelper();
  warehouseId: any;
  query: any = "";
  _generics: any = [];

  fromDate: any;
  toDate: any;
  processDate: any;

  pickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

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
    const date = new Date();
    this.fromDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.toDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
  }

  async getProducts() {
    this.modalLoading.show();
    try {
      const rs: any = await this.staffService.getProductsWarehouse(this.genericType);
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

  onClickMinMaxTab() {
    this.getMinMaxHeader();
    this.getGenerics();
  }

  async getGenerics() {
    this.modalLoading.show();
    try {
      const rs: any = await this.staffService.getGenericsWarehosueMinMax(this.genericType);
      if (rs.ok) {
        this.generics = rs.rows;
        this._generics = _.clone(this.generics);
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
    const idx = _.findIndex(this.products, { wm_product_id: product.wm_product_id });
    if (idx > -1) {
      this.products[idx].qty = +qty;
    }
  }

  onChangeSaftyStockMin(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].safety_min_day = +value;
      this.generics[idx].min_qty = Math.round(this.generics[idx].use_per_day * this.generics[idx].safety_min_day);
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].safety_min_day = +value;
      this._generics[_idx].min_qty = Math.round(this._generics[_idx].use_per_day * this._generics[_idx].safety_min_day);
    }
  }

  onChangeSaftyStockMax(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].safety_max_day = +value;
      this.generics[idx].max_qty = Math.round(this.generics[idx].use_per_day * this.generics[idx].safety_max_day);
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].safety_max_day = +value;
      this._generics[_idx].max_qty = Math.round(this._generics[_idx].use_per_day * this._generics[_idx].safety_max_day);
    }
  }

  onChangeMinQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].min_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].min_qty = +value;
    }
  }

  onChangeMaxQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].max_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].max_qty = +value;
    }
  }

  saveQty(product: any) {
    this.alertService.confirm('ต้องการบันทึกข้อมูลใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const reason = 'ปรับยอดจาก Planning';
          const idx = _.findIndex(this.products, { wm_product_id: product.wm_product_id });
          const oldQty = +this.products[idx].old_qty;
          const newQty = +this.products[idx].qty;
          const wmProductId = this.products[idx].wm_product_id;

          const rs: any = await this.staffService.saveAdjQty(wmProductId, newQty, oldQty, reason);
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
    this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.staffService.saveGenericMinMax(this._generics, this.processDate);
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
      const rs: any = await this.staffService.searchProductsWarehouse(this.genericType, this.query);
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
      const rs: any = await this.staffService.searchGenericsWarehosue(this.genericType, this.query);
      if (rs.ok) {
        this.generics = rs.rows;
        for (const g of this.generics) {
          const idx = _.findIndex(this._generics, { generic_id: g.generic_id });
          if (idx > -1) {
            g.use_total = this._generics[idx].use_total;
            g.use_per_day = this._generics[idx].use_per_day;
            g.safety_min_day = this._generics[idx].safety_min_day;
            g.safety_max_day = this._generics[idx].safety_max_day;
            g.qty = this._generics[idx].qty;
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

  async getMinMaxHeader() {
    try {
      this.modalLoading.show();
      const rs: any = await this.staffService.getMinMaxHeader();
      if (rs.ok) {
        const result = rs.rows[0];
        this.processDate = result.process_date;
        if (result && result.from_stock_date) {
          this.fromDate = {
            date: {
              year: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('year') : moment().get('year'),
              month: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('month') + 1 : moment().get('month') + 1,
              day: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('date') : moment().get('date')
            }
          }
        }

        if (result && result.to_stock_date) {
          this.toDate = {
            date: {
              year: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('year') : moment().get('year'),
              month: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('month') + 1 : moment().get('month') + 1,
              day: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('date') : moment().get('date')
            }
          }
        } else {
          this.toDate = {
            date: {
              year: moment().get('year'),
              month: moment().get('month') + 1,
              day: moment().get('date')
            }
          };
        }
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  onClickCalculate() {
    this.alertService.confirm('ต้องการคำนวณ Min - Max ใช่หรือไม่?')
      .then(() => {
        this.calculateMinMax();
      })
      .catch(() => { });
  }

  async calculateMinMax() {
    try {
      this.modalLoading.show();
      const _fromDate = `${this.fromDate.date.year}-${this.fromDate.date.month}-${this.fromDate.date.day}`;
      const _toDate = `${this.toDate.date.year}-${this.toDate.date.month}-${this.toDate.date.day}`;
      const rs: any = await this.staffService.calculateMinMax(_fromDate, _toDate);
      if (rs.ok) {
        this.generics = rs.rows;
        this._generics = _.clone(this.generics);
        this.processDate = rs.process_date;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }
}
