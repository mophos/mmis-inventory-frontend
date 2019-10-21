import { StaffService } from './../staff.service';
import { SelectUnitsComponent } from 'app/directives/select-units/select-units.component';
import { SearchGenericAutocompleteAllComponent } from 'app/directives/search-generic-autocomplete-all/search-generic-autocomplete-all.component'
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import { AlertService } from "../../alert.service";

import { WarehouseService } from "../warehouse.service";


import { WarehouseProductsService } from '../warehouse-products.service';


import { JwtHelper } from 'angular2-jwt';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-requisition-template-new',
  templateUrl: './requisition-template-new.component.html'
})
export class RequisitionTemplateNewComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('goto') public goto: any;
  @ViewChild('genericSearch') public genericSearch: SearchGenericAutocompleteComponent;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteAllComponent;
  @ViewChild('genericId') public genericId: SelectUnitsComponent;
  isRequest = false;
  dstWarehouses = [];
  srcWarehouses = [];

  dstWarehouseId: any;
  srcWarehouseId: any;
  srcWarehouseName: any;
  products2 = [];
  templateSubject: any;

  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private warehouseProductService: WarehouseProductsService,
    private router: Router,
    private staffService: StaffService
  ) { }

  // ngOnInit() {
  //   // this.getWarehouses();
  //   this.token = sessionStorage.getItem('token');
  //   const decodedToken = this.jwtHelper.decodeToken(this.token);
  //   this.srcWarehouseId = decodedToken.warehouseId;
  //   this.getReqShipingNetwork();
  // }
  ngOnInit() {
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    this.srcWarehouseId = decodedToken.warehouseId;
    this.getWarehouses();
    this.getDstShipingNetwork();
  }
  async getWarehouses() {
    try {
      const resp: any = await this.warehouseService.getWarehouse();
      if (resp.ok) {
        this.srcWarehouses = resp.rows;
      } else {
        this.alertService.error(resp.error);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error(error.message);
    }
  }

  showProducts() {
    this.isRequest = true;
  }

  changeWarehouse() {
    this.isRequest = false;
    this.products2 = [];
  }
  setSelectedProduct(e) {
    if (typeof (e) === 'object') {
      const idx = _.findIndex(this.products2, { 'generic_id': e.generic_id });
      if (idx > -1) {
        this.alertService.error('มีรายการนี้อยู่แล้ว');
      } else {
        this.products2.push(e);
        // this.genericSearch.clearSearch();
        this.searchGenericCmp.clearSearch();
      }
    }
  }
  removeSelected(g) {
    const idx = _.findIndex(this.products2, { generic_id: g.generic_id });
    if (idx > -1) {
      this.products2.splice(idx, 1);
    }
  }
  productDown(g) {
    if (this.products2.length > 1) {
      const idx = _.findIndex(this.products2, { generic_id: g.generic_id });
      if (idx !== this.products2.length - 1) {
        const temp = this.products2[idx];
        this.products2[idx] = this.products2[idx + 1];
        this.products2[idx + 1] = temp;
      }
    }
  }
  productUp(g) {
    if (this.products2.length > 1) {
      const idx = _.findIndex(this.products2, { generic_id: g.generic_id });
      if (idx !== 0) {
        const temp = this.products2[idx];
        this.products2[idx] = this.products2[idx - 1];
        this.products2[idx - 1] = temp;
      }
    }
  }
  productGoTo(g, value) {
    let temps: any;
    if (this.products2.length > 1) {
      const idx = _.findIndex(this.products2, { generic_id: g.generic_id });
      if (value - 1 < idx) {
        temps = this.products2[idx];
        for (let i = idx; i > value - 1; i--) {
          this.products2[i] = this.products2[i - 1];
        }
        this.products2[value - 1] = temps;
      } else if (value - 1 > idx) {
        temps = this.products2[idx];
        for (let i = idx; i < value - 1; i++) {
          this.products2[i] = this.products2[i + 1];
        }
        this.products2[value - 1] = temps;
      }
    }
  }
  saveTemplate() {
    const templateSubject = this.templateSubject;
    const templateSummary = {
      dstWarehouseId: this.dstWarehouseId,
      srcWarehouseId: this.srcWarehouseId,
      templateSubject: templateSubject
    };
    if (templateSummary && this.products2) {
      this.modalLoading.show();
      this.warehouseProductService.saveWarehouseProductsTemplate(templateSummary, this.products2)
        .then((result: any) => {
          if (result.ok) {
            this.alertService.success();
            this.router.navigate(['/staff/templates/main']);
          } else {
            this.alertService.error(JSON.stringify(result.error));
          }

          this.modalLoading.hide();
        })
        .catch(error => {
          this.modalLoading.hide();
          this.alertService.serverError();
        });
    } else {
      this.alertService.error('ข้อมูลไม่ครบถ้วน')
    }
  }

  async getDstShipingNetwork() {
    this.dstWarehouses = [];
    await this.staffService.getWarehouseDst(this.srcWarehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.dstWarehouses = result.rows;
          this.dstWarehouseId = result.rows[0].warehouse_id;
        } else {
          this.alertService.error(result.error)
        }
      })
      .catch(() => {
        this.alertService.serverError();
      });
  }
  editChangeUnit(g, e) {
    const idx = _.findIndex(this.products2, { 'generic_id': g.generic_id })
    this.products2[idx].unit_generic_id = e.unit_generic_id
  }
  sort() {
    this.products2 = _.sortBy(this.products2, ['generic_name']);
  }
}
