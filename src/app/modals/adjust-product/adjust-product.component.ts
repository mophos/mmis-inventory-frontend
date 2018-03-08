import { WarehouseService } from './../../admin/warehouse.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { AlertService } from './../../alert.service';
import { Component, OnInit, Input, Output, ChangeDetectorRef, EventEmitter, ViewChild } from '@angular/core';

import * as _ from 'lodash';

@Component({
  selector: 'wm-adjust-product-modal',
  templateUrl: './adjust-product.component.html',
  styleUrls: ['./adjust-product.component.css']
})
export class AdjustProductModalComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @Input('openModalAdjust') openModalAdjust = false;
  @Output("onSuccess") onSuccess = new EventEmitter<number>();
  @Output("onCancel") onCancel = new EventEmitter<number>();
  // @Input('adjQty') adjQty: number;
  @Input('isCounting') isCounting: boolean;
  adjQty: number = 0;
  isBaseCount = true;
  checkBase = true;
  checkPackage = false;
  productId: any;
  adjProductNewId: any;
  adjProductName: any;
  adjProductId: any;
  adjLot: any;
  adjExpiredDate: any;
  // adjSmallUnit: any;
  baseUnitName: any;
  conversion: any;
  largeUnit: any;
  packageUnit: any;
  oldQty: any;
  adjReason: any;

  totalSmallQty = 0;

  logs = [];

  adjQtyPackage: any;
  adjQtyBase: any;

  constructor(
    private alertService: AlertService,
    private toThaiDate: ToThaiDatePipe,
    private warehouseService: WarehouseService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.isBaseCount = true;
  }

  countSmallQty(event: any) {
    if (this.checkBase) {
      this.totalSmallQty = this.adjQtyBase;
    }
  }
  countLargeQty(event: any) {
    if (this.checkPackage) {
      this.totalSmallQty = this.adjQtyPackage * this.conversion;
    }
  }

  chageBaseUnit(event: any) {
    this.countSmallQty(null);
  }

  getProductDetail(productNewId: any, adjQty: number) {
    this.modalLoading.show();
    this.adjProductNewId = productNewId;
    this.warehouseService.getProductsDetail(productNewId)
      .then((result: any) => {
        if (result.ok) {
          const data = result.rows;
          this.oldQty = data.qty;
          this.conversion = data.conversion;
          this.adjProductName = data.product_name;
          this.adjProductId = data.product_id;
          this.adjLot = data.lot_no;
          this.adjExpiredDate = this.toThaiDate.transform(data.expired_date);
          // this.adjSmallUnit = `${data.small_qty} x ${data.small_unit}`;
          this.baseUnitName = `${data.base_unit_name}`;
          this.largeUnit = data.large_unit + ' (' + data.conversion + ' x ' + data.base_unit_name + ')';
          this.packageUnit = data.large_unit;
          this.adjQty = adjQty || data.qty;
          this.adjQtyBase = adjQty || data.qty;
          // this.adjQtyPackage = adjQty || data.qty;
          this.adjReason = null;
          this.isBaseCount = true;
          this.countSmallQty(null);
          this.getAdjLogs(productNewId);

        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(error => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  getAdjLogs(productNewId: string) {
    this.modalLoading.show();
    this.logs = [];
    this.warehouseService.getAdjLogs(productNewId)
      .then((result: any) => {
        if (result.ok) {
          this.logs = result.rows;
          this.logs.forEach(v => {
            v.new_qty = (v.new_qty / v.conversion).toFixed(0) + ' (' + v.large_unit + ' x ' + v.conversion + v.small_unit + ')';
            v.old_qty = (v.old_qty / v.conversion).toFixed(0) + ' (' + v.large_unit + ' x ' + v.conversion + v.small_unit + ')';
          })

          this.ref.detectChanges();
        } else {
          this.alertService.error('ไม่สามารถดู Logs ได้');
        }
        this.modalLoading.hide();
      })
      .catch(error => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  saveAdjQty() {
    if (this.adjProductNewId && this.adjProductId && this.adjProductName && this.totalSmallQty && this.adjReason) {
      if (this.totalSmallQty < 0) {
        this.alertService.error('กรุณาระบุยอดคงเหลือมากกว่า 0');
      } else {
        this.modalLoading.show();
        const oldQty = this.oldQty;
        const newQty = this.totalSmallQty;

        this.warehouseService.saveAdjQty(this.adjProductNewId, newQty, oldQty, this.adjReason)
          .then((result: any) => {
            if (result.ok) {
              this.alertService.success();
              this.getAdjLogs(this.adjProductNewId);
              this.onSuccess.emit(this.totalSmallQty);
            } else {
              this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
            }
            this.modalLoading.hide();
          });
      }
    } else {
      this.alertService.error('กรุณาระบุรายละเอียดให้ครบถ้วน');
    }
    this.adjQtyBase = '';
    this.adjQtyPackage = '';
    this.checkBase = true;
    this.checkPackage = false;

  }

  closeModal() {
    this.onSuccess.emit(null);
  }
  chageCheck(e) {
    console.log(e.target.id, e.target.checked);
    if (e.target.id === 'checkBase') {
      this.adjQtyBase = Math.floor(this.adjQtyPackage * this.conversion);
      this.adjQtyPackage = '';
      this.checkBase = true;
      this.checkPackage = false;
    } else {
      console.log(this.adjQtyBase, this.conversion);
      this.adjQtyPackage = Math.floor(this.adjQtyBase / this.conversion);
      this.adjQtyBase = '';
      this.checkBase = false;
      this.checkPackage = true;
    }
    this.totalSmallQty = Math.floor(this.adjQtyPackage * this.conversion);
    // if (this.checkBase) {
    //   this.checkBase = !this.checkBase;
    // } else if (this.checkPackage) {
    //   this.checkPackage = !this.checkPackage;
    // }
  }

}
