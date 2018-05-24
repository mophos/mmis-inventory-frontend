import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { AlertService } from 'app/alert.service';
import { WarehouseProductsService } from 'app/admin/warehouse-products.service';

@Component({
  selector: 'wm-requisition-template',
  templateUrl: './requisition-template.component.html'
})
export class RequisitionTemplateComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  templates = [];

  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private warehouseProductService: WarehouseProductsService
  ) { }

  ngOnInit() {
    this.showAllTemplate();
  }

  showAllTemplate() {
    this.modalLoading.show();
    this.templates = [];
    this.warehouseProductService.getallTemplate()
      .then((result: any) => {
        if (result.ok) {
          this.templates = result.rows;
        } else {
          this.alertService.error(result.error);
        }
        this.modalLoading.hide();
      })
      .catch(() => {
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

}
