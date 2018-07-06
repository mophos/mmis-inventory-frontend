import { Component, OnInit, ChangeDetectorRef, ViewChild, Inject } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { WarehouseProductsService } from './../warehouse-products.service';
import { AlertService } from "../../alert.service";

import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-requisition-template',
  templateUrl: './requisition-template.component.html'
})
export class RequisitionTemplateComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  templates = [];
  jwtHelper: JwtHelper = new JwtHelper();
  warehouseId: any;
  query: any;

  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private warehouseProductService: WarehouseProductsService,
    @Inject('API_URL') private url: string
  ) {
    const token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(token);
    this.warehouseId = decoded.warehouseId;
  }

  ngOnInit() {
    this.showAllTemplate();
  }

  showAllTemplate() {
    this.templates = [];
    this.modalLoading.show();
    this.warehouseProductService.getAllTemplateInWarehouse(this.warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.templates = result.rows;
        } else {
          this.alertService.error(result.error);
        }

        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  removeTemplate(template: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ [' + template.template_subject + '] ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.warehouseProductService.removeRequisitionTemplate(template.template_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.showAllTemplate();
            } else {
              this.alertService.error(rs.error);
            }
            this.modalLoading.hide();
          })
          .catch(() => {
            this.modalLoading.hide();
            this.alertService.serverError();
          });
      })
      .catch(() => {
        // no action
      });
  }

  print(templateId) {
    const token = sessionStorage.getItem('token');
    const exportUrl = `${this.url}/staff/warehouses/export/excel?templateId=${templateId}&token=${token}`;
    window.open(exportUrl);

  }

  search() {
    this.modalLoading.show();
    this.warehouseProductService.getAllTemplateInWarehouseSearch(this.warehouseId, this.query)
      .then((result: any) => {
        if (result.ok) {
          this.templates = result.rows;
        } else {
          this.alertService.error(result.error);
        }
        this.modalLoading.hide();
      })
      .catch((error: any) => {
        this.modalLoading.hide();
        this.alertService.serverError();
      });
  }

  enterSearch(e) {
    if (e.keyCode === 13) {
      this.search();
    }
  }
}
