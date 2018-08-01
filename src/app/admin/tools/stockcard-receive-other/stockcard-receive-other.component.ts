import { ToolsService } from './../../tools.service';
import { PeriodService } from 'app/period.service';
import { JwtHelper } from 'angular2-jwt';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ReceiveService } from "app/admin/receive.service";
import { AlertService } from "app/alert.service";
import { IMyOptions } from 'mydatepicker-th';

import * as _ from 'lodash';
import * as moment from 'moment';
@Component({
  selector: 'wm-stockcard-receive-other',
  templateUrl: './stockcard-receive-other.component.html',
  styles: []
})
export class StockcardReceiveOtherComponent implements OnInit {


  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('packageModal') public packageModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  @ViewChild('lotList') public lotList: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('locationList') public locationList: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('modalPurchases') public modalPurchases: any;
  @ViewChild('wmSearchLabeler') public wmSearchLabeler: any;
  @ViewChild('donatorList') public donatorList: any;
  @ViewChild('editLocationList') public editLocationList: any;

  @ViewChild('modalLoading') public modalLoading: any;

  totalProduct = 0;
  totalCost = 0;
  loading = false;
  deliveryCode: null;

  comment: string;
  products = [];

  receiveTypes = [];
  receiveStatus = [];
  warehouses = [];
  locations = [];

  isUpdate = false;
  isSaving = false;

  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  myDatePickerOptions: IMyOptions = {
    // componentDisabled: true,
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  receiveDate: any;
  expiredDate: any;
  receiveStatusId: any;
  receiveTypeId: any;

  userWarehouseId: any;
  jwtHelper: JwtHelper = new JwtHelper();
  dataServiceM: any;
  dataServiceProduct: any;

  units = [];
  primaryUnitName = null;
  primaryUnitId = null;
  selectedUnitGenericId = null;
  selectedUnitName = null;
  selectedReceiveQty: any;
  selectedCost = 0;
  conversionQty = 0;

  selectedExpiredDate = null;

  informName = null;

  selectedProductId = null;
  selectedGenericId = null;
  selectedProductName = null;
  selectedGenericName = null;

  selectedManufactureId: any = null;
  selectedWarehouseId: any = null;
  selectedWarehouseName: any = null;
  selectedLocationId: any = null;
  selectedLocationName: any = null;
  selectedLotId = null;
  selectedLotNo = null;
  selectedExpireNumDays = 0;

  token = null;

  receiveOtherId: any;
  donatorId: any;
  receiveCode: any;

  modalExpired = false;
  commentDate: any;
  ExpiredComment: any;
  isComment = false;

  isLotControl: any;
  receiveExpired: any;
  isItemExpired = false; // false = รับได้ true = หมดอายุ
  isExpired = false // false = กรอกวันหมดอายุ   true = ไม่กรอกวันหมดอายุ
  isReceiveHoliday = false; // false = รับได้ true = เป็นวันหยุด
  isReceivePeriod = false; // false = รับได้ true = ปิดรอบ

  passwordModal = false;
  checkEnterPass = true;
  password: any;
  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService,
    private router: Router,
    @Inject('API_URL') private apiUrl: string,
    private route: ActivatedRoute,
    private periodService: PeriodService,
    private toolsService: ToolsService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.userWarehouseId = +decodedToken.warehouseId;
    this.receiveExpired = decodedToken.WM_RECEIVE_OTHER_EXPIRED === 'Y' ? true : false;
    this.route.queryParams
      .subscribe(params => {
        this.receiveOtherId = params.receiveOtherId;
      });

  }

  async ngOnInit() {
    const date = new Date();

    this.receiveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    await this.getReceiveTypes();
    // get receive other detail
    await this.getReceiveOtherDetail();
    await this.getReceiveOtherDetailProductList();

    this.modalLoading.hide();
  }

  async getReceiveTypes() {
    try {
      this.modalLoading.show();
      const rs: any = await this.receiveService.getReceiveTypes()
      if (rs.ok) {
        this.receiveTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  // changeSearchProduct(event) {
  //   if (event) {
  //     this.productSearch.clearProductSearch();
  //     this.clearForm();
  //   }
  // }

  // changeManufacture(event: any) {
  //   try {
  //     this.selectedManufactureId = event.labeler_id ? event.labeler_id : null;
  //     // this.selectedManufactureName = event.labeler_name ? event.labeler_name : null;
  //   } catch (error) {
  //     //
  //   }
  // }

  // changeDonator(event: any) {
  //   this.donatorId = event.donator_id;
  // }

  clearSelectedDonator() {
    this.donatorId = null;
  }

  editChangeLots(idx: any, lot: any) {
    try {
      this.products[idx].lot_no = lot;
    } catch (error) {
      //
    }
  }

  editChangeLocation(idx, event) {
    this.products[idx].location_id = event ? event.location_id : null;
  }

  editChangeExpired(idx: any, expired: any) {
    try {
      this.products[idx].expired_date = expired;
    } catch (error) {
      //
    }
  }

  // changeLocation(event: any) {
  //   try {
  //     this.selectedLocationId = event.location_id ? event.location_id : null;
  //     this.selectedLocationName = event.location_name ? event.location_name : null;
  //   } catch (error) {
  //     //
  //   }
  // }

  // changeWarehouse(event: any) {
  //   try {
  //     this.selectedWarehouseId = event.warehouse_id ? event.warehouse_id : null;
  //     this.selectedWarehouseName = event.warehouse_name ? event.warehouse_name : null;
  //     if (this.selectedWarehouseId) {
  //       this.locationList.getLocations(event.warehouse_id);
  //     }
  //   } catch (error) {
  //     //
  //   }
  // }

  clearProductSearch() {
    this.selectedProductId = null;
    this.conversionQty = 0;
    // this.selectedReceiveQty = 0;
  }

  // changeUnit(event: any) {
  //   try {
  //     this.selectedCost = event.cost;
  //     this.selectedUnitName = event.unit_name;
  //     this.selectedUnitGenericId = event.unit_generic_id;
  //     this.conversionQty = event.qty;
  //   } catch (error) {
  //     //
  //   }
  // }
  // 
  async getUnitConversion(productId: any) {
    try {
      this.units = [];
      const resp: any = await this.receiveService.getUnitConversion(productId);
      if (resp.ok) {
        this.units = resp.rows;
      }
    } catch (error) {

    }
  }

  // setSelectedProduct(event: any) {
  //   try {
  //     this.selectedProductId = event ? event.product_id : null;
  //     this.selectedProductName = event ? `${event.product_name}` : null;
  //     this.selectedGenericName = event ? `${event.generic_name}` : null;
  //     this.selectedGenericId = event ? event.generic_id : null;
  //     this.primaryUnitId = event ? event.primary_unit_id : null;
  //     this.primaryUnitName = event ? event.primary_unit_name : null;
  //     this.selectedExpireNumDays = event ? event.expire_num_days : 0;

  //     this.isLotControl = event ? event.is_lot_control : null;

  //     this.manufactureList.getManufacture(this.selectedGenericId);
  //     // this.lotList.setProductId(this.selectedProductId);
  //     this.warehouseList.getWarehouse(this.selectedGenericId);
  //     this.getUnitConversion(this.selectedGenericId);
  //     this.unitList.setGenericId(this.selectedGenericId);

  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // }

  // addProduct() {

  //   const idx = _.findIndex(this.products, { product_id: this.selectedProductId, cost: this.selectedCost });
  //   if (idx > -1) {
  //     this.alertService.error('มีรายการนี้อยู่แล้วไม่สามารถเพิ่มได้ กรุณาแก้ไขรายการ');
  //   } else {

  //     const product: any = {};
  //     product.product_id = this.selectedProductId;
  //     product.product_name = this.selectedProductName;
  //     product.generic_name = this.selectedGenericName;
  //     product.receive_qty = this.selectedReceiveQty;
  //     product.primary_unit_id = this.primaryUnitId;
  //     product.primary_unit_name = this.primaryUnitName;
  //     product.lot_no = this.selectedLotNo;
  //     product.generic_id = this.selectedGenericId;
  //     product.expire_num_days = this.selectedExpireNumDays;
  //     // vendor
  //     product.manufacture_id = this.selectedManufactureId;
  //     // product.manufacture_name = this.selectedManufactureName;

  //     // warehouses
  //     product.warehouse_id = this.selectedWarehouseId;
  //     // product.warehouse_name = this.selectedWarehouseName;

  //     // location
  //     product.location_id = this.selectedLocationId;
  //     // product.location_name = this.selectedLocationName;

  //     product.unit_generic_id = this.selectedUnitGenericId;
  //     product.conversion_qty = +this.conversionQty;
  //     product.is_lot_control = this.isLotControl;

  //     product.cost = this.selectedCost || 0;

  //     if (this.selectedWarehouseId && this.selectedGenericId && this.selectedProductId && this.selectedReceiveQty) {
  //       if (this.selectedExpiredDate) {
  //         const validDate = this.dateService.isValidDateExpire(this.selectedExpiredDate);
  //         if (validDate) {
  //           product.expired_date = this.selectedExpiredDate;

  //           if (product.is_lot_control === 'Y') {
  //             if (!this.selectedLotNo) {
  //               this.alertService.error('กรุณาระบุ LOT')
  //             } else {
  //               this.products.push(product);
  //               // cal total price
  //               this.countTotalCost();
  //               this.clearForm();
  //             }
  //           } else {
  //             this.products.push(product);
  //             // cal total price
  //             this.countTotalCost();
  //             this.clearForm();
  //           }

  //         } else {
  //           this.alertService.error('รูปแบบวันที่ไม่ถูกต้อง');
  //         }
  //       } else {
  //         product.expired_date = null;
  //         this.products.push(product);
  //         // cal total price
  //         this.countTotalCost();
  //         this.clearForm();
  //       }

  //     } else {
  //       this.alertService.error('ข้อมูลไม่ครบ เช่น คลังสินค้า, จำนวนรับ, หน่วยรับ');
  //     }
  //   }

  // }

  countTotalCost() {
    this.totalCost = 0;
    this.products.forEach((v: any) => {
      this.totalCost += (v.cost * v.receive_qty);
    })
  }

  // clearForm() {
  //   this.selectedProductId = null;
  //   this.selectedProductName = null;
  //   this.selectedGenericName = null;
  //   this.selectedExpiredDate = null;
  //   this.selectedExpireNumDays = 0;
  //   this.selectedLotNo = null;
  //   this.selectedCost = 0;
  //   this.selectedReceiveQty = '';
  //   this.selectedUnitGenericId = null;
  //   this.primaryUnitId = null;
  //   this.primaryUnitName = null;
  //   this.conversionQty = 0;
  //   this.selectedManufactureId = null;
  //   this.manufactureList.clearVendor();
  //   this.warehouseList.clearWarehousList();
  //   this.locationList.clearLocation();
  //   this.productSearch.clearProductSearch();
  //   this.unitList.clearUnits();
  // }

  // removeSelectedProduct(idx: any) {
  //   this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
  //     .then(() => {
  //       this.products.splice(idx, 1);
  //       this.countTotalCost();
  //     })
  //     .catch(() => {
  //     });
  // }

  // edit data
  editChangeReceiveQty(idx: any, value: any) {
    this.products[idx].receive_qty = +value;
    this.countTotalCost();
  }

  editChangeCost(idx: any, value: any) {
    this.products[idx].cost = +value;
    this.countTotalCost();
  }

  editChangeUnit(idx: any, event: any) {
    try {
      if (event) {
        this.products[idx].unit_generic_id = event.unit_generic_id;
        this.products[idx].conversion_qty = +event.qty;
        this.countTotalCost();
      } else {
        this.alertService.error('กรุณาเลือกหน่วยสินค้า')
      }
    } catch (error) {
    }
  }

  editChangeManufacture(idx: any, event: any) {
    try {
      if (event) {
        this.products[idx].manufacture_id = event.labeler_id;
        this.products[idx].manufacture_name = event.labeler_name;
      } else {
        this.alertService.error('กรุณาเลือกผู้ผลิต')
      }
    } catch (error) {
    }
  }

  editChangeWarehouse(idx, event: any, cmp: any) {
    try {
      this.products[idx].warehouse_id = event.warehouse_id;
      this.products[idx].warehouse_name = event.warehouse_name;
      this.products[idx].location_id = null;
      // cmp.getLocations(event.warehouse_id);
    } catch (error) {
      console.log(error);
    }
  }

  enterSave(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.save();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }


  async save() {
    try {
      if (this.password) {
        const rsC = await this.toolsService.checkPassword(this.password);
        if (rsC.ok) {
          this.modalLoading.show();
          this.isSaving = true;
          const _receiveDate = this.receiveDate ?
            `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}` : null;
          const rsP = await this.periodService.getStatus(_receiveDate)
          if (rsP.rows[0].status_close === 'Y') {
            this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถแก้ไข stockcard ได้');
            this.isReceivePeriod = true;
            this.isSaving = false;
          } else {
            const summary = {
              receive_date: _receiveDate,
              receive_type_id: this.receiveTypeId,
              comment: this.comment,
              delivery_code: this.deliveryCode,
              donator_id: this.donatorId
            }
            const rs: any = await this.toolsService.saveReceiveOther(this.receiveOtherId, summary, this.products);
            if (rs.ok) {
              this.modalLoading.hide();
              this.router.navigate(['admin/tools/stockcard']);
              this.isSaving = false;
            } else {
              this.isSaving = false;
              this.modalLoading.hide();
              this.alertService.error(JSON.stringify(rs.error));
            }
          }
        } else {
          this.isSaving = false;
          this.modalLoading.hide();
          this.passwordModal = false;
          this.alertService.error('รหัสผ่านผิดพลาด');
        }
      } else {
        this.isSaving = false;
        this.modalLoading.hide();
        this.alertService.error('ข้อมูลไม่สมบูรณ์');
      }

    } catch (error) {
      this.alertService.error(error);
    }
  }



  async getReceiveOtherDetail() {
    try {
      this.modalLoading.show();
      const receiveOtherId = this.receiveOtherId;
      const rs = await this.receiveService.getReceiveOtherDetail(receiveOtherId);
      const rsDetail = rs.detail[0];
      this.receiveCode = rsDetail.receive_code;
      this.receiveTypeId = rsDetail.receive_type_id;
      if (rsDetail.receive_date) {
        this.receiveDate = {
          date: {
            year: moment(rsDetail.receive_date).get('year'),
            month: moment(rsDetail.receive_date).get('month') + 1,
            day: moment(rsDetail.receive_date).get('date')
          }
        }
      }
      this.deliveryCode = rsDetail.delivery_code;
      this.comment = rsDetail.comment;
      this.donatorId = rsDetail.donator_id;
      this.donatorList.setDefault(rsDetail.donator_name);
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async getReceiveOtherDetailProductList() {
    try {
      this.modalLoading.show();
      const receiveOtherId = this.receiveOtherId;
      const rs = await this.receiveService.getReceiveOtherDetailProductList(receiveOtherId);
      if (rs.ok) {
        rs.rows.forEach(v => {
          const product: any = {};
          product.product_id = v.product_id;
          product.product_name = v.product_name;
          product.receive_qty = v.receive_qty;
          product.receive_qty_old = v.receive_qty;
          product.primary_unit_id = v.primary_unit_id;
          product.primary_unit_name = v.primary_unit_name;
          product.expired_num_days = v.expire_num_days;
          product.lot_no = v.lot_no ? v.lot_no.toUpperCase() : null;
          product.lot_no_old = v.lot_no ? v.lot_no.toUpperCase() : null;
          product.conversion_qty_old = v.conversion_qty;
          product.generic_id = v.generic_id;
          product.generic_name = v.generic_name;
          // vendor
          product.manufacture_id = v.manufacturer_labeler_id;
          // warehouses
          product.warehouse_id = v.warehouse_id;
          product.location_id = v.location_id;
          product.unit_generic_id = v.unit_generic_id;
          product.conversion_qty = +v.conversion_qty;
          product.expired_date = moment(v.expired_date).isValid() ? moment(v.expired_date).format('DD/MM/YYYY') : null;
          product.expired_date_old = moment(v.expired_date).isValid() ? moment(v.expired_date).format('DD/MM/YYYY') : null;
          product.cost = v.cost;
          product.cost_old = v.cost;
          this.products.push(product);
          // cal total price

          this.countTotalCost();
        });
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }


}
