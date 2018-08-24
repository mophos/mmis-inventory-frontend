import { SelectUnitsComponent } from 'app/directives/select-units/select-units.component';
import { WarehouseProductsService } from './../warehouse-products.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from "../../alert.service";
import { WarehouseService } from "../warehouse.service";
import { ProductsService } from "../products.service";
import * as _ from 'lodash';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-requisition-template-new',
  templateUrl: './requisition-template-new.component.html'
})
export class RequisitionTemplateNewComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('goto') public goto: any;
  @ViewChild('genericSearch') public genericSearch: SearchGenericAutocompleteComponent;
  @ViewChild('genericId') public genericId: SelectUnitsComponent;
  isRequest = false;
  dstWarehouses = [];
  srcWarehouses = [];

  dstWarehouseId: any;
  srcWarehouseId: any;

  products2 = [];
  templateSubject: any;


  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private productService: ProductsService,
    private warehouseProductService: WarehouseProductsService,
    private router: Router
  ) { }
  ngOnInit() {
    this.getWarehouses();
  }
  async getWarehouses() {
    try {
      const resp: any = await this.warehouseService.getWarehouse();
      if (resp.ok) {
        this.srcWarehouses = _.sortBy(resp.rows, 'short_code');
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
    const idx = _.findIndex(this.products2, { 'generic_id': e.generic_id });
    if (idx > -1) {
      this.alertService.error('มีรายการนี้อยู่แล้ว');
    } else {
      this.products2.push(e);
      this.genericSearch.clearSearch();
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
            this.router.navigate(['/admin/requisition/templates']);
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
  onSelectWarehouses() {
    this.getReqShipingNetwork();
  }

  async getReqShipingNetwork() {
    this.dstWarehouses = [];
    await this.warehouseService.getShipingNetwork(this.srcWarehouseId, 'REQ')
      .then((result: any) => {
        if (result.ok) {
          if(result.rows.length){
            this.dstWarehouses = result.rows;
          } else {
            this.alertService.error('ยังไม่มีการตั้ง Shiping Network' );
          }
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
