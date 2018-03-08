import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { AbcVenService } from '../abc-ven.service';
import { AlertService } from '../../alert.service';

import * as _ from 'lodash';

@Component({
  selector: 'wm-abc-ven',
  templateUrl: './abc-ven.component.html',
  styleUrls: ['./abc-ven.component.css']
})
export class AbcVenComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;

  allProducts: Array<any> = [];
  selectedProducts: Array<any> = [];
  selectedProductIds: Array<any> = [];
  venList: Array<any> = [];
  abcList: Array<any> = [];
  openAbcVen = false;
  abcId: any;
  venId: any;
  isAll = true;

  constructor(
    private abcVenService: AbcVenService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.getProducts();
    // this.getAbcList();
    this.getVenList();
  }

  getVenList() {
    this.modalLoading.show();
    this.abcVenService.getVenList()
      .then((result: any) => {
        if (result.ok) {
          this.venList = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  getAbcList() {
    this.modalLoading.show();
    this.abcVenService.getAbcList()
      .then((result: any) => {
        if (result.ok) {
          this.abcList = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  getProducts() {
    this.modalLoading.show();
    this.isAll = true;
    this.abcVenService.getProducts()
      .then((result: any) => {
        if (result.ok) {
          this.allProducts = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  getProductsUnset() {
    this.isAll = false;
    this.modalLoading.show();
    this.abcVenService.getProductsUnset()
      .then((result: any) => {
        if (result.ok) {
          this.allProducts = result.rows;
        } else {
          this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  setAbcVen() {
    this.abcId = null;
    this.venId = null;
    try {
      // clear old data
      this.selectedProductIds = [];
      this.selectedProducts.forEach((v: any) => {
        this.selectedProductIds.push(v.generic_id);
      });
      this.openAbcVen = true;
    } catch (error) {
      this.alertService.error();
    }
  }

  saveAbcVen() {
    if (this.selectedProductIds.length && this.venId) {
      this.modalLoading.show();
      this.abcVenService.saveProductAbcVen(this.selectedProductIds, this.venId)
        .then((result: any) => {
          if (result.ok) {
            this.alertService.success();
          } else {
            this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(result.error));
          }
          this.modalLoading.hide();
          this.openAbcVen = false;
          this.getProducts();
        })
        .catch(() => {
          this.modalLoading.hide();
          this.alertService.serverError();
        });
    } else {
      this.alertService.error('กรุณาระบุข้อมูลให้ครบถ้วน');
    }
  }

  async processingAbc() {
    this.modalLoading.show();
    try {
      const rs: any = await this.abcVenService.processingAbc();
      if (rs.ok) {
        this.getProducts();
      } else {
        this.alertService.error('เกิดข้อผิดพลาด : ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error();
    }
  }
}
