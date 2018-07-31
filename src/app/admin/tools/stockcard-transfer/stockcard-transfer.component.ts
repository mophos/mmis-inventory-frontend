import { ToolsService } from './../../tools.service';

import { Router, ActivatedRoute } from '@angular/router';
import { TransferService } from 'app/admin/transfer.service';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from 'app/alert.service';
import { Component, OnInit, ViewChild, NgZone } from '@angular/core';


import * as _ from 'lodash';
import * as moment from 'moment';
import { DateService } from 'app/date.service';
import { PeriodService } from '../../../period.service';
@Component({
  selector: 'wm-stockcard-transfer',
  templateUrl: './stockcard-transfer.component.html',
  styles: []
})
export class StockcardTransferComponent implements OnInit {
  @ViewChild('locationList') locationList;
  @ViewChild('modalLoading') private modalLoading;

  lots = [];
  generics = [];
  loading = false;
  isLoading = false;
  locations: any = [];
  // locationId: any;

  srcWarehouseId: string;
  dstWarehouseId: string;
  transferDate: any;

  selectedProduct: any;
  selectedLot: any;
  selectedUnit: any;

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

  @ViewChild('unitList') public unitList;
  @ViewChild('productSearch') public productSearch;

  primaryUnitName: any;
  primaryUnitId: any;
  productId: any;
  productName: any;
  genericName: any;
  genericId: any;
  unitGenericId: any;
  lotNo: any;

  transferId: any;

  checkEnterPass = true;
  password: any;
  passwordModal = false;
  constructor(
    private alertService: AlertService,
    private transferService: TransferService,
    private router: Router,
    private route: ActivatedRoute,
    private toolsService: ToolsService,
    private periodService: PeriodService
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
      } else {
        this.alertService.error('กรุณาเลือกคลังสินค้าต้นทาง และ ปลายทาง');
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  // changeUnit(event: any) {
  //   try {
  //     this.conversionQty = event.qty ? event.qty : 0;
  //     this.unitGenericId = event.unit_generic_id ? event.unit_generic_id : null;
  //   } catch (error) {
  //     //
  //   }
  // }

  // changeLots(event: any) {
  //   try {
  //     const idx = _.findIndex(this.lots, { lot_no: this.lotNo });
  //     if (idx > -1) {
  //       this.expiredDate = this.lots[idx].expired_date;
  //       this.remainQty = this.lots[idx].qty;
  //       this.wmProductId = this.lots[idx].wm_product_id;
  //     }
  //   } catch (error) {
  //     //
  //   }
  // }

  async getLots() {
    try {
      const rs = await this.transferService.getLots(this.productId, this.srcWarehouseId);
      this.lots = rs.rows;
    } catch (error) {
      console.error(error);
    }
  }

  // clearProductSearch(event: any) {
  //   if (event) {
  //     this.clearForm();
  //   }
  // }

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

  // changeLocation(event: any) {
  //   this.locationId = event.location_id;
  // }

  // editChangeLocation(event: any, idx: any) {
  //   this.generics[idx].location_id = event.location_id;
  // }

  async setDstWarehouse(event: any) {
    this.dstWarehouseId = event.warehouse_id;
    // this.locations = [];
    // this.locationId = null;
    // this.locationList.getLocations(this.dstWarehouseId);
  }

  async getDetailInfo() {
    try {
      this.modalLoading.show();
      const rs: any = await this.transferService.getDetailInfoEdit(this.transferId);
      if (rs.ok) {
        // this.generics = rs.rows;
        for (const v of rs.rows) {
          const products = [];
          for (const i of v.products) {
            const objpPoducts = {
              conversion_qty: i.conversion_qty,
              conversion_qty_old: i.conversion_qty,
              product_qty: i.product_qty,
              product_qty_old: i.product_qty,
              expired_date: i.expired_date,
              from_unit_name: i.from_unit_name,
              lot_no: i.lot_no,
              pack_remain_qty: i.pack_remain_qty,
              product_name: i.product_name,
              small_remain_qty: i.small_remain_qty,
              to_unit_name: i.to_unit_name,
              transfer_generic_id: i.transfer_generic_id,
              transfer_id: i.transfer_id,
              transfer_product_id: i.transfer_product_id,
              wm_product_id: i.wm_product_id,
              product_id: i.product_id
            }
            products.push(objpPoducts)
          }
          const obj = {
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            primary_unit_id: v.primary_unit_id,
            primary_unit_name: v.primary_unit_name,
            remain_qty: v.remain_qty,
            transfer_generic_id: v.transfer_generic_id,
            transfer_id: v.transfer_id,
            transfer_qty: v.transfer_qty,
            unit_generic_id: v.unit_generic_id,
            working_code: v.working_code,
            products: products
          }
          this.generics.push(obj);
        }
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

  // async addGeneric() {
  //   const idx = _.findIndex(this.generics, { generic_id: this.genericId });

  //   if (idx === -1) {
  //     if (this.genericId) {
  //       const obj = {
  //         working_code: this.workingCode,
  //         generic_name: this.genericName,
  //         generic_id: this.genericId,
  //         transfer_qty: +this.transferQty,
  //         remain_qty: +this.remainQty,
  //         unit_generic_id: this.unitGenericId,
  //         conversion_qty: this.conversionQty,
  //         location_id: this.locationId,
  //         primary_unit_id: this.primaryUnitId,
  //         primary_unit_name: this.primaryUnitName
  //       };

  //       this.generics.push(obj);
  //       await this.getProductList(this.genericId, (this.transferQty * this.conversionQty));
  //       this.clearForm();
  //     } else {
  //       this.alertService.error('ข้อมูลไม่ครบถ้วน')
  //     }

  //   } else {
  //     this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม');
  //   }
  // }

  // clearForm() {
  //   this.workingCode = null;
  //   this.productName = null;
  //   this.genericName = null;
  //   this.genericId = null;
  //   this.unitGenericId = null;
  //   this.wmProductId = null;
  //   this.productId = null;
  //   this.selectedProduct = {};
  //   this.selectedLot = {};
  //   this.selectedUnit = {};
  //   this.remainQty = 0;
  //   this.transferQty = 0;
  //   this.expiredDate = null;
  //   this.productSearch.clearProductSearch();
  //   this.lotNo = null;
  //   this.locationId = null;
  //   this.lots = [];
  // }

  editChangetransferQty(idx: any, qty: any) {
    const oldQty = +this.generics[idx].transfer_qty;
    if ((+qty.value * this.generics[idx].conversion_qty) > +this.generics[idx].remain_qty) {
      this.alertService.error('จำนวนโอน มากว่าจำนวนคงเหลือ');
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
        this.generics[idx].transfer_qty = transferQty;
        this.getProductList(genericId, transferQty);
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
          const _transferDate = this.transferDate ? `${this.transferDate.date.year}-${this.transferDate.date.month}-${this.transferDate.date.day}` : null;
          const rsP = await this.periodService.getStatus(_transferDate)
          if (rsP.rows[0].status_close === 'Y') {
            this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถแก้ไข stockcard ได้');
            this.isSaving = false;
          } else {
            const summary = {
              transfer_date: _transferDate,
              src_warehouse_id: this.srcWarehouseId,
              dst_warehouse_id: this.dstWarehouseId
            }
            const rs: any = await this.toolsService.saveTransfer(this.transferId, summary, this.generics);
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
        this.alertService.error('ยังไม่ได้ระบุรหัสผ่าน');
      }

    } catch (error) {
      this.alertService.error(error);
    }
  }

}

