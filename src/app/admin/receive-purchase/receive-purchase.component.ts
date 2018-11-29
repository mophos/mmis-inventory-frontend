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
import { IMyOptions } from 'mydatepicker-th';
import { DateService } from 'app/date.service';

@Component({
  selector: 'wm-receive-purchase',
  templateUrl: './receive-purchase.component.html'
})
export class ReceivePurchaseComponent implements OnInit {

  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('packageModal') public packageModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  // @ViewChild('lotList') public lotList: any;
  @ViewChild('warehouseList') public warehouseList: any;
  @ViewChild('locationList') public locationList: any;

  @ViewChild('productSearch') public productSearch: any;
  @ViewChild('unitList') public unitList: any;
  @ViewChild('modalPurchases') public modalPurchases: any;
  @ViewChild('wmSearchLabeler') public wmSearchLabeler: any;
  @ViewChild('modalLoading') public modalLoading: any;
  totalProduct = 0;
  totalCost = 0;
  loading = false;
  isClosePurchase = false;
  openConflict = false;

  lots = [];

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

  receiveDate: any;
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
  selectedReceiveQty: any;
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

  token = null;

  receiveCode: any;

  selectedGenericId: null;
  receiveExpired: any;
  maskDate = [/\d/, /\d/, '/', /\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];

  modalExpired = false;
  commentDate: any;
  comment: any;
  isComment = false;
  purchaseId: any;

  isItemExpired = false; // false = รับได้ true = หมดอายุ
  isExpired = false // false = กรอกวันหมดอายุ   true = ไม่กรอกวันหมดอายุ
  isReceiveHoliday = false; // false = รับได้ true = เป็นวันหยุด
  isReceivePeriod = false; // false = รับได้ true = ปิดรอบ
  locationId: any = '';


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
    private periodService: PeriodService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    // this.numDayExpired = +decodedToken.WM_CHECK_EXPIRE_ALERT_DAY || 60;
    // this.nullExpired = decodedToken.WM_RECEIVE_EXPIRED === 'N' ? true : false; // เก่า
    this.receiveExpired = decodedToken.WM_RECEIVE_EXPIRED === 'Y' ? true : false;

    this.route.queryParams
      .subscribe(params => {
        this.purchaseId = params.purchaseId;
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

    this.deliveryDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    this.modalLoading.show();
    const respReceiveTypes: any = await this.receiveService.getReceiveTypes()
    if (respReceiveTypes.ok) {
      this.receiveTypes = respReceiveTypes.rows;
    }

    const respStatus: any = await this.receiveService.getStatusStatus()
    if (respStatus.ok) {
      this.receiveStatus = respStatus.rows;
    }

    this.modalLoading.hide();

    if (this.purchaseId) {
      // get purchase items
      this.getPurchaseProducts(this.purchaseId);
      this.getPurchaseInfo(this.purchaseId);
    }
  }

  async getPurchaseProducts(purchaseOrderId: any) {
    // clear old products
    const _products = [];
    this.modalLoading.show();

    try {
      const res: any = await this.receiveService.getPurchaseProductsList(purchaseOrderId);
      if (res.ok) {
        for (let v of res.rows) {
          if ((+v.purchase_qty - +v.total_received_qty) > 0) {
            const obj: any = {};

            obj.product_id = v.product_id;
            obj.product_name = v.product_name;
            obj.receive_qty = +v.purchase_qty - +v.total_received_qty;
            obj.max_receive_qty = +v.purchase_qty - +v.total_received_qty;
            obj.primary_unit_id = +v.base_unit_id;
            obj.primary_unit_name = v.base_unit_name;
            obj.lot_no = null;
            obj.expired_date = null;
            obj.discount = 0;
            obj.generic_id = v.generic_id;
            obj.generic_name = v.generic_name;
            obj.working_code = v.working_code;

            // vendor
            obj.manufacture_id = v.m_labeler_id;
            obj.manufacture_name = v.m_labeler_name;

            // warehouses
            obj.warehouse_id = null;
            obj.warehouse_name = null;

            // location
            obj.location_id = null;
            obj.location_name = null;
            obj.canReceive = +v.purchase_qty - +v.total_received_qty;

            obj.unit_generic_id = +v.unit_generic_id;
            obj.cost = v.cost;

            // ของแถม
            obj.is_free = v.giveaway;

            this.products.push(obj);
          }
        };
        this.modalLoading.hide();
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
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
        this.setLocation(this.selectedWarehouseId);
        this.locationList.getLocations(event.warehouse_id);
      }
    } catch (error) {
      this.alertService.error(error);

    }
  }
  async setLocation(warehouseId) {
    let rs: any = await this.receiveService.getLastLocation(warehouseId, this.selectedProductId);
    this.locationId = rs.ok ? rs.detail.location_id : '';
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
    this.selectedReceiveQty = '';
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

  async setSelectedProduct(event: any) {
    try {
      this.selectedProductId = event ? event.product_id : null;
      this.selectedGenericId = event ? event.generic_id : null;
      this.selectedProductName = event ? `${event.product_name}` : null;
      this.selectedGenericName = event ? `${event.generic_name}` : null;
      this.selectedExpireNumDays = event ? event.expire_num_days : 0;
      this.manufactureList.getManufacture(this.selectedGenericId);
      this.warehouseList.getWarehouse(this.selectedGenericId);
      this.primaryUnitId = event ? event.primary_unit_id : null;
      this.unitList.setGenericId(this.selectedGenericId);

      // lot control
      this.isLotControl = event ? event.is_lot_control : null;

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
    product.canReceive = this.selectedReceiveQty;
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

    const fill = _.filter(this.products, { product_id: this.selectedProductId, lot_no: this.selectedLotNo, expired_date: this.selectedExpiredDate, is_free: 'Y' })
    if(fill.length < 1)
    {
      if (idx > -1) {
        this.alertService.confirm('รายการซ้ำ ต้องการเพิ่มเป็นของแถมใช่ หรือ ไม่?')
        .then(() => {
          product.is_free = 'Y';
          
          this.products.push(product);
          // cal total price
          this.countTotalCost();
          this.clearForm();
        })
        .catch(() => {
          product.is_free = 'N';
        });
      } else {
        this.products.push(product);
        // cal total price
        this.countTotalCost();
        this.clearForm();
      }
    } else {
      this.alertService.error('รายการซ้ำ');
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
    this.selectedReceiveQty = '';
    this.selectedUnitId = null;
    this.selectedUnitName = null;
    this.selectedUnitGenericId = null;
    this.primaryUnitId = null;
    this.primaryUnitName = null;
    this.conversionQty = 0;
    this.selectedDiscount = 0;
    this.locationId = ''

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

  async editChangeFree(idx: any, value: any) {
    try {
      this.products[idx].is_free = this.products[idx].is_free === 'Y' ? 'N' : 'Y';
      console.log(this.products[idx].unit_generic_id);
      if (this.products[idx].is_free === 'Y') {
        this.products[idx].cost = 0
      } else {
        let cost = await this.receiveService.getUnitGeneric(this.products[idx].unit_generic_id);
        this.products[idx].cost = cost.rows[0].cost
      }
      this.countTotalCost();
    } catch (error) {
      this.alertService.error(error);
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
    if (!this.receiveDate ||
      !this.deliveryDate || !this.deliveryCode) {
      this.alertService.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      this.isSaving = false;
      this.modalLoading.hide();
    } else {

      const _receiveDate = this.receiveDate ?
        `${this.receiveDate.date.year}-${this.receiveDate.date.month}-${this.receiveDate.date.day}` : null;
      const _deliveryDate = this.deliveryDate ?
        `${this.deliveryDate.date.year}-${this.deliveryDate.date.month}-${this.deliveryDate.date.day}` : null;
      const _purchaseDate = this.purchaseDate ?
        `${this.purchaseDate.date.year}-${this.purchaseDate.date.month}-${this.purchaseDate.date.day}` : null;

      const isValidReceiveDate = moment(_receiveDate, 'YYYY-MM-DD').isSameOrAfter(_purchaseDate);
      const isValidDeliveryDate = moment(_deliveryDate, 'YYYY-MM-DD').isSameOrAfter(_purchaseDate);

      if (_purchaseDate) {
        if (isValidReceiveDate && isValidDeliveryDate) {
          this.alertService.confirm('ต้องการบันทึกข้อมูลการรับสินค้า ใช่หรือไม่?')
            .then(async () => {
              this.modalLoading.show();
              this.isSaving = true;
              try {
                const summary = {
                  receiveDate: _receiveDate,
                  receiveCode: this.receiveCode,
                  deliveryCode: this.deliveryCode,
                  deliveryDate: _deliveryDate,
                  receiveStatusId: this.receiveStatusId,
                  supplierId: this.selectedSupplierId,
                  purchaseOrderId: this.purchaseOrderId,
                  comment: this.comment,
                  committee_id: this.committee_id,
                  is_expired: this.is_expired
                };
                // remove qty = 0
                const _products = [];
                // check warehouse
                let isError = false;
                this.products.forEach((v: any) => {
                  if (v.receive_qty > 0) {
                    _products.push(v);
                    if (v.warehouse_id && v.receive_qty > 0 && v.product_id && v.unit_generic_id && v.cost >= 0) {
                      if (v.expired_date) {
                        const validDate = this.daetService.isValidDateExpire(v.expired_date);
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
                  }
                });

                if (isError) {
                  this.modalLoading.hide();
                  this.isSaving = false;
                  this.alertService.error('ข้อมูลรายการสินค้าบางรายการไม่ครบถ้วน [คลังสินค้า, หน่วยรับ, lot, วันหมดอายุ]');
                } else {
                  // save product receive
                  const _closePurchase = this.isClosePurchase ? 'Y' : 'N';
                  const rs: any = await this.receiveService.saveReceive(summary, _products, _closePurchase);
                  this.modalLoading.hide();
                  this.isSaving = false;
                  if (rs.ok) {
                    sessionStorage.setItem('tabReceive', 'receive');
                    this.router.navigate(['/admin/receives']);
                  } else {
                    this.alertService.error(rs.error);
                  }
                }
              } catch (error) {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error(error.message);
              }
            }).catch(() => {
              this.modalLoading.hide();
              this.isSaving = false;
            });
        } else {
          this.isSaving = false;
          this.modalLoading.hide();
          this.alertService.error('ไม่สามารถบันทึกรับสินค้าก่อนวันออกใบสั่งซื้อได้!');
        }
      } else {
        this.modalLoading.show();
        this.alertService.confirm('ต้องการบันทึกข้อมูลการรับสินค้า ใช่หรือไม่?')
          .then(() => {
            try {
              const summary = {
                receiveDate: _receiveDate,
                receiveCode: this.receiveCode,
                deliveryCode: this.deliveryCode,
                deliveryDate: _deliveryDate,
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
                if (v.receive_qty > 0) {
                  if (v.warehouse_id && v.unit_generic_id) {
                    _products.push(v);
                  } else {
                    isErrorWarehouse = true;
                  }
                }
                if (v.is_lot_control === 'Y') {
                  if (!v.lot_no || v.lot_no === '') {
                    isErrorWarehouse = true;
                  }
                }
              });

              if (isErrorWarehouse) {
                this.isSaving = false;
                this.modalLoading.hide();
                this.alertService.error('ข้อมูลรายการสินค้าไม่ครบถ้วน [คลังสินค้า, หน่วยรับ, lot]');
              } else {
                // save product receive
                const _closePurchase = this.isClosePurchase ? 'Y' : 'N';
                this.receiveService.saveReceive(summary, _products, _closePurchase)
                  .then((res: any) => {
                    this.modalLoading.hide();
                    this.isSaving = false;
                    if (res.ok) {
                      this.router.navigate(['/admin/receives']);
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

  searchPurchase() {
    this.modalPurchases.openModal();
  }

  async getPurchaseInfo(purchaseOrderId: any) {
    try {
      this.modalLoading.show();
      const rs: any = await this.receiveService.getPurchaseInfo(purchaseOrderId);
      this.modalLoading.hide();

      if (rs.ok) {
        if (rs.detail) {
          this.purchaseOrderId = rs.detail.purchase_order_id;
          this.purchaseOrderNumber = rs.detail.purchase_order_number;
          this.purchaseDate = {
            date: {
              year: moment(rs.detail.order_date).get('year'),
              month: moment(rs.detail.order_date).get('month') + 1,
              day: moment(rs.detail.order_date).get('date')
            }
          };

          const rsPo: any = await this.receiveService.getCommittePO(this.purchaseOrderId);

          if (rsPo.ok) {
            this.committee_id = rsPo.rows.length ? rsPo.rows[0].verify_committee_id : null;
          } else {
            this.alertService.error(rsPo.error)
          }

          this.wmSearchLabeler.setDefault(rs.detail.labeler_name);
          this.selectedSupplierId = rs.detail.labeler_id;
          this.selectedSupplierName = rs.detail.labeler_name;
        }

      } else {
        this.alertService.error(rs.error);
      }


    } catch (error) {
      console.log(error);
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  async setSelectPurchase(event) {
    this.purchaseOrderId = event.purchase.purchase_order_id;
    this.purchaseOrderNumber = event.purchase.purchase_order_number;
    this.purchaseDate = {
      date: {
        year: moment(event.purchase.order_date).get('year'),
        month: moment(event.purchase.order_date).get('month') + 1,
        day: moment(event.purchase.order_date).get('date')
      }
    };

    try {
      const rs: any = await this.receiveService.getCommittePO(this.purchaseOrderId);
      if (rs.ok) {
        this.committee_id = rs.rows.length ? rs.rows[0].verify_committee_id : null;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }

    this.wmSearchLabeler.setDefault(event.purchase.labeler_name);
    this.selectedSupplierId = event.purchase.vendor_id;
    this.selectedSupplierName = event.purchase.labeler_name;
    // set products
    this.products = event.products;
  }

  closePurchaseModal(event) {

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
    let check: boolean = false;
    this.products.forEach(v => {
      if (v.receive_qty < v.canReceive && this.isClosePurchase) check = true;
    });

    if (check) {
      this.alertService.confirm(`คุณมีรายการเวชภัณฑ์ที่ยังรับไม่ครบ ต้องการทำต่อใช่หรือไม่ ?`)
        .then(() => {
          this.saveReceive();
        }).catch((err) => {
        })
    } else this.saveReceive();
  }
}