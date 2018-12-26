import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { WarehouseProductsService } from './../warehouse-products.service';
import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from "../../alert.service";
import { WarehouseService } from "../warehouse.service";
import { ProductsService } from "../products.service";
import * as _ from 'lodash';
import { SelectUnitsComponent } from 'app/directives/select-units/select-units.component';

@Component({
  selector: 'wm-requisition-template-edit',
  templateUrl: './requisition-template-edit.component.html'
})
export class RequisitionTemplateEditComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('goto') public goto: any;
  @ViewChild('genericSearch') public genericSearch: SearchGenericAutocompleteComponent;
  @ViewChild('genericId') public genericId: SelectUnitsComponent;

  templates = [];
  products = [];
  templateId: any;
  dstWarehouseId: any;
  srcWarehouseId: any;
  templateSubject: any;
  dstWarehouseName: any;
  srcWarehouseName: any;

  constructor(
    private route: ActivatedRoute,
    private alertService: AlertService,
    // private ref: ChangeDetectorRef,
    // private warehouseService: WarehouseService,
    private productService: ProductsService,
    private warehouseProductService: WarehouseProductsService,
    private router: Router
  ) {
    this.templateId = this.route.snapshot.params['templateId'];
  }

  ngOnInit() {
    this.getTemplate();
    this.getProducts();
  }
  async getTemplate() {
    try {
      const rs: any = await this.warehouseProductService.getTemplate(this.templateId);
      if (rs.ok) {
        this.templates = rs.rows[0];
        this.templateSubject = this.templates['template_subject'];
        this.dstWarehouseName = this.templates['dst_warehouse_name'];
        this.dstWarehouseId = this.templates['dst_warehouse_code'];
        this.srcWarehouseName = this.templates['src_warehouse_name'];
        this.srcWarehouseId = this.templates['src_warehouse_code'];

        // this.ref.detectChanges();
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
    this.productService.getProductsInTemplate(this.templateId)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
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
  addProducts(e) {
    const idx = _.findIndex(this.products, { 'generic_id': e.generic_id });
    if (idx > -1) {
      this.alertService.error('มีรายการนี้อยู่แล้ว');
    } else {
      if(e) this.products.push(e);
      this.genericSearch.clearSearch();
    }
  }
  removeSelected(g) {
    const idx = _.findIndex(this.products, { generic_id: g.generic_id });
    if (idx > -1) {
      this.products.splice(idx, 1);
    }
  }
  productDown(g) {
    if (this.products.length > 1) {
      const idx = _.findIndex(this.products, { generic_id: g.generic_id });
      if (idx !== this.products.length - 1) {
        const temp = this.products[idx];
        this.products[idx] = this.products[idx + 1];
        this.products[idx + 1] = temp;
      }
    }
  }
  productUp(g) {
    if (this.products.length > 1) {
      const idx = _.findIndex(this.products, { generic_id: g.generic_id });
      if (idx !== 0) {
        const temp = this.products[idx];
        this.products[idx] = this.products[idx - 1];
        this.products[idx - 1] = temp;
      }
    }
  }
  productGoTo(g, value) {
    let temps: any;
    if (this.products.length > 1) {
      const idx = _.findIndex(this.products, { generic_id: g.generic_id });
      if (value - 1 < idx) {
        temps = this.products[idx];
        for (let i = idx; i > value - 1; i--) {
          this.products[i] = this.products[i - 1];
        }
        this.products[value - 1] = temps;
      } else if (value - 1 > idx) {
        temps = this.products[idx];
        for (let i = idx; i < value - 1; i++) {
          this.products[i] = this.products[i + 1];
        }
        this.products[value - 1] = temps;
      }
    }
  }
  async saveTemplate() {
    if (this.products) {
      this.modalLoading.show();
      try {
        const rs: any = await this.warehouseProductService.updateWarehouseProductsTemplate
          (this.templateId, this.templateSubject, this.products);
        if (rs.ok) {
          this.alertService.success();
          this.router.navigate(['/admin/templates/main']);
        } else {
          this.alertService.error(JSON.stringify(rs.error));
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.serverError();
      };
    } else {
      this.alertService.error('ข้อมูลไม่ครบถ้วน');
    }
  }
  editChangeUnit(g, e) {
    const idx = _.findIndex(this.products, { 'generic_id': g.generic_id })
    this.products[idx].unit_generic_id = e.unit_generic_id
  }
  sort() {
    this.products = _.sortBy(this.products, ['generic_name']);
  }
}
