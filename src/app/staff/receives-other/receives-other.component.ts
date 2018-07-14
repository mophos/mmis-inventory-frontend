import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { PeriodService } from './../period.service';
import { JwtHelper } from 'angular2-jwt';
import { AlertExpiredService } from './../alert-expired.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { Router } from '@angular/router';
import { WarehouseService } from "../warehouse.service";
import { ReceiveService } from "../receive.service";
import { LabelerService } from "../labeler.service";
import { AlertService } from "../../alert.service";
import { IMyOptions } from 'mydatepicker-th';

import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { DateService } from 'app/date.service';
import { SettingService } from '../../setting.service';
import { removeSummaryDuplicates } from '@angular/compiler';

@Component({
  selector: 'wm-receives-other',
  templateUrl: './receives-other.component.html',
  styles: []
})
export class ReceivesOtherComponent implements OnInit {

  // @ViewChild('lotModal') public lotModal: any;
  @ViewChild('packageModal') public packageModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  // @ViewChild('lotList') public lotList: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('locationList') public locationList: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('modalPurchases') public modalPurchases: any;
  @ViewChild('wmSearchLabeler') public wmSearchLabeler: any;
  @ViewChild('donatorList') public donatorList: any;

  @ViewChild('modalLoading') public modalLoading: any;

  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
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
  selectedExpireNumDays = 0;

  selectedManufactureId: any = null;
  selectedManufactureName: any = null;
  selectedWarehouseId: any = null;
  selectedWarehouseName: any = null;
  selectedLocationId: any = null;
  selectedLocationName: any = null;
  // selectedLotId = null;
  selectedLotNo = null;
  token = null;
  is_expired = 'N';
  donatorId: any;
  isApprove: any;
  receiveCode: any;
  isLotControl: any;

  modalExpired = false;
  commentDate: any;
  ExpiredComment: any;
  isComment = false;
  receiveExpired: any;
  warehouseName: any;

  isItemExpired = false; // false = รับได้ true = หมดอายุ
  isExpired = false // false = กรอกวันหมดอายุ   true = ไม่กรอกวันหมดอายุ
  isReceiveHoliday = false; // false = รับได้ true = เป็นวันหยุด
  isReceivePeriod = false; // false = รับได้ true = ปิดรอบ

  hospcode: any; // ใช้ชั่วคราว
  isCheckUpdateCost = false;

  constructor(
    private wareHouseService: WarehouseService,
    private receiveService: ReceiveService,
    private labelerService: LabelerService,
    private alertService: AlertService,
    private router: Router,
    // private ref: ChangeDetectorRef,
    private toThaiDate: ToThaiDatePipe,
    private alertExpireService: AlertExpiredService,
    private dateService: DateService,
    @Inject('API_URL') private apiUrl: string,
    private settingService: SettingService,
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.userWarehouseId = +decodedToken.warehouseId;
    this.receiveExpired = decodedToken.WM_RECEIVE_OTHER_EXPIRED === 'Y' ? true : false;
    this.isApprove = decodedToken.WM_RECEIVE_OTHER_APPROVE === 'Y' ? true : false;

    // ใช้ชั่วคราว เฉพาะโรงพยาบาลสิงห์บุรี
    const hospital = JSON.parse(decodedToken.SYS_HOSPITAL);
    this.hospcode = hospital.hospcode;


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

    this.getReceiveStatus();
    this.getReceiveTypes();
  }

  getWareHouse(warehouseId: any) {
    this.wareHouseService.detail(warehouseId)
      .then((result: any) => {
        this.warehouseName = result.detail.warehouse_name;
      })
  }

  async getReceiveTypes() {
    this.modalLoading.show();
    try {
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

  async getReceiveStatus() {
    try {
      this.modalLoading.show();
      const rs: any = await this.receiveService.getStatusStatus()
      if (rs.ok) {
        this.receiveStatus = rs.rows;
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
      this.selectedManufactureName = event.labeler_name ? event.labeler_name : null;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  changeDonator(event: any) {
    this.donatorId = event.donator_id;
  }

  clearSelectedDonator(event) {
    if (event) {
      this.donatorId = null;
      this.donatorList.clearSelected();
    }
  }

  changeLocation(event: any) {
    try {
      this.selectedLocationId = event.location_id ? event.location_id : null;
      this.selectedLocationName = event.location_name ? event.location_name : null;
    } catch (error) {
      this.alertService.error(error);
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
      this.alertService.error(error);
    }
  }

  clearProductSearch() {
    this.selectedProductId = null;
    this.conversionQty = 0;
  }

  changeUnit(event: any) {
    try {
      this.selectedUnitName = event.unit_name;
      this.selectedUnitGenericId = event.unit_generic_id;
      this.conversionQty = event.qty;
      this.selectedCost = event.cost;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  async getUnitConversion(productId: any) {
    try {
      this.units = [];
      const resp: any = await this.receiveService.getUnitConversion(productId);
      if (resp.ok) {
        this.units = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  setSelectedProduct(event: any) {
    try {
      this.isLotControl = event ? event.is_lot_control : null;
      this.selectedProductId = event ? event.product_id : null;
      this.selectedProductName = event ? `${event.product_name}` : null;
      this.selectedGenericName = event ? `${event.generic_name}` : null;
      this.selectedGenericId = event ? event.generic_id : null;
      this.primaryUnitId = event ? event.primary_unit_id : null;
      this.primaryUnitName = event ? event.primary_unit_name : null;

      this.isLotControl = event ? event.is_lot_control : null;

      this.manufactureList.getManufacture(this.selectedGenericId);
      // this.lotList.setProductId(this.selectedProductId);
      // this.warehouseList.getWarehouse(this.selectedGenericId);

      this.getWareHouse(this.userWarehouseId);
      this.getUnitConversion(this.selectedGenericId);
      this.unitList.setGenericId(this.selectedGenericId);

    } catch (error) {
      console.log(error.message);
    }
  }

  addProduct() {
    const idx = _.findIndex(this.products, { product_id: this.selectedProductId, cost: this.selectedCost, lot_no: this.selectedLotNo });
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
      product.lot_no = this.selectedLotNo ? this.selectedLotNo.toUpperCase() : null;
      product.generic_id = this.selectedGenericId;

      // vendor
      product.manufacture_id = this.selectedManufactureId;
      product.manufacture_name = this.selectedManufactureName;

      // warehouses
      product.warehouse_id = this.userWarehouseId;
      product.warehouse_name = this.warehouseName;

      // location
      product.location_id = this.selectedLocationId;
      product.location_name = this.selectedLocationName;

      product.unit_generic_id = this.selectedUnitGenericId;
      product.conversion_qty = +this.conversionQty;
      product.cost = this.selectedCost || 0;
      product.is_lot_control = this.isLotControl;

      if (this.selectedExpiredDate) {
        const valid = this.dateService.isValidDateExpire(this.selectedExpiredDate);
        if (valid) {
          product.expired_date = this.selectedExpiredDate;
          if (product.is_lot_control === 'Y') {
            if (this.selectedLotNo) {
              this.products.push(product);
              // cal total price
              this.countTotalCost();
              this.clearForm();
            } else {
              this.alertService.error('กรุณาระบุ LOT');
            }
          } else {
            this.products.push(product);
            // cal total price
            this.countTotalCost();
            this.clearForm();
          }

        } else {
          this.alertService.error('ข้อมูลวันที่ไม่ถูกรูปแบบ');
        }
      } else {
        product.expired_date = null;
        this.products.push(product);
        // cal total price
        this.countTotalCost();
        this.clearForm();
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
    // this.selectedLotId = null;
    this.selectedLotNo = null;
    this.selectedCost = 0;
    this.selectedReceiveQty = '';
    this.selectedUnitGenericId = null;
    // this.selectedUnitName = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.conversionQty = 0;
    this.selectedManufactureId = null;
    this.selectedManufactureName = null;
    this.isLotControl = null;

    this.manufactureList.clearVendor();
    // this.warehouseList.clearWarehousList();
    this.locationList.clearLocation();
    // this.lotList.clearLots();
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
        //
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
        // if (this.products[idx].cost !== +event.cost) {
        //   this.products[idx].cost = +event.cost;
        // }
        this.countTotalCost();
      } else {
        this.alertService.error('กรุณาเลือกหน่วยสินค้า')
      }
    } catch (error) {
    }
  }

  editChangeManufacture(productId: any, event: any) {
    try {
      const idx = _.findIndex(this.products, { product_id: productId })
      if (idx > -1) {
        this.products[idx].manufacture_id = event.labeler_id;
        this.products[idx].manufacture_name = event.labeler_name;
      } else {
        this.alertService.error('กรุณาเลือกผู้ผลิต')
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  editChangeWarehouse(idx, event: any, cmp: any) {
    try {
      this.products[idx].warehouse_id = event.warehouse_id;
    } catch (error) {
      this.alertService.error(error);
      console.log(error);
    }
  }

  editChangeLot(idx: any, lot: any) {
    try {
      this.products[idx].lot_no = lot;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  editChangeExpired(idx: any, expired: any) {
    try {
      this.products[idx].expired_date = expired;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  async saveReceive() {
    if (this.receiveDate) {
      const _receiveDate = this.receiveDate ?
        `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}` : null;
      const rsP = await this.periodService.getStatus(_receiveDate)
      console.log(rsP);
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
    this.is_expired = 'Y';
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
      this.isSaving = false;
      this.modalLoading.hide();
    } else {
      let isError = false;
      // check products
      this.products.forEach((v: any) => {
        if (v.expired_date) {
          const valid = this.dateService.isValidDateExpire(v.expired_date);
          if (!valid) {
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
        this.alertService.error('กรุณาตรวจสอบข้อมูลให้ครบถ้วน เช่น วันหมดอายุ, จำนวน, ราคา');
        this.modalLoading.hide();
        this.isSaving = false;
      } else {
        this.alertService.confirm('ต้องการบันทึกข้อมูลการรับสินค้า ใช่หรือไม่?')
          .then(async () => {
            try {
              this.isSaving = true;
              this.modalLoading.show();
              const _receiveDate = `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}`;
              const summary = {
                receiveDate: _receiveDate,
                // receiveCode: this.receiveCode,
                receiveStatusId: this.receiveStatusId,
                receiveTypeId: this.receiveTypeId,
                // informName: this.informName,
                comment: this.comment,
                deliveryCode: this.deliveryCode,
                donatorId: this.donatorId,
                comment_expired: this.ExpiredComment,
                is_expired: this.is_expired
              }
              const receiveOtherId: any = await this.receiveService.saveReceiveOther(summary, this.products);


              // ใช้ชั่วคราว
              if (this.isCheckUpdateCost) {
                await this.receiveService.saveCost(this.products);
              }

              ///// Save and Approve
              if (!this.isApprove) {
                await this.receiveService.saveApproveOther(receiveOtherId.rows, _receiveDate, '');
              }

              this.modalLoading.hide();

              if (receiveOtherId.ok) {
                sessionStorage.setItem('tabReceive', 'receiveOther');
                this.router.navigate(['/staff/receives']);
              } else {
                this.alertService.error(JSON.stringify(receiveOtherId.error));
              }
            } catch (error) {
              this.modalLoading.hide();
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

  async checkExpired() {
    this.isExpired = false;
    this.isItemExpired = false;

    if (this.receiveExpired) {
      for (const v of this.products) {
        if (!moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
          this.alertService.error('กรุณาระบุวันหมดอายุ');
          this.isExpired = true;
        }
      }
    }
    if (!this.isExpired) {
      let count = 0;
      for (const v of this.products) {
        if (moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
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
        this.isItemExpired = true;
      }
    }
    if (!this.isItemExpired) {
      let checkDiffExpired;
      let count = 0;
      for (const v of this.products) {
        if (moment(v.expired_date, 'DD-MM-YYYY').isValid()) {
          const d: any = v.expired_date.split('/');
          const expired_date: any = moment(new Date(d[2], d[1] - 1, d[0])).format('YYYY-MM-DD');
          checkDiffExpired = await this.receiveService.getPurchaseCheckExpire(v.generic_id, expired_date);
          if (!checkDiffExpired.ok) {
            count++;
          }
        }
      }
      if (count > 0) {
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
  checkUpdateCost(e) {
    this.isCheckUpdateCost = !this.isCheckUpdateCost;
  }

  checkProduct() {
    if (this.selectedProductId === null) {
      this.saveReceive();
    } else {
      this.alertService.confirm(`คุณมีรายการเวชภัณฑ์ที่ยังไม่ได้กดเพิ่ม ต้องการทำต่อใช่หรือไม่ ?`)
        .then(() => {
          this.saveReceive();
        }).catch((err) => {
          this.alertService.error(err);
        });
    }
  }

}
