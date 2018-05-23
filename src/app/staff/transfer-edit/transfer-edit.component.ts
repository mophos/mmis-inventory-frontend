import { AlertExpiredService } from './../alert-expired.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TransferService } from './../transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../alert.service';
import { WarehouseService } from './../warehouse.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-transfer-edit',
  templateUrl: './transfer-edit.component.html',
  styles: []
})
export class TransferEditComponent implements OnInit {

  @ViewChild('locationList') locationList;
  @ViewChild('modalLoading') public modalLoading: any;

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
  disableSave = false;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  // @ViewChild('lotList') public lotList;
  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;

  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericId: any;
  genericName: any;
  unitGenericId: any;
  lotNo: any;

  transferId: any;

  constructor(
    private alertService: AlertService,
    private transferService: TransferService,
    private alertExpireService: AlertExpiredService,
    private router: Router,
    private zone: NgZone,
    private route: ActivatedRoute
  ) {
    this.route.queryParams
      .subscribe(params => {
        this.transferId = params.transferId;
      });
  }

  async ngOnInit() {
    const date = new Date();
    await this.getSummaryInfo();
    await this.getDetailInfo();
  }

  async getSummaryInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.transferService.getSummaryInfo(this.transferId);
      if (rs.ok) {
        if (rs.info.transfer_date) {
          this.transferDate = {
            date: {
              year: moment(rs.info.transfer_date).get('year'),
              month: moment(rs.info.transfer_date).get('month') + 1,
              day: moment(rs.info.transfer_date).get('date')
            }
          }
        }

        this.srcWarehouseId = rs.info.src_warehouse_id;
        this.dstWarehouseId = rs.info.dst_warehouse_id;

        if (rs.info.confirmed === 'Y' || rs.info.approved === 'Y' || rs.info.mark_deleted === 'Y') {
          this.disableSave = true;
        }

      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.error(error);
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
        this.unitList.setGenericId(this.genericId);
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
        this.wmProductId = this.lots[idx].wm_product_id;
        this.lotNo = this.lots[idx].lot_no;
        // this.getProductRemain();
      }
    } catch (error) {
      //
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

  clearProductSearch() {
    this.productId = null;
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
  }

  async getDetailInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.transferService.getDetailInfo(this.transferId);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
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

          console.log(obj);

          this.generics.push(obj);
          await this.getProductList(this.genericId, (this.transferQty * this.conversionQty));
          this.clearForm();
        } else {
          this.alertService.error('ข้อมูลไม่ครบถ้วน เช่น จำนวนโอน');
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
    if (+this.generics[idx].unit_generic_id === +event.unit_generic_id) {
      this.generics[idx].conversion_qty = event.qty;
    } else {
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
  }

  removeProduct(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.generics.splice(idx, 1);
      }).catch(() => { });
  }

  saveTransfer() {
    if (this.generics.length && this.srcWarehouseId && this.dstWarehouseId && this.transferDate) {
      const generics = [];
      let isError = false;
      _.forEach(this.generics, v => {
        if (v.generic_id && v.transfer_qty) {
          generics.push({
            generic_id: v.generic_id,
            transfer_qty: +v.transfer_qty,
            unit_generic_id: v.unit_generic_id,
            conversion_qty: +v.conversion_qty,
            location_id: v.location_id,
            primary_unit_id: v.primary_unit_id,
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
          dstWarehouseId: this.dstWarehouseId
        };

        if (generics.length) {
          this.modalLoading.show();
          this.alertService.confirm('ต้องการโอนรายการสินค้า ใช่หรือไม่?')
            .then(() => {
              this.transferService.updateTransfer(this.transferId, summary, generics)
                .then((result: any) => {
                  if (result.ok) {
                    this.alertService.success();
                    this.router.navigate(['/staff/transfer']);
                  } else {
                    this.alertService.error(JSON.stringify(result.error));
                  }
                  this.modalLoading.hide();
                })
                .catch(error => {
                  this.modalLoading.hide();
                  this.alertService.error(error.message);
                });
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

}
