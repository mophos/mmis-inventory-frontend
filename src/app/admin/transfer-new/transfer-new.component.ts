import { AlertExpiredService } from './../alert-expired.service';
import { Router } from '@angular/router';
import { TransferService } from './../transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { ProductsService } from './../products.service';
import { PeriodService } from './../../period.service';

import * as _ from 'lodash';
import * as moment from 'moment';
import { DateService } from 'app/date.service';
import { RequisitionService } from '../requisition.service';
import { IGeneric, IUnit, IRequisitionOrderItem, IRequisitionOrder } from 'app/shared';

@Component({
  selector: 'wm-transfer-new',
  templateUrl: './transfer-new.component.html',
  styleUrls: []
})
export class TransferNewComponent implements OnInit {
  lots = [];
  generics = [];
  loading = false;
  locations: any = [];
  locationId: any;

  srcWarehouseId: string;
  dstWarehouseId: string;
  transferDate: any;

  // selectedProductId: any;
  selectedProduct: any;
  selectedLot: any;
  selectedUnit: any;
  // selectedLotId: any;
  expiredDate: any;
  remainQty = 0;
  conversionQty = 0;
  transferQty = 0;
  wmProductId: any;
  workingCode: any;
  isSaving = false;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  // @ViewChild('lotList') public lotList;
  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;
  @ViewChild('locationList') locationList;
  @ViewChild('modalLoading') private modalLoading;

  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericName: any;
  genericId: any;
  unitGenericId: any;
  lotNo: any;

  isSave = false;
  templateId: any;
  templates: any;

  constructor(
    private productService: ProductsService,
    private alertService: AlertService,
    private transferService: TransferService,
    private alertExpireService: AlertExpiredService,
    private router: Router,
    private zone: NgZone,
    private dateService: DateService,
    private periodService: PeriodService,
    private requisitionService: RequisitionService,

  ) { }

  ngOnInit() {
    const date = new Date();
    this.transferDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }
  }

  setSelectedProduct(event: any) {
    console.log(event);
    
    try {
      if (this.srcWarehouseId) {
        this.productId = event ? event.product_id : null;
        this.productName = event ? event.product_name : null;
        this.genericName = event ? event.generic_name : null;
        this.genericId = event ? event.generic_id : null;
        this.workingCode = event ? event.working_code : null;
        this.remainQty = event ? event.qty - event.reserve_qty : null;
        this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
        this.primaryUnitId = event ? event.primary_unit_id : null;
        this.primaryUnitName = event ? event.primary_unit_name : null;
        // this.wmProductId = event ? event.wm_product_id : null;
        // this.unitList.setGenericId(this.genericId);
        // this.getLots();
      } else {
        this.alertService.error('กรุณาเลือกคลังสินค้าต้นทาง และ ปลายทาง');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  changeUnit(event: any) {
    try {
      this.conversionQty = event.qty ? event.qty : 0;
      this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
    } catch (error) {
      //
    }
  }

  changeLots(event: any) {
    try {
      const idx = _.findIndex(this.lots, { lot_no: this.lotNo });
      if (idx > -1) {
        this.expiredDate = this.lots[idx].expired_date;
        this.remainQty = this.lots[idx].qty;
        this.wmProductId = this.lots[idx].wm_product_id;
        this.lotNo = this.lots[idx].lot_no;
      }
    } catch (error) {
      this.alertService.error(error);
    }
  }

  async getLots() {
    try {
      const rs = await this.transferService.getLots(this.productId, this.srcWarehouseId);
      this.lots = rs.rows;
    } catch (error) {
      console.error(error);
    }
  }

  clearProductSearch(event) {
    if (event) {
      this.clearForm();
    }
  }

  setSrcWarehouse(event) {
    if (this.generics.length) {
      this.alertService.confirm('ต้องการยกเลิกรายการที่เลือกไว้แล้ว ใช่หรือไม่?')
        .then(() => {
          this.srcWarehouseId = event.warehouse_id;
          this.generics = [];
        }).catch(() => { });
    } else {
      this.srcWarehouseId = event.warehouse_id;
    }
  }

  changeLocation(event: any) {
    this.locationId = event.location_id;
  }

  editChangeLocation(event: any, idx: any) {
    this.generics[idx].location_id = event.location_id;
  }

  async setDstWarehouse(event: any) {
    this.dstWarehouseId = event.warehouse_id;
    this.locations = [];
    this.locationId = null;
    this.locationList.getLocations(this.dstWarehouseId);
    this.getTemplates()
  }

  

  clearForm() {
    this.workingCode = null;
    this.productName = null;
    this.genericName = null;
    this.genericId = null;
    this.unitGenericId = null;
    this.wmProductId = null;
    this.productId = null;
    this.selectedProduct = {};
    this.selectedLot = {};
    this.selectedUnit = {};
    this.remainQty = 0;
    this.transferQty = 0;
    this.expiredDate = null;
    this.productSearch.clearProductSearch();
    this.lotNo = null;
    this.locationId = null;
    this.lots = [];
    // this.unitList.clearUnits();
  }

  editChangetransferQty(idx: any, qty: any) {
    const oldQty = +this.generics[idx].transfer_qty;
    if ((+qty.value * this.generics[idx].conversion_qty) > +this.generics[idx].remain_qty) {
      this.alertService.error('จำนวนที่โอน มากกว่าจำนวนคงเหลือ');
      qty.value = oldQty;
    } else {
      this.generics[idx].transfer_qty = +qty.value;
      const genericId = this.generics[idx].generic_id;
      const transferQty = this.generics[idx].transfer_qty * this.generics[idx].conversion_qty;
      this.generics[idx].transfer_qty = transferQty;
      this.getProductList(genericId, transferQty);
    }
  }

  changeProductQty(genericId, event) {
    const idx = _.findIndex(this.generics, ['generic_id', genericId]);
    this.generics[idx].products = event;
    this.generics[idx].transfer_qty = _.sumBy(event, function (e: any) {
      return e.product_qty * e.conversion_qty;
    });
  }

  editChangeUnit(idx: any, event: any, unitCmp: any) {
    this.generics[idx].unit_generic_id = event.unit_generic_id;
    this.generics[idx].conversion_qty = event.qty;
    if (this.generics[idx].remain_qty < (this.generics[idx].transfer_qty * event.qty)) {
      this.alertService.error('รายการไม่พอโอน');
      this.generics[idx].products = [];
    } else {
      const genericId = this.generics[idx].generic_id;
      const transferQty = this.generics[idx].transfer_qty * this.generics[idx].conversion_qty;
      this.generics[idx].transfer_qty = transferQty;
      this.getProductList(genericId, transferQty);
    }
  }

  removeProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.generics.splice(idx, 1);
      }).catch(() => { });
  }

  async saveTransfer() {
    this.isSave = true;
    if (this.generics.length && this.srcWarehouseId && this.dstWarehouseId && this.transferDate) {
      const transferDate = `${this.transferDate.date.year}-${this.transferDate.date.month}-${this.transferDate.date.day}`;
      const rs = await this.periodService.getStatus(transferDate);
      if (rs.rows[0].status_close === 'Y') {
        this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถโอนได้')
      } else {
        const generics = [];
        let isError = false;

        _.forEach(this.generics, v => {
          if (v.generic_id && v.transfer_qty) {
            generics.push({
              generic_id: v.generic_id,
              transfer_qty: +v.transfer_qty,
              unit_generic_id: v.unit_generic_id,
              primary_unit_id: v.primary_unit_id,
              location_id: v.location_id,
              products: v.products
            });
          } else {
            isError = false;
          }
        });

        if (isError) {
          this.alertService.error('ข้อมูลไม่ครบถ้วนหรือไม่สมบูรณ์ เช่น จำนวนโอน');
        } else {

          const summary = {
            transferDate: `${this.transferDate.date.year}-${this.transferDate.date.month}-${this.transferDate.date.day}`,
            srcWarehouseId: this.srcWarehouseId,
            dstWarehouseId: this.dstWarehouseId
          };

          if (generics.length) {
            this.alertService.confirm('ต้องการโอนรายการสินค้า ใช่หรือไม่?')
              .then(async () => {
                this.modalLoading.show();
                try {
                  const rsT: any = await this.transferService.saveTransfer(summary, generics);
                  if (rsT.ok) {
                    this.alertService.success();
                    this.router.navigate(['/admin/transfer']);
                  } else {
                    this.alertService.error(JSON.stringify(rsT.error));
                  }
                  this.modalLoading.hide();
                } catch (error) {
                  this.modalLoading.hide();
                }
              })
              .catch(() => {
                this.modalLoading.hide();
              });
          } else {
            this.alertService.error('ไม่พบรายการที่ต้องการโอน');
          }
        }

      }
    }
    this.isSave = false;
  }

  async getProductList(genericId, qty) {
    try {
      this.modalLoading.show();
      const data = [{
        genericId: genericId,
        genericQty: qty
      }];
      const srcWarehouseId = this.srcWarehouseId;
      const rs: any = await this.transferService.allocate(data, srcWarehouseId);
      if (rs.ok) {
        const idx = _.findIndex(this.generics, { generic_id: genericId });
        if (idx > -1) {
          this.generics[idx].products = rs.rows;
        }
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      console.log(error);
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
  async getTemplates() {
    try {
      const dstWarehouseId = this.srcWarehouseId;
      const srcWarehouseId = this.dstWarehouseId;

      if (dstWarehouseId && srcWarehouseId) {
        const rs: any = await this.requisitionService.getTemplates(srcWarehouseId, dstWarehouseId);
console.log(rs);

        if (rs.ok) {
          this.templates = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
  async getGenericItems(event: any) {
    if (this.templateId) {
      this.getTemplateItems(this.templateId);
    }
  }
  async addGeneric() {
    // if (this.transferQty) {
    const idx = _.findIndex(this.generics, { generic_id: this.genericId });

    if (idx === -1) {
      if (this.genericId) {
        const obj = {
          working_code: this.workingCode,
          generic_name: this.genericName,
          generic_id: this.genericId,
          transfer_qty: +this.transferQty,
          remain_qty: +this.remainQty,
          unit_generic_id: this.unitGenericId,
          conversion_qty: this.conversionQty,
          location_id: this.locationId,
          primary_unit_id: this.primaryUnitId,
          primary_unit_name: this.primaryUnitName
        };

        this.generics.push(obj);
        await this.getProductList(this.genericId, this.transferQty);
        this.clearForm();
      } else {
        this.alertService.error('ข้อมูลไม่ครบถ้วน')
      }

    } else {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม');
    }
  }
  async getTemplateItems(templateId: any) {
    try {
      const rs: any = await this.transferService.getTemplateItems(templateId);
      console.log(rs.rows);
      
      if (rs.ok) {
        this.generics = [];
      for (const v of rs.rows) {
          const product:any = {};
          product.generic_id = v.generic_id || null;
          product.generic_name = v.generic_name || null;
          product.primary_unit_id = v.primary_unit_id || null;
          product.unit_generic_id = v.unit_generic_id || null;
          product.primary_unit_name = v.primary_unit_name || null;
          product.conversion_qty = this.conversionQty || null;
          product.working_code = v.working_code || null;//
          product.remain_qty = +v.qty - +v.reserve_qty || null ; //
          product.transfer_qty = 0;
          this.generics.push(product);
          await this.getProductList(product.generic_id, this.transferQty);
        this.clearForm();
        }
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
}
