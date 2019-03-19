import { SelectUnitsComponent } from 'app/directives/select-units/select-units.component';
import { WarehouseProductsService } from './../warehouse-products.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from "../../alert.service";
import { WarehouseService } from "../warehouse.service";
import { ProductsService } from "../products.service";
import * as _ from 'lodash';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-issue-template-new',
  templateUrl: './issue-template-new.component.html',
})
export class IssueTemplateNewComponent implements OnInit {

  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('goto') public goto: any;
  @ViewChild('genericSearch') public genericSearch: SearchGenericAutocompleteComponent;
  @ViewChild('genericId') public genericId: SelectUnitsComponent;
  jwtHelper: JwtHelper = new JwtHelper();
  isRequest = false;
  dstWarehouses = [];
  srcWarehouses = [];

  // dstwarehouseId: any;
  warehouseId: any;

  products2 = [];
  templateSubject: any;
  templateId: any = '';
  templates: any;
  warehouseName: any;
  token: string;
  decodedToken: any;


  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private warehouseService: WarehouseService,
    private productService: ProductsService,
    private warehouseProductService: WarehouseProductsService,
    private router: Router
  ) {
    this.templateId = this.route.snapshot.params['templateId'];
    this.token = sessionStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(this.token);
  }
  ngOnInit() {
    this.warehouseId = this.decodedToken.warehouseId;
    this.getWarehouses();
    console.log(this.templateId);

    this.templateId ? this.getTemplate() : ''
  }
  async getTemplate() {
    try {
      const rs: any = await this.warehouseProductService.getTemplateIssue(this.templateId);
      if (rs.ok) {
        this.templates = rs.rows[0];
        this.templateSubject = this.templates['template_subject'];
        this.warehouseName = this.templates['warehouse_name'];
        this.warehouseId = this.templates['warehouse_id'];
        this.isRequest = true;
        // this.ref.detectChanges();
        this.getProducts()
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.error(error);
      this.alertService.error(error.message);
    }
  }
  async getProducts() {
    this.modalLoading.show();
    this.productService.getProductsInTemplateIssue(this.templateId)
      .then((result: any) => {
        if (result.ok) {
          console.log(this.products2);

          this.products2 = result.rows;
          // this.chekSelectedItems();
          // this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.modalLoading.hide();
      })
      .catch(() => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
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
    if (typeof (e) === 'object') {
      const idx = _.findIndex(this.products2, { 'generic_id': e.generic_id });
      if (idx > -1) {
        this.alertService.error('มีรายการนี้อยู่แล้ว');
      } else {
        this.products2.push(e);
        this.genericSearch.clearSearch();
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
  updateTemplate() {
    const templateSubject = this.templateSubject;
    // const templateSummary = {
    //   // dstwarehouseId: this.dstwarehouseId,
    //   warehouseId: this.warehouseId,
    //   templateSubject: templateSubject
    // };
    if (templateSubject && this.products2) {
      this.modalLoading.show();
      this.warehouseProductService.updateWarehouseProductsTemplateIssue(this.templateId, templateSubject, this.products2)
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
  saveTemplate() {
    const templateSubject = this.templateSubject;
    const templateSummary = {
      // dstwarehouseId: this.dstwarehouseId,
      warehouseId: this.warehouseId,
      templateSubject: templateSubject
    };
    if (templateSummary && this.products2) {
      this.modalLoading.show();
      this.warehouseProductService.saveWarehouseProductsTemplateIssue(templateSummary, this.products2)
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
  editChangeUnit(g, e) {
    const idx = _.findIndex(this.products2, { 'generic_id': g.generic_id })
    this.products2[idx].unit_generic_id = e.unit_generic_id
  }
  sort() {
    this.products2 = _.sortBy(this.products2, ['generic_name']);
  }
}

