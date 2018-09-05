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

import 'rxjs/add/operator/filter';

import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';
import { DateService } from 'app/date.service';

@Component({
  selector: 'wm-receive-edit',
  templateUrl: './receive-edit.component.html'
})
export class ReceiveEditComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  @ViewChild('lotList') public lotList: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('locationList') public locationList: any;
  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('modalPurchases') public modalPurchases: any;
  @ViewChild('modalUpload') public modalUpload: any;
  @ViewChild('wmSearchLabeler') public wmSearchLabeler: any;
  @ViewChild('modalLoading') public modalLoading: any;

  totalProduct = 0;
  totalCost = 0;
  loading = false;
  isClosePurchase = false;
  lots = [];

  products = [];

  receiveTypes = [];
  receiveStatus = [];
  warehouses = [];
  locations = [];
  isFree = false;
  isApprove = false;
  isUpdate = false;
  isSaving = false;
  isCompleted = false;
  isSuccess = false;

  selectedDiscount = 0;

  deleting = false;

  committees: any = [];
  committeesPeople: any = [];
  committeeId: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: this.isApprove
  };

  myDatePickerPurchaseOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };
  is_expired = 'N';
  approveDate: any;
  receiveDate: any;
  deliveryDate: any;
  expiredDate: any;
  deliveryCode: string;
  purchaseOrderId: string;
  purchaseOrderNumber: string;
  purchaseDate: any;
  receiveStatusId: any;
  receiveTypeId: any;

  userWarehouseId: any;
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
  selectedReceiveQty = 0;
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
  token = null;

  receiveCode: any;
  receiveTmpCode: any;

  selectedGenericId: null;
  receiveId: any;

  documentId: any;
  documentPrefix: any;

  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  modalExpired = false;
  commentDate: any;
  comment: any;
  isComment = false;

  isLotControl: any;

  isItemExpired = false; // false = รับได้ true = หมดอายุ
  isExpired = false // false = กรอกวันหมดอายุ   true = ไม่กรอกวันหมดอายุ
  isReceiveHoliday = false; // false = รับได้ true = เป็นวันหยุด
  isReceivePeriod = false; // false = รับได้ true = ปิดรอบ

  // numDayExpired: number;
  receiveExpired: any;
  constructor(
    private wareHouseService: WarehouseService,
    private receiveService: ReceiveService,
    private labelerService: LabelerService,
    private alertService: AlertService,
    private router: Router,
    // private ref: ChangeDetectorRef,
    private toThaiDate: ToThaiDatePipe,
    // private alertExpireService: AlertExpiredService,
    private route: ActivatedRoute,
    @Inject('API_URL') private apiUrl: string,
    @Inject('REV_PREFIX') public docPrefix: string,
    private dateService: DateService,
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.userWarehouseId = +decodedToken.warehouseId;
    // this.numDayExpired = +decodedToken.WM_CHECK_EXPIRE_ALERT_DAY || 60;
    this.receiveExpired = decodedToken.WM_RECEIVE_EXPIRED === 'Y' ? true : false;
    this.route.queryParams
      // .filter(params => params.order)
      .subscribe(params => {
        this.receiveId = params.receiveId;
      });
  }

  async ngOnInit() {
    this.documentId = this.receiveId;
    this.documentPrefix = this.docPrefix;
    const date = new Date();

    this.receiveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.approveDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.deliveryDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.getReceiveTypes();
    this.getCommittees();
    this.getReceiveStatus();

    // get receive product
    await this.getReceiveProductList(this.receiveId);
    await this.getReceiveInfo(this.receiveId);
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

  async getCommittees() {
    try {
      this.modalLoading.show();
      const rs: any = await this.receiveService.getCommittee()
      if (rs.ok) {
        this.committees = rs.rows;
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

  editChangeWarehouse(idx, event: any, cmp: any) {
    try {
      this.products[idx].warehouse_id = event.warehouse_id;
      this.products[idx].warehouse_name = event.warehouse_name;
    } catch (error) {
      console.log(error);
    }
  }

  changeEditLocation(productId: any, event: any) {
    try {
      const idx = _.findIndex(this.products, { 'product_id': productId });
      if (idx > -1) {
        this.products[idx].location_id = event.location_id;
        this.products[idx].location_name = event.location_name;
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
      this.selectedCost = event.cost;
      this.selectedUnitGenericId = event.unit_generic_id;
      this.conversionQty = event.qty;
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

  clearSupplier() {
    this.selectedSupplierId = null;
  }

  setSelectedProduct(event: any) {
    try {
      this.selectedProductId = event ? event.product_id : null;
      this.selectedProductName = event ? `${event.product_name}` : null;
      this.selectedGenericName = event ? `${event.generic_name}` : null;
      this.selectedExpireNumDays = event ? event.expire_num_days : 0;
      this.selectedGenericId = event ? event.generic_id : null;
      this.manufactureList.getManufacture(this.selectedGenericId);
      this.warehouseList.getWarehouse(this.selectedGenericId);

      this.primaryUnitId = event ? event.primary_unit_id : null;
      this.primaryUnitName = event ? event.primary_unit_name : null;
      // lot control
      this.isLotControl = event ? event.is_lot_control : null;

      this.unitList.setGenericId(this.selectedGenericId);

    } catch (error) {
      this.alertService.error(error);
    }
  }

  addProduct() {
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
    product.warehouse_id = this.selectedWarehouseId;
    product.warehouse_name = this.selectedWarehouseName;

    // location
    product.location_id = this.selectedLocationId;
    product.location_name = this.selectedLocationName;

    product.conversion_qty = +this.conversionQty;
    product.unit_generic_id = this.selectedUnitGenericId;
    product.discount = +this.selectedDiscount;

    // ของแถม
    product.is_free = this.isFree ? 'Y' : 'N';

    product.cost = this.selectedCost;
    product.discount = +this.selectedDiscount;

    // lot control
    product.is_lot_control = this.isLotControl;

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
        this.totalCost += (v.cost * v.receive_qty);
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
    this.selectedReceiveQty = 0;
    this.selectedGenericId = null;
    this.selectedUnitGenericId = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.conversionQty = 0;
    this.selectedDiscount = 0;
    this.isSuccess = false;
    this.isCompleted = false;
    this.isLotControl = null;

    // ของแถม
    this.isFree = false;

    this.selectedManufactureId = null;
    this.selectedManufactureName = null;

    this.manufactureList.clearVendor();
    this.warehouseList.clearWarehousList();
    this.locationList.clearLocation();
    this.productSearch.clearProductSearch();
    this.unitList.clearUnits();
  }

  changeSearchProduct(event) {
    if (event) {
      this.productSearch.clearProductSearch();
      this.clearForm();
    }
  }

  async removeSelectedProduct(idx: any) {
    let index:any = _.findIndex(this.products,{ product_id: this.products[idx].product_id, lot_no: this.products[idx].lot_no, unit_generic_id: this.products[idx].unit_generic_id })
    let rs:any = await this.receiveService.checkDeleteProductWithPick(this.products[idx],this.receiveId)
    if(rs.ok || index != idx){
      this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.products.splice(idx, 1);
        this.countTotalCost();
      })
      .catch((error) => {
        this.alertService.error(error);
      });
    } else{
      this.alertService.error(rs.error)
    }
    
  }

  // edit data
  editChangeReceiveQty(idx: any, cmp: any) {
    if (cmp.value === '0') {
      this.alertService.confirm(`คุณระบุจำนวนเท่ากับ 0, ต้องการลบรายการใช่หรือไม่?`)
        .then(() => {
          this.products.splice(idx, 1);
          this.countTotalCost();
        }).catch(() => {
          cmp.value = this.products[idx].canReceive || 0;
        });
    } else {
      this.products[idx].receive_qty = cmp.value;
    }
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
    this.products[idx].lot_no = lot;
  }

  editChangeLotExpired(idx: any, expired: any) {
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

  async updateReceive() {
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
            this.updateReceiveTo();
          }
        }

      }
    } else {
      this.alertService.error('กรุณาระบุวันที่รับ');
    }
  }

  saveComment() {
    this.modalExpired = false;
    this.isComment = false;
    this.is_expired = 'Y';
    this.updateReceiveTo();
  }

  closeExpireModal() {
    this.modalExpired = false;
    this.modalLoading.hide();
    this.isSaving = false;
  }

  updateReceiveTo() {
    if (!this.receiveDate || !this.deliveryCode || !this.deliveryDate || !this.receiveId || !this.selectedSupplierId) {
      this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      this.isSaving = false;
      this.modalLoading.hide();
    } else {
      this.alertService.confirm('ต้องการบันทึกข้อมูลการรับสินค้า ใช่หรือไม่?')
        .then(async () => {
          this.modalLoading.show();
          this.isSaving = true;
          try {
            const _receiveDate = this.receiveDate ?
              `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}` : null;
            const _deliveryDate = this.deliveryDate ?
              `${this.deliveryDate.date.year}-${this.deliveryDate.date.month}-${this.deliveryDate.date.day}` : null;
            const _purchaseDate = this.purchaseDate ?
              `${this.purchaseDate.date.year}-${this.purchaseDate.date.month}-${this.purchaseDate.date.day}` : null;

            const isValidReceiveDate = moment(_receiveDate, 'YYYY-MM-DD').isSameOrAfter(_purchaseDate);
            const isValidDeliveryDate = moment(_deliveryDate, 'YYYY-MM-DD').isSameOrAfter(_purchaseDate);

            if (_purchaseDate) {
              if (isValidDeliveryDate && isValidReceiveDate) {
                const summary = {
                  receiveDate: _receiveDate,
                  receiveCode: this.receiveCode,
                  deliveryCode: this.deliveryCode,
                  deliveryDate: _deliveryDate,
                  receiveStatusId: this.receiveStatusId,
                  supplierId: this.selectedSupplierId,
                  purchaseOrderId: this.purchaseOrderId,
                  isSuccess: this.isSuccess ? 'Y' : 'N',
                  isCompleted: this.isCompleted ? 'Y' : 'N',
                  comment: this.comment,
                  is_expired: this.is_expired
                }
                // remove qty = 0
                const _products = [];
                let isError = false;
                this.products.forEach((v: any) => {
                  if (v.receive_qty > 0 && v.cost >= 0 && v.warehouse_id && v.unit_generic_id) {
                    _products.push(v);
                    if (v.expired_date) {
                      const validDate = this.dateService.isValidDateExpire(v.expired_date);
                      if (!validDate) {
                        isError = true;
                      }
                    }

                    // check lot control
                    if (v.is_lot_control === 'Y') {
                      if (!v.lot_no || v.lot_no === '') {
                        isError = true;
                      }
                    }
                  } else {
                    isError = true;
                  }
                });

                if (isError) {
                  this.modalLoading.hide();
                  this.isSaving = false;
                  this.alertService.error('ข้อมูลรายการสินค้าบางรายการไม่ครบถ้วน [คลังสินค้า, หน่วยรับ, lot, วันหมดอายุ]');
                } else {
                  const _closePurchase = this.isClosePurchase ? 'Y' : 'N';
                  const rs: any = await this.receiveService.updateReceive(this.receiveId, summary, _products, _closePurchase);
                  if (rs.ok) {
                    this.modalLoading.hide();
                    this.router.navigate(['/admin/receives']);
                  } else {
                    this.isSaving = false;
                    this.modalLoading.hide();
                    this.alertService.error(JSON.stringify(rs.error));
                  }
                }
              } else {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error('ไม่สามารถบันทึกรับสินค้าก่อนวันออกใบสั่งซื้อได้!');
              }

            } else {
              const summary = {
                receiveDate: _receiveDate,
                receiveCode: this.receiveCode,
                deliveryCode: this.deliveryCode,
                deliveryDate: _deliveryDate,
                receiveStatusId: this.receiveStatusId,
                supplierId: this.selectedSupplierId,
                purchaseOrderId: this.purchaseOrderId,
                isSuccess: this.isSuccess ? 'Y' : 'N',
                isCompleted: this.isCompleted ? 'Y' : 'N',
                comment: this.comment,
                is_expired: this.is_expired
              }
              // remove qty = 0
              let isError = false;
              const _products = [];
              this.products.forEach((v: any) => {
                if (v.receive_qty > 0 && v.warehouse_id && v.unit_generic_id) {
                  _products.push(v);
                  if (v.expired_date) {
                    const valid = this.dateService.isValidDateExpire(v.expired_date);
                    if (!valid) {
                      isError = true;
                    }
                  }

                  // check lot control
                  if (v.is_lot_control === 'Y') {
                    if (!v.lot_no || v.lot_no === '') {
                      isError = true;
                    }
                  }

                } else {
                  isError = true;
                }
              });

              if (isError) {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error('ข้อมูลรายการสินค้าบางรายการไม่ครบถ้วน [คลังสินค้า, หน่วยรับ, lot, วันหมดอายุ]');
              } else {
                const _closePurchase = this.isClosePurchase ? 'Y' : 'N';
                const rs: any = await this.receiveService.updateReceive(this.receiveId, summary, _products, _closePurchase);
                this.modalLoading.hide();
                this.isSaving = false;
                if (rs.ok) {
                  this.router.navigate(['/admin/receives']);
                } else {
                  this.alertService.error(JSON.stringify(rs.error));
                }
              }

            }
          } catch (error) {
            this.isSaving = false;
            this.modalLoading.hide();
            console.log(error);
            this.alertService.error(error.message);
          }
        }).catch(() => {
          this.isSaving = false;
          this.modalLoading.hide();
        });
    }
  }

  searchPurchase() {
    this.modalPurchases.openModal();
  }

  setSelectPurchase(event) {
    let productInPo = true;
    // ตรวจสอบว่ามีรายการในใบรับอยู่ในใบสั่งซื้อหรือไม่?
    this.products.forEach((v: any) => {
      const idx = _.findIndex(event.products, { product_id: v.product_id });
      if (idx === -1) {
        productInPo = false;
      }
    });

    const _products = _.clone(this.products);

    if (productInPo) {
      _.forEach(event.products, (v: any) => {
        const idx = _.findIndex(this.products, { product_id: v.product_id });
        if (idx === -1) {
          _products.push(v);
        }
      });

      // clear old product
      this.products = _products;

      this.purchaseOrderId = event.purchase.purchase_order_id;
      this.purchaseOrderNumber = event.purchase.purchase_order_number;

      if (event.purchase.order_date) {
        this.purchaseDate = {
          date: {
            year: moment(event.purchase.order_date).get('year'),
            month: moment(event.purchase.order_date).get('month') + 1,
            day: moment(event.purchase.order_date).get('date')
          }
        };
      }

      this.wmSearchLabeler.setDefault(event.purchase.labeler_name);
      this.selectedSupplierId = event.purchase.vendor_id;
      this.selectedSupplierName = event.purchase.labeler_name;

    } else {
      this.alertService.error('มีบางรายการในใบรับ ไม่อยู่ในใบสั่งซื้อ');
    }

  }

  async getReceiveProductList(receiveId: any) {
    try {
      this.modalLoading.show();
      const res: any = await this.receiveService.getReceiveProducts(receiveId);
      if (res.ok) {
        // clear old products
        this.products = [];

        res.rows.forEach((v: any) => {
          const obj: any = {};

          obj.product_id = v.product_id;
          obj.product_name = v.product_name;
          obj.generic_name = v.generic_name;
          obj.receive_qty = v.receive_qty;
          obj.primary_unit_id = +v.base_unit_id;
          obj.primary_unit_name = v.base_unit_name;
          obj.expire_num_days = +v.expire_num_days;
          // obj.lot_id = v.lot_id;
          obj.lot_no = v.lot_no ? v.lot_no.toUpperCase() : null;
          obj.generic_id = v.generic_id;
          obj.generic_name = v.generic_name;

          // vendor
          obj.manufacture_id = v.m_labeler_id;
          obj.manufacture_name = v.m_labeler_name;

          // warehouses
          obj.warehouse_id = v.warehouse_id;
          obj.warehouse_name = v.warehouse_name;

          // location
          obj.location_id = v.location_id;
          obj.location_name = v.location_name;
          obj.unit_generic_id = v.unit_generic_id;
          obj.expired_date = moment(v.expired_date).isValid() ? moment(v.expired_date).format('DD/MM/YYYY') : null;
          obj.cost = v.cost;
          obj.discount = v.discount;
          // ของแถม
          obj.is_free = v.is_free;
          obj.is_lot_control = v.is_lot_control;

          obj.receive_detail_id = v.receive_detail_id
          this.products.push(obj);

        })

        this.countTotalCost();

      } else {
        this.alertService.error(res.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error('เกิดข้อผิดพลาด ' + error.message);
    }
  }

  removeReceive() {
    this.deleting = true;
    this.alertService.confirm('คุณต้องการลบรายการรับสินค้านี้ [' + this.receiveId + '] ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.receiveService.removeReceive(this.receiveId);
          if (rs.ok) {
            this.alertService.success();
            this.router.navigate(['/admin/receives']);
          } else {
            console.log(rs.error);
            this.alertService.error();
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
          console.log(error);
          this.deleting = false;
          this.alertService.serverError();
        }

      })
      .catch(() => {
        this.modalLoading.hide();
        this.deleting = false;
      });
  }

  async getReceiveInfo(receiveId: any) {
    try {
      this.modalLoading.show();
      const res: any = await this.receiveService.getReceiveInfo(this.receiveId);
      if (res.ok) {
        if (res.rows) {
          this.receiveCode = res.rows.receive_code;
          this.receiveTmpCode = res.rows.receive_tmp_code;
          this.receiveStatusId = res.rows.receive_status_id;
          this.selectedSupplierId = res.rows.vendor_labeler_id;
          this.selectedSupplierName = res.rows.labeler_name;
          this.approveDate = res.rows.approve_date;
          this.isApprove = res.rows.approve_id ? true : false;
          this.isSuccess = res.rows.is_success ? true : false;
          this.isCompleted = res.rows.is_completed ? true : false;
          this.wmSearchLabeler.setDefault(this.selectedSupplierName);
          if (res.rows.order_date) {
            this.purchaseDate = {
              date: {
                year: moment(res.rows.order_date).get('year'),
                month: moment(res.rows.order_date).get('month') + 1,
                day: moment(res.rows.order_date).get('date')
              }
            }
          }
          if (res.rows.receive_date) {
            this.receiveDate = {
              date: {
                year: moment(res.rows.receive_date).get('year'),
                month: moment(res.rows.receive_date).get('month') + 1,
                day: moment(res.rows.receive_date).get('date')
              }
            }
          }

          this.purchaseOrderNumber = res.rows.purchase_order_number;
          this.purchaseOrderId = res.rows.purchase_order_id;
          this.deliveryCode = res.rows.delivery_code;
          if (res.rows.delivery_date) {
            this.deliveryDate = {
              date: {
                year: moment(res.rows.delivery_date).get('year'),
                month: moment(res.rows.delivery_date).get('month') + 1,
                day: moment(res.rows.delivery_date).get('date')
              }
            }
          }

          this.committeeId = res.rows.committee_id;
        }
      } else {
        this.alertService.error(res.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  // saveApprove() {
  //   this.modalApprove.openModal();
  // }

  approveSuccess(event) {
    this.isApprove = true;
  }

  // upload file
  uploadFile() {
    this.modalUpload.openModal(this.documentId, this.docPrefix);
  }

  printReceive() {
    const url = `${this.apiUrl}/report/check/receive?receiveID=${this.receiveId}&token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

  async getCommitteeList() {
    try {
      const rs = await this.receiveService.getCommitteeList(this.committeeId);
      this.committeesPeople = rs.rows;
    } catch (error) {
      console.log(error.message);
    }
  }

  async updateReceiveCommittee(event) {
    try {
      if (this.committeeId) {
        this.modalLoading.show();
        const rs = await this.receiveService.updateReceiveCommittee(this.receiveId, this.committeeId);
        if (rs.ok) {
          this.alertService.success();
        } else {
          this.alertService.error(rs.error);
        }
        this.modalLoading.hide();
      } else {
        this.alertService.error('กรุณาเลือกคณะกรรมการ')
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error.message);
      this.alertService.error(error.message);
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
          this.updateReceiveTo();
        }
      }

    }
  }
}
