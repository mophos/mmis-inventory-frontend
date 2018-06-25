import { AlertExpiredService } from './../alert-expired.service';
import { Router } from '@angular/router';
import { TransferService } from './../transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { HisTransactionService } from 'app/staff/his-transaction.service';
import { PeriodService } from './../period.service';

@Component({
  selector: 'wm-transfer-new',
  templateUrl: './transfer-new.component.html'
})
export class TransferNewComponent implements OnInit {

  jwtHelper: JwtHelper = new JwtHelper();

  lots = [];
  generics = [];
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
  genericName: any = null;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  openUpload = false;
  filePath: string;
  fileName: any = null;
  file: any;

  // @ViewChild('lotList') public lotList;
  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;
  @ViewChild('locationList') locationList;
  @ViewChild('dstWarehouse') dstWarehouse;
  @ViewChild('modalLoading') public modalLoading: any;

  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericId: any;
  unitGenericId: any;
  lotNo: any;
  dstWarehouses = [];
  templates = [];
  templateId: any;
  constructor(
    private alertService: AlertService,
    private transferService: TransferService,
    private alertExpireService: AlertExpiredService,
    private router: Router,
    private zone: NgZone,
    private wareHouseService: WarehouseService,
    private hisTransactionService: HisTransactionService,
    private periodService: PeriodService

  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    this.srcWarehouseId = decoded.warehouseId;
  }

  ngOnInit() {
    const date = new Date();
    this.transferDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    }

    this.getShipingNetwork();
  }

  onEditChangeLots(event: any, idx: any) {
    console.log(event);
    this.generics[idx].lot_no = event.lot_no;
    this.generics[idx].expired_date = event.expired_date;
    this.generics[idx].unit_generic_id = event.unit_generic_id;
    this.generics[idx].remain_qty = event.qty;
    this.generics[idx].conversion_qty = event.conversion_qty;
  }

  async getShipingNetwork() {
    this.modalLoading.show();
    try {
      const rs: any = await this.wareHouseService.getShipingNetwork(this.srcWarehouseId, 'TRN');
      this.modalLoading.hide();
      if (rs.ok) {
        this.dstWarehouses = rs.rows;
        this.getTemplates();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  setSelectedProduct(event: any) {
    try {
      if (this.srcWarehouseId) {
        this.productId = event ? event.product_id : null;
        this.productName = event ? event.product_name : null;
        this.genericName = event ? event.generic_name : null;
        this.genericId = event ? event.generic_id : null;
        this.workingCode = event ? event.working_code : null;
        this.remainQty = event ? event.qty - event.reserve_qty : null;
        this.primaryUnitId = event ? event.primary_unit_id : null;
        this.primaryUnitName = event ? event.primary_unit_name : null;
        // this.wmProductId = event ? event.wm_product_id : null;
        this.unitList.setGenericId(this.genericId);
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
        console.log(this.lots[idx]);

        this.expiredDate = this.lots[idx].expired_date;
        this.remainQty = this.lots[idx].qty;
        this.lotNo = this.lots[idx].lot_no;
        this.wmProductId = this.lots[idx].wm_product_id;
        // this.getProductRemain();
      }
    } catch (error) {
      //
    }
  }

  async getLots() {
    try {
      const rs = await this.transferService.getLots(this.productId, this.srcWarehouseId);
      if (rs.ok) {
        this.lots = rs.rows;
      } else {
        this.alertService.error('ไม่สามารถแสดงข้อมูล lot ได้');
      }
    } catch (error) {
      console.error(error);
    }
  }

  clearProductSearch() {
    this.productId = null;
  }

  changeLocation(event: any) {
    this.locationId = event.location_id;
  }

  editChangeLocation(event: any, idx: any) {
    this.generics[idx].location_id = event.location_id;
  }

  async setDstWarehouse(event: any, cmp: any) {
    if (this.srcWarehouseId === this.dstWarehouseId) {
      this.alertService.error('ไม่สามารถโอนรายการที่คลังต้นทางกับปลายทางเป็นคลังเดียวกันได้');
      this.dstWarehouseId = null;
      cmp.value = null;
    } else {
      this.locations = [];
      this.locationId = null;
      this.locationList.getLocations(this.dstWarehouseId);
    }
  }

  async addGeneric() {
    if (this.transferQty) {
      const idx = _.findIndex(this.generics, { generic_id: this.genericId });
      if (idx === -1) {
        if (this.genericId && this.transferQty && this.unitGenericId) {
          const obj = {
            working_code: this.workingCode,
            generic_name: this.genericName,
            generic_id: this.genericId,
            transfer_qty: +this.transferQty,
            remain_qty: +this.remainQty,
            unit_generic_id: this.unitGenericId,
            conversion_qty: this.conversionQty,
            primary_unit_id: this.primaryUnitId,
            location_id: this.locationId
          };
          this.generics.push(obj);
          await this.getProductList(this.genericId, (this.transferQty * this.conversionQty));
          this.clearForm();
        } else {
          this.alertService.error('ข้อมูลไม่ครบถ้วน')
        }
      } else {
        this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม');
      }
    } else {
      this.alertService.error('กรุณาระบุจำนวนที่ต้องการโอน')
    }
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
    this.unitList.clearUnits();
  }

  editChangetransferQty(idx: any, qty: any) {
    const oldQty = +this.generics[idx].transfer_qty;
    if ((+qty.value * this.generics[idx].conversion_qty) > +this.generics[idx].remain_qty) {
      this.alertService.error('จำนวนโอน มากว่าจำนวนคงเหลือ');
      qty.value = oldQty;
    } else {
      this.generics[idx].transfer_qty = +qty.value;
      const genericId = this.generics[idx].generic_id;
      const transferQty = this.generics[idx].transfer_qty * this.generics[idx].conversion_qty;
      this.getProductList(genericId, transferQty);
    }
  }

  changeProductQty(genericId, event) {
    const totalBaseUnit = _.sumBy(event, 'product_qty');

    const idx = _.findIndex(this.generics, ['generic_id', genericId]);
    this.generics[idx].products = event;
    this.generics[idx].transfer_qty = Math.floor(totalBaseUnit / this.generics[idx].conversion_qty);
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
    const transferDate = `${this.transferDate.date.year}-${this.transferDate.date.month}-${this.transferDate.date.day}`;
    const rs = await this.periodService.getStatus(transferDate);
    if (rs.rows[0].status_close === 'Y') {
      this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถโอนได้')
    } else {
      if (this.generics.length && this.srcWarehouseId && this.dstWarehouseId && this.transferDate) {
        const generics = [];

        _.forEach(this.generics, v => {
          if (v.generic_id && v.transfer_qty) {
            generics.push({
              generic_id: v.generic_id,
              transfer_qty: +v.transfer_qty,
              unit_generic_id: v.unit_generic_id,
              conversion_qty: +v.conversion_qty,
              primary_unit_id: v.primary_unit_id,
              location_id: v.location_id,
              products: v.products
            });

          }
        });

        const summary = {
          transferDate: `${this.transferDate.date.year}-${this.transferDate.date.month}-${this.transferDate.date.day}`,
          srcWarehouseId: this.srcWarehouseId,
          dstWarehouseId: this.dstWarehouseId
        };

        // check transfer qty
        let isError = false;
        this.generics.forEach(v => {
          if (+v.transfer_qty * v.conversion_qty > v.remain_qty || +v.transfer_qty <= 0) {
            isError = true;
          }
        });

        if (isError) {
          this.alertService.error('มีบางรายการที่ยอดโอน มากกว่ายอดคงเหลือ หรือ เท่ากับ 0');
        } else {

          if (generics.length) {
            this.alertService.confirm('ต้องการโอนรายการสินค้า ใช่หรือไม่?')
              .then(async () => {
                this.modalLoading.show();
                try {
                  const result: any = await this.transferService.saveTransfer(summary, generics);
                  this.modalLoading.hide();
                  if (result.ok) {
                    this.alertService.success();
                    this.router.navigate(['/staff/transfer']);
                  } else {
                    this.alertService.error(JSON.stringify(result.error));
                  }
                } catch (error) {
                  this.modalLoading.hide();
                  this.alertService.error(JSON.stringify(error));
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
  }

  showUploadModal() {
    this.openUpload = true;
  }

  fileChangeEvent(fileInput: any) {
    this.file = <Array<File>>fileInput.target.files;
    this.fileName = this.file[0].name;
  }

  async doUpload() {
    try {
      this.modalLoading.show();
      this.hisTransactionService.uploadTransaction(this.file[0])
        .then((result: any) => {
          if (result.ok) {
            this.openUpload = false;
            // add product
            this.generics = [];
            result.rows.forEach(v => {
              const obj = {
                // product_new_id: this.wmProductId,
                wm_product_id: v.wm_product_id,
                product_name: v.product_name,
                generic_id: v.generic_id,
                lot_no: null,
                expired_date: null,
                transfer_qty: +v.qty,
                remain_qty: 0,
                unit_generic_id: null,
                conversion_qty: 0,
                location_id: null
              };

              this.generics.push(obj);
            });

          } else {
            this.alertService.error(JSON.stringify(result.error));
          }
          this.modalLoading.hide();
        }, (error) => {
          this.modalLoading.hide();
          this.alertService.error(JSON.stringify(error));
        });
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
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
      const dstWarehouseId = this.dstWarehouseId;
      const srcWarehouseId = this.srcWarehouseId;
      console.log(dstWarehouseId);
      console.log(srcWarehouseId);

      if (dstWarehouseId && srcWarehouseId) {
        const rs: any = await this.transferService.getTemplates(srcWarehouseId, dstWarehouseId);
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

  async getTemplateItems(templateId: any) {
    try {
      console.log(templateId)
      const rs: any = await this.transferService.getTemplateItems(templateId);
      if (rs.ok) {
        this.generics = [];

        rs.rows.forEach(v => {
          console.log(v);

          const generic: any = {};
          generic.generic_id = v.generic_id;
          generic.transfer_qty = 0;
          generic.generic_name = v.generic_name;
          generic.to_unit_qty = 0;
          generic.unit_generic_id = v.unit_generic_id;
          generic.from_unit_name = v.from_unit_name;
          generic.to_unit_name = v.to_unit_name;
          generic.product_qty = v.product_qty;
          generic.working_code = v.working_code;
          generic.remain_qty = v.remain_qty;
          generic.small_remain_qty = v.small_remain_qty

          this.generics.push(generic);
        });
        console.log(this.generics)
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }
}
