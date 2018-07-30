import { AdjustStockService } from './../../adjust-stock.service';
import { ToolsService } from './../../tools.service';
import { PeriodService } from 'app/period.service';
import { JwtHelper } from 'angular2-jwt';
import { ToThaiDatePipe } from 'app/helper/to-thai-date.pipe';
import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { WarehouseService } from "app/admin/warehouse.service";
import { ReceiveService } from "app/admin/receive.service";
import { LabelerService } from "app/admin/labeler.service";
import { AlertService } from "app/alert.service";
import { IMyOptions } from 'mydatepicker-th';
import 'rxjs/add/operator/filter';
import * as _ from 'lodash';
import * as moment from 'moment';
import { DateService } from 'app/date.service';


@Component({
  selector: 'wm-stockcard-receive',
  templateUrl: './stockcard-receive.component.html',
  styles: []
})
export class StockcardReceiveComponent implements OnInit {

  @ViewChild('lotModal') public lotModal: any;
  @ViewChild('manufactureList') public manufactureList: any;
  @ViewChild('lotList') public lotList: any;
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
  password: any;
  passwordModal = false;
  checkEnterPass = true;
  constructor(
    private wareHouseService: WarehouseService,
    private receiveService: ReceiveService,
    private labelerService: LabelerService,
    private alertService: AlertService,
    private router: Router,
    private toThaiDate: ToThaiDatePipe,
    private route: ActivatedRoute,
    @Inject('API_URL') private apiUrl: string,
    @Inject('REV_PREFIX') public docPrefix: string,
    private dateService: DateService,
    private periodService: PeriodService,
    private toolsService: ToolsService,
    private adjustStockService: AdjustStockService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.userWarehouseId = +decodedToken.warehouseId;
    this.receiveExpired = decodedToken.WM_RECEIVE_EXPIRED === 'Y' ? true : false;
    this.route.queryParams
      .subscribe(params => {
        this.receiveId = params.receiveId;
      });
  }

  async ngOnInit() {
    this.documentId = this.receiveId;
    this.documentPrefix = this.docPrefix;
    // get receive product
    await this.getReceiveProductList(this.receiveId);
    await this.getReceiveInfo(this.receiveId);
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
      this.products[idx].location_id = null;
      this.products[idx].warehouse_id = event.warehouse_id;
      this.products[idx].warehouse_name = event.warehouse_name;
    } catch (error) {
      console.log(error);
    }
  }

  changeEditLocation(idx: any, event: any) {
    try {
      if (event) {
        this.products[idx].location_id = event.location_id;
        this.products[idx].location_name = event.location_name;
      }
    } catch (error) {
      console.log('1', error);

      this.alertService.error(error);
    }
  }

  clearProductSearch() {
    this.selectedProductId = null;
    this.conversionQty = 0;
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

  countTotalCost() {
    this.totalCost = 0;
    this.products.forEach((v: any) => {
      if (v.is_free === 'N') {
        this.totalCost += (v.cost * v.receive_qty);
      }
    })
  }

  // edit data
  editChangeReceiveQty(idx: any, cmp: any) {
    if (+cmp.value === 0) {
      this.alertService.confirm(`คุณระบุจำนวนเท่ากับ 0, ต้องการลบรายการใช่หรือไม่?`)
        .then(() => {
          this.products.splice(idx, 1);
          this.countTotalCost();
        }).catch(() => {
          cmp.value = this.products[idx].canReceive;
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
            const _deliveryDate = this.deliveryDate ?
              `${this.deliveryDate.date.year}-${this.deliveryDate.date.month}-${this.deliveryDate.date.day}` : null;
            const summary = {
              receive_date: _receiveDate,
              delivery_code: this.deliveryCode,
              delivery_date: _deliveryDate
            }
            const rs: any = await this.toolsService.saveReceive(this.receiveId, summary, this.products);
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
          obj.receive_qty_old = v.receive_qty;
          obj.primary_unit_id = +v.base_unit_id;
          obj.primary_unit_name = v.base_unit_name;
          obj.expire_num_days = +v.expire_num_days;
          // obj.lot_id = v.lot_id;
          obj.lot_no = v.lot_no ? v.lot_no.toUpperCase() : null;
          obj.lot_no_old = v.lot_no ? v.lot_no.toUpperCase() : null;
          obj.conversion_qty_old = v.conversion_qty;
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
          obj.expired_date_old = moment(v.expired_date).isValid() ? moment(v.expired_date).format('DD/MM/YYYY') : null;
          obj.cost = v.cost;
          obj.cost_old = v.cost;
          obj.discount = v.discount;
          // ของแถม
          obj.is_free = v.is_free;
          obj.is_lot_control = v.is_lot_control;
          console.log(v);

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

  editChangeDiscount(idx, discount) {
    this.products[idx].discount = +discount;
  }

}
