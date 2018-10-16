import { PeriodService } from './../../period.service';
import { JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';

import { AlertExpiredService } from './../alert-expired.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WarehouseService } from "../warehouse.service";
import { ReceiveService } from "../receive.service";
import { LabelerService } from "../labeler.service";
import { AlertService } from "../../alert.service";
import { BorrowItemsService } from "../borrow-items.service"
import { IMyOptions } from 'mydatepicker-th';
import { DateService } from 'app/date.service';

@Component({
  selector: 'wm-returned-edit',
  templateUrl: './returned-edit.component.html',
  styleUrls: ['./returned-edit.component.css']
})
export class ReturnedEditComponent implements OnInit {

  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('packageModal') public packageModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  // @ViewChild('lotList') public lotList: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('locationList') public locationList: any;

  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('wmSearchLabeler') public wmSearchLabeler: any;
  @ViewChild('modalLoading') public modalLoading: any;
  totalProduct = 0;
  totalCost = 0;
  loading = false;
  isClosePurchase = false;
  openConflict = false;

  lots = [];

  modalBorrow: boolean = false;
  products = [];
  productPurchases = [];

  receiveTypes = [];
  receiveStatus = [];
  warehouses = [];
  locations = [];
  isFree = false;
  selectedDiscount = 0;

  isUpdate = false;
  isSaving = false;
  is_expired = 'N';
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  myDatePickerPurchaseOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };

  returnedDate: any;
  deliveryDate: any;
  expiredDate: any;
  deliveryCode: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  purchaseDate: any;
  receiveStatusId: any;
  receiveTypeId: any;
  committee_id: any;

  jwtHelper: JwtHelper = new JwtHelper();
  dataServiceM: any;
  dataServiceV: any;
  dataServiceProduct: any;

  units = [];
  primaryUnitName = null;
  primaryUnitId = null;
  selectedUnitId = null;
  selectedUnitName = null;
  selectedUnitGenericId = null;
  selectedReturnedQty: any;
  selectedCost = 0;
  conversionQty = 0;

  selectedExpiredDate = null;

  selectedSupplierName = null;
  selectedSupplierId = null;

  selectedProductId = null;
  selectedProductName = null;
  selectedGenericName = null;

  selectedManufactureId: any = null;
  selectedManufactureName: any = null;
  selectedWarehouseId: any = null;
  selectedWarehouseName: any = null;
  selectedLocationId: any = null;
  selectedLocationName: any = null;
  selectedLotId = null;
  selectedLotNo = null;
  selectedExpireNumDays = 0;
  isLotControl = null;

  approveStatus = 1;
  borrow: any = [];
  borrowOther: any = [];
  borrowCode: any;
  borrowType: any;

  token = null;

  returnedCode: any;

  selectedGenericId: null;
  receiveExpired: any;
  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  modalExpired = false;
  commentDate: any;
  comment: any;
  isComment = false;
  returnedId: any;

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
    private alertExpireService: AlertExpiredService,
    @Inject('API_URL') private apiUrl: string,
    private daetService: DateService,
    private route: ActivatedRoute,
    private borrowItemsService: BorrowItemsService,
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    // this.numDayExpired = +decodedToken.WM_CHECK_EXPIRE_ALERT_DAY || 60;
    // this.nullExpired = decodedToken.WM_RECEIVE_EXPIRED === 'N' ? true : false; // เก่า
    this.receiveExpired = decodedToken.WM_RECEIVE_EXPIRED === 'Y' ? true : false;

    this.route.queryParams
      .subscribe(params => {
        this.returnedId = params.returnedId;
      });
  }

  async ngOnInit() {

    const date = new Date();

    this.returnedDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.getReturnedDetail();
    this.modalLoading.hide();
  }

  async getReturnedDetail() {
    try {
      this.modalLoading.show();
      const returnedId = this.returnedId;
      const rs = await this.borrowItemsService.getReturnedDetail(returnedId);
      const rsDetail = rs.detail[0];
      this.borrowCode = rs.borrow.length ? rs.borrow[0].borrow_code : rs.borrowOther[0].borrow_other_code;
      this.returnedCode = rsDetail.returned_code;
      if (rsDetail.returned_date) {
        this.returnedDate = {
          date: {
            year: moment(rsDetail.returned_date).get('year'),
            month: moment(rsDetail.returned_date).get('month') + 1,
            day: moment(rsDetail.returned_date).get('date')
          }
        }
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  changeManufacture(event: any) {
    try {
      this.selectedManufactureId = event.labeler_id ? event.labeler_id : null;
      this.selectedManufactureName = event.labeler_name ? event.labeler_name : null;
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

  changeEditLocation(idx: any, event: any) {
    try {
      this.products[idx].location_id = event.location_id;
      this.products[idx].location_name = event.location_name;
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
      this.alertService.error(error);

    }
  }

  editChangeWarehouse(idx, event: any, cmp: any) {
    try {
      this.products[idx].warehouse_id = event.warehouse_id;
      this.products[idx].warehouse_name = event.warehouse_name;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  clearProductSearch() {
    this.selectedProductId = null;
    this.conversionQty = 0;
    this.selectedReturnedQty = '';
  }

  changeUnit(event: any) {
    try {
      this.selectedUnitName = event.unit_name;
      this.selectedUnitId = event.unit_id;
      this.conversionQty = event.qty;
      this.selectedUnitGenericId = event.unit_generic_id;
      this.selectedCost = event.cost
    } catch (error) {
      this.alertService.error(error);
    }
  }

  selectedSupplier(event: any) {
    try {
      this.selectedSupplierId = event.labeler_id;
      this.selectedSupplierName = event.labeler_name;
    } catch (error) {
      this.alertService.error(error);
    }
  }

  clearSupplier(event: any) {
    if (event) {
      this.wmSearchLabeler.onClearSelected();
      this.selectedSupplierId = null;
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
      this.warehouseList.getWarehouse(this.selectedGenericId);
      this.getUnitConversion(this.selectedGenericId);
      this.unitList.setGenericId(this.selectedGenericId);

    } catch (error) {
      console.log(error.message);
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

  addProduct() {
    const product: any = {};
    product.product_id = this.selectedProductId;
    product.product_name = this.selectedProductName;
    product.generic_name = this.selectedGenericName;
    product.returned_qty = this.selectedReturnedQty;
    // product.canReceive = this.selectedReturnedQty;
    product.lot_no = this.selectedLotNo ? this.selectedLotNo.toUpperCase() : null;
    product.generic_id = this.selectedGenericId;
    product.discount = +this.selectedDiscount;
    product.expire_num_days = this.selectedExpireNumDays;
    // vendor
    product.manufacture_id = this.selectedManufactureId;
    product.manufacture_name = this.selectedManufactureName;

    // warehouses
    product.warehouse_id = this.selectedWarehouseId;
    product.warehouse_name = this.selectedWarehouseName;

    // location
    product.location_id = this.selectedLocationId;
    product.location_name = this.selectedLocationName;

    product.unit_generic_id = this.selectedUnitGenericId;
    // product.unit_name = this.selectedUnitName;
    // product.unit_id = this.selectedUnitId;
    product.conversion_qty = +this.conversionQty;

    // lot control
    product.is_lot_control = this.isLotControl;

    product.cost = this.selectedCost;

    // ของแถม
    product.is_free = this.isFree ? 'Y' : 'N';
    product.expired_date = this.selectedExpiredDate;

    const idx = _.findIndex(this.products, { product_id: this.selectedProductId, lot_no: this.selectedLotNo, expired_date: this.selectedExpiredDate, is_free: product.is_free })

    if (idx > -1) {
      this.alertService.error('รายการนี้มีอยู่แล้ว กรุณาตรวจสอบ');
    } else {
      this.products.push(product);
      // cal total price
      this.countTotalCost();
      this.clearForm();
    }

  }

  countTotalCost() {
    this.totalCost = 0;
    this.products.forEach((v: any) => {
      if (v.is_free === 'N') {
        this.totalCost += (+v.cost * +v.receive_qty);
      }
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
    this.selectedReturnedQty = '';
    this.selectedUnitId = null;
    this.selectedUnitName = null;
    this.selectedUnitGenericId = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.conversionQty = 0;
    this.selectedDiscount = 0;

    // ของแถม
    this.isFree = false;
    this.isLotControl = null;

    this.selectedManufactureId = null;
    this.selectedManufactureName = null;

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
      .catch((error) => {
        this.alertService.error(error);
      });
  }

  // edit data
  editChangeReceiveQty(idx: any, cmp: any, value: any) {
    this.products[idx].receive_qty = value;
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
      this.alertService.error(error);
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
      this.alertService.error(error);
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
    this.products[idx].expired_date = expired;
  }

  editChangeFree(idx: any, value: any) {
    try {
      this.products[idx].is_free = this.products[idx].is_free === 'Y' ? 'N' : 'Y';
      this.countTotalCost();
    } catch (error) {
      this.alertService.error(error);
    }
  }
  async saveReceive() {
    if (this.returnedDate) {
      const _returnedDate = this.returnedDate ?
        `${this.returnedDate.date.year}-${this.returnedDate.date.month}-${this.returnedDate.date.day}` : null;
      const rsP = await this.periodService.getStatus(_returnedDate)
      if (rsP.rows[0].status_close === 'Y') {
        this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถคืนได้');
        this.isReceivePeriod = true;
      } else {
        const rs = await this.receiveService.getPurchaseCheckHoliday(_returnedDate);
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
      this.alertService.error('กรุณาระบุวันที่คืน');
    }
  }

  saveComment() {
    this.modalExpired = false;
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
    if (!this.returnedDate) {
      this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      this.isSaving = false;
      this.modalLoading.hide();
    } else {
      const _returnedDate = this.returnedDate ?
        `${this.returnedDate.date.year}-${this.returnedDate.date.month}-${this.returnedDate.date.day}` : null;
      if (_returnedDate) {
        this.modalLoading.show();
        this.alertService.confirm('ต้องการบันทึกข้อมูลการคืนสินค้า ใช่หรือไม่?')
          .then(() => {
            try {
              const summary = {
                borrowType: this.borrowType,
                borrowCode: this.borrowCode,
                returnedDate: _returnedDate,
                returnedCode: this.returnedCode,
                receiveStatusId: this.receiveStatusId,
                supplierId: this.selectedSupplierId,
                purchaseOrderId: this.purchaseOrderId,
                comment: this.comment,
                committee_id: this.committee_id,
                is_expired: this.is_expired
              }

              // remove qty = 0
              const _products = [];
              // check warehouse
              let isErrorWarehouse = false;
              this.products.forEach((v: any) => {
                if (v.returned_qty > 0) {
                  if (v.warehouse_id && v.unit_generic_id) {
                    _products.push(v);
                  } else {
                    isErrorWarehouse = true;
                  }
                }
                if (!v.lot_no || v.lot_no === '') {
                  isErrorWarehouse = true;
                }
              });

              if (isErrorWarehouse) {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error('ข้อมูลรายการสินค้าไม่ครบถ้วน [คลังสินค้า, หน่วยรับ, lot]');
              } else {
                // save product receive
                this.borrowItemsService.saveReceive(summary, _products)
                  .then((res: any) => {
                    this.modalLoading.hide();
                    this.isSaving = false;
                    if (res.ok) {
                      this.router.navigate(['/staff/borrow']);
                    } else {
                      this.alertService.error(res.error);
                    }
                  }).catch(error => {
                    this.isSaving = false;
                    this.alertService.error(error.message);
                    this.modalLoading.hide();
                  });
              }
            } catch (error) {
              this.isSaving = false;
              this.modalLoading.hide();
              this.alertService.error(error.message);
            }
          }).catch(() => {
            this.isSaving = false;
            this.modalLoading.hide();
          });
      }
    }
  }

  changeSearchProduct(event) {
    if (event) {
      this.productSearch.clearProductSearch();
      this.clearForm();
    }
  }

  async searchBorrow() {
    this.modalBorrow = true;

    this.getBorrowList();
    this.getBorrowOtherList();
  }

  async setSelected(items: any) {
    console.log(items);
    this.borrowType = items.dst_warehouse_id ? 1 : 0;
    this.borrowCode = items.borrow_code ? items.borrow_code : items.borrow_other_code;

    this.modalBorrow = false;
  }

  async getBorrowList() {
    this.modalLoading.show();
    try {
      const rs = await this.borrowItemsService.list(this.approveStatus, 0, 0);
      if (rs.ok) {
        this.borrow = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async getBorrowOtherList() {
    this.modalLoading.show();
    try {
      const rs = await this.borrowItemsService.listOther(this.approveStatus, 0, 0);
      if (rs.ok) {
        this.borrowOther = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  editChangeDiscount(idx, discount) {
    this.products[idx].discount = +discount;
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
          const expired_date = moment(new Date(d[2], d[1] - 1, d[0])).format('YYYY-MM-DD');
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