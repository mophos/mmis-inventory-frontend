import { PeriodService } from './../../period.service';
import { JwtHelper } from 'angular2-jwt';
// import { AlertExpiredService } from './../alert-expired.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WarehouseService } from "../warehouse.service";
import { ReceiveService } from "../receive.service";
import { LabelerService } from "../labeler.service";
import { AlertService } from "../../alert.service";
import { IMyOptions } from 'mydatepicker-th';

import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { DateService } from 'app/date.service';

@Component({
  selector: 'wm-receive-other-edit',
  templateUrl: './receive-other-edit.component.html',
  styles: []
})
export class ReceiveOtherEditComponent implements OnInit {

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
  // selectedManufactureName: any = null;
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

  // numDayExpired: number = 0;
  isLotControl: any;
  receiveExpired: any;
  isItemExpired = false; // false = รับได้ true = หมดอายุ
  isExpired = false // false = กรอกวันหมดอายุ   true = ไม่กรอกวันหมดอายุ
  isReceiveHoliday = false; // false = รับได้ true = เป็นวันหยุด
  isReceivePeriod = false; // false = รับได้ true = ปิดรอบ
  constructor(
    private wareHouseService: WarehouseService,
    private receiveService: ReceiveService,
    private labelerService: LabelerService,
    private alertService: AlertService,
    private router: Router,
    // private ref: ChangeDetectorRef,
    private toThaiDate: ToThaiDatePipe,
    // private alertExpireService: AlertExpiredService,
    @Inject('API_URL') private apiUrl: string,
    private route: ActivatedRoute,
    private dateService: DateService,
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.userWarehouseId = +decodedToken.warehouseId;
    // this.numDayExpired = +decodedToken.WM_CHECK_EXPIRE_ALERT_DAY || 60;
    this.receiveExpired = decodedToken.WM_RECEIVE_OTHER_EXPIRED === 'Y' ? true : false;
    this.route.queryParams
      // .filter(params => params.order)
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

  changeSearchProduct(event) {
    if (event) {
      this.productSearch.clearProductSearch();
      this.clearForm();
    }
  }

  changeManufacture(event: any) {
    try {
      this.selectedManufactureId = event.labeler_id ? event.labeler_id : null;
      // this.selectedManufactureName = event.labeler_name ? event.labeler_name : null;
    } catch (error) {
      //
    }
  }

  changeDonator(event: any) {
    this.donatorId = event.donator_id;
  }

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
    this.products[idx].location_id = event.location_id;
  }

  editChangeExpired(idx: any, expired: any) {
    try {
      this.products[idx].expired_date = expired;
    } catch (error) {
      //
    }
  }

  changeLocation(event: any) {
    try {
      this.selectedLocationId = event.location_id ? event.location_id : null;
      this.selectedLocationName = event.location_name ? event.location_name : null;
    } catch (error) {
      //
    }
  }

  changeWarehouse(event: any) {
    try {
      this.selectedWarehouseId = event.warehouse_id ? event.warehouse_id : null;
      this.selectedWarehouseName = event.warehouse_name ? event.warehouse_name : null;
      if (this.selectedWarehouseId) {
        this.locationList.getLocations(event.warehouse_id);
      }
    } catch (error) {
      //
    }
  }

  clearProductSearch() {
    this.selectedProductId = null;
    this.conversionQty = 0;
    // this.selectedReceiveQty = 0;
  }

  changeUnit(event: any) {
    try {
      this.selectedUnitName = event.unit_name;
      this.selectedUnitGenericId = event.unit_generic_id;
      this.conversionQty = event.qty;
    } catch (error) {
      //
    }
  }

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

  setSelectedProduct(event: any) {
    try {
      this.selectedProductId = event ? event.product_id : null;
      this.selectedProductName = event ? `${event.product_name}` : null;
      this.selectedGenericName = event ? `${event.generic_name}` : null;
      this.selectedGenericId = event ? event.generic_id : null;
      this.primaryUnitId = event ? event.primary_unit_id : null;
      this.primaryUnitName = event ? event.primary_unit_name : null;
      this.selectedExpireNumDays = event ? event.expire_num_days : 0;

      this.isLotControl = event ? event.is_lot_control : null;

      this.manufactureList.getManufacture(this.selectedGenericId);
      // this.lotList.setProductId(this.selectedProductId);
      this.warehouseList.getWarehouses(this.selectedGenericId);
      this.getUnitConversion(this.selectedGenericId);
      this.unitList.setGenericId(this.selectedGenericId);

    } catch (error) {
      console.log(error.message);
    }
  }

  addProduct() {

    const idx = _.findIndex(this.products, { product_id: this.selectedProductId });
    if (idx > -1) {
      this.alertService.error('มีรายการนี้อยู่แล้วไม่สามารถเพิ่มได้ กรุณาแก้ไขรายการ');
    } else {

      const product: any = {};
      product.product_id = this.selectedProductId;
      product.product_name = this.selectedProductName;
      product.generic_name = this.selectedGenericName;
      product.receive_qty = this.selectedReceiveQty;
      product.primary_unit_id = this.primaryUnitId;
      product.primary_unit_name = this.primaryUnitName;
      product.lot_no = this.selectedLotNo;
      product.generic_id = this.selectedGenericId;
      product.expire_num_days = this.selectedExpireNumDays;
      // vendor
      product.manufacture_id = this.selectedManufactureId;
      // product.manufacture_name = this.selectedManufactureName;

      // warehouses
      product.warehouse_id = this.selectedWarehouseId;
      // product.warehouse_name = this.selectedWarehouseName;

      // location
      product.location_id = this.selectedLocationId;
      // product.location_name = this.selectedLocationName;

      product.unit_generic_id = this.selectedUnitGenericId;
      product.conversion_qty = +this.conversionQty;
      product.is_lot_control = this.isLotControl;

      product.cost = this.selectedCost || 0;

      if (this.selectedWarehouseId && this.selectedGenericId && this.selectedProductId && this.selectedReceiveQty) {
        if (this.selectedExpiredDate) {
          const validDate = this.dateService.isValidDateExpire(this.selectedExpiredDate);
          if (validDate) {
            product.expired_date = this.selectedExpiredDate;

            if (product.is_lot_control === 'Y') {
              if (!this.selectedLotNo) {
                this.alertService.error('กรุณาระบุ LOT')
              } else {
                this.products.push(product);
                // cal total price
                this.countTotalCost();
                this.clearForm();
              }
            } else {
              this.products.push(product);
              // cal total price
              this.countTotalCost();
              this.clearForm();
            }

          } else {
            this.alertService.error('รูปแบบวันที่ไม่ถูกต้อง');
          }
        } else {
          product.expired_date = null;
          this.products.push(product);
          // cal total price
          this.countTotalCost();
          this.clearForm();
        }

      } else {
        this.alertService.error('ข้อมูลไม่ครบ เช่น คลังสินค้า, จำนวนรับ, หน่วยรับ');
      }
    }

  }

  countTotalCost() {
    this.totalCost = 0;
    this.products.forEach((v: any) => {
      this.totalCost += (v.cost * v.receive_qty);
    })
  }

  clearForm() {
    this.selectedProductId = null;
    this.selectedProductName = null;
    this.selectedGenericName = null;
    this.selectedExpiredDate = null;
    this.selectedExpireNumDays = 0;
    this.selectedLotNo = null;
    this.selectedCost = 0;
    this.selectedReceiveQty = '';
    this.selectedUnitGenericId = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.conversionQty = 0;
    this.selectedManufactureId = null;
    this.manufactureList.clearVendor();
    this.warehouseList.clearWarehousList();
    this.locationList.clearLocation();
    this.productSearch.clearProductSearch();
    this.unitList.clearUnits();
  }

  removeSelectedProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.products.splice(idx, 1);
        this.countTotalCost();
      })
      .catch(() => {
      });
  }

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
        this.products[idx].manufacture_id = event.manufacture_id;
        this.products[idx].manufacture_name = event.manufacture_name;
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
      cmp.getLocations(event.warehouse_id);
    } catch (error) {
      console.log(error);
    }
  }

  async saveReceive() {
    if (this.receiveDate) {
      const _receiveDate = this.receiveDate ?
        `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}` : null;
      const rsP = await this.periodService.getStatus(_receiveDate)
      if (rsP.rows[0].status_close === 'Y') {
        this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถรับได้');
        this.isReceivePeriod = true;
      } else {
        const rs = await this.receiveService.getPurchaseCheckHoliday(_receiveDate);
        if (rs.ok) {
          this.isReceiveHoliday = false;
            await this.checkExpired();
        } else {
          this.isReceiveHoliday = true; // วันหยุด
          this.alertService.confirm(rs.error)
            .then(async () => {
              this.isReceiveHoliday = false; // วันหยุด
                await this.checkExpired();
            })
            .catch(() => {
              this.isReceiveHoliday = true;
            })
          if (!this.isExpired && !this.isItemExpired && !this.isReceiveHoliday && !this.isReceivePeriod) {
            this.saveReceiveTo();
          }
        }

      }
    } else {
      this.alertService.error('กรุณาระบุวันที่รับ');
    }
  }

  saveComment() {
    this.isComment = false;
    this.saveReceiveTo();
  }

  closeExpireModal() {
    this.modalExpired = false;
    this.modalLoading.hide();
    this.isSaving = false;
  }

  saveReceiveTo() {
    if (!this.receiveDate || !this.donatorId || !this.products.length) {
      this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
    } else {
      // check expired
      let isError = false;
      this.products.forEach((v: any) => {
        if (v.expired_date) {
          const validDate = this.dateService.isValidDateExpire(v.expired_date);
          if (!validDate) {
            isError = true;
          }
        }
        if (v.receive_qty <= 0) {
          isError = true;
        }

        if (v.is_lot_control === 'Y') {
          isError = v.lot_no ? false : true;
        }

      });

      if (isError) {
        this.alertService.error('ข้อมูลไม่สมบูรณ์ กรุณาตรวจสอบ เช่น วันหมดอายุ, รับยาหมดอายุ, จำนวน, ราคา')
        this.modalLoading.hide();
        this.isSaving = false;
      } else {
        this.alertService.confirm('ต้องการบันทึกข้อมูลการรับสินค้า ใช่หรือไม่?')
          .then(async () => {
            try {
              this.modalLoading.show();
              this.isSaving = true;
              const _receiveDate = `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}`;
              const summary = {
                receiveDate: _receiveDate,
                receiveStatusId: this.receiveStatusId,
                receiveTypeId: this.receiveTypeId,
                comment: this.comment,
                deliveryCode: this.deliveryCode,
                donatorId: this.donatorId,
                comment_expired: this.ExpiredComment
              }
              const rs: any = await this.receiveService.updateReceiveOther(this.receiveOtherId, summary, this.products);
              if (rs.ok) {
                this.router.navigate(['/admin/receives']);
              } else {
                this.isSaving = false;
                this.alertService.error(JSON.stringify(rs.error));
              }
              this.modalLoading.hide();
              this.isSaving = false;
            } catch (error) {
              this.modalLoading.hide();
              this.isSaving = false;
              this.alertService.error(error.message);
            }
          })
          .catch(() => {
            this.isSaving = false;
            this.modalLoading.hide();
          });
      }
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
      console.log(rsDetail);
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
          product.primary_unit_id = v.primary_unit_id;
          product.primary_unit_name = v.primary_unit_name;
          product.expired_num_days = v.expire_num_days;
          product.lot_no = v.lot_no;
          product.generic_id = v.generic_id;
          product.generic_name = v.generic_name;
          // vendor
          product.manufacture_id = v.manufacture_id;
          // warehouses
          product.warehouse_id = v.warehouse_id;
          product.location_id = v.location_id;
          product.unit_generic_id = v.unit_generic_id;
          product.conversion_qty = +v.conversion_qty;
          product.expired_date = moment(v.expired_date).isValid() ? moment(v.expired_date).format('DD/MM/YYYY') : null;
          product.cost = +v.cost;
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

  async checkExpired() {
    this.isExpired = false;
    this.isItemExpired = false;
    if (this.receiveExpired) {
      for (const v of this.products) {
        if (!moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
          this.alertService.error('กรุณาระบุวันหมดอายุ');
          console.log('err วันหมดอายุ');
          this.isExpired = true;
        }
      }
    }
    if (!this.isExpired) {
      let count = 0;
      for (const v of this.products) {
        if (!moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
          const d: any = v.expired_date.split('/');
          const expired_date: any = new Date(d[2], d[1] - 1, d[0]);
          const diffday = moment(expired_date).diff(moment(), 'days');
          if (diffday < 0) {
            count++;
          }
        }
      }
      if (count > 0) {
        this.alertService.error('มีเวชภัณฑ์หมดอายุ ไม่อนุญาตให้รับสินค้า');
        console.log('เวชภัณฑ์หมดอายุ');
        this.isItemExpired = true;
      }
    }
    if (!this.isItemExpired) {
      let checkDiffExpired;
      let count = 0;
      for (const v of this.products) {
        if (!moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
          const d: any = v.expired_date.split('/');
          const expired_date: any = moment(new Date(d[2], d[1] - 1, d[0])).format('YYYY-MM-DD');
          checkDiffExpired = await this.receiveService.getPurchaseCheckExpire(v.generic_id, expired_date);
          // console.log(checkDiffExpired);
          if (!checkDiffExpired.ok) {
            count++;
          }
        }
      }
      if (count > 0) {
        console.log('err ใกล้หมดอายุ');
        this.alertService.confirm(checkDiffExpired.error)
          .then(() => {
            this.isItemExpired = false; // ใช่ ดำเนินการ
            this.modalExpired = true;
            this.isComment = true;
          })
          .catch(() => {
            this.isItemExpired = true;
          })
      } else {
        if (!this.isExpired && !this.isItemExpired && !this.isReceiveHoliday && !this.isReceivePeriod) {
          this.saveReceiveTo();
        }
      }
    } // expired
  }
}
