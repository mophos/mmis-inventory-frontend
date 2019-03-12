import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';

import { WarehouseProductsService } from './../warehouse-products.service';
import { BasicService } from '../../basic.service';
import { AlertService } from "../../alert.service";

@Component({
  selector: 'wm-requisition-template',
  templateUrl: './requisition-template.component.html'
})
export class RequisitionTemplateComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  templates = [];
  query: any;
  templatesIssue = [];
  warehouses = [];
  tab = 'tmpReq';
  queryIssue: any;
  isOpenModal: boolean = false;
  templateSubject: any;
  templateId: any;
  warehouseId: any;

  constructor(
    private alertService: AlertService,
    private basicService: BasicService,
    private warehouseProductService: WarehouseProductsService
  ) { }

  ngOnInit() {
    this.getWarehouse();
    this.showAllTemplate();
    this.showAllTemplateIssue();
  }

  async getWarehouse() {
    this.modalLoading.show();
    try {
      const rs: any = await this.basicService.getWarehouses();
      if (rs.ok) {
        this.warehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
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


  search() {
    this.modalLoading.show();
    this.warehouseProductService.getAllTemplateSearch(this.query)
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
      this.tab == 'tmpReq' ? this.search() : this.searchIssue();
    }
  }
  selectTabTmpReq() {
    this.tab = 'tmpReq'
  }
  selectTabTmpIssue() {
    this.tab = 'tmpIss'

  }
  searchIssue() {
    this.modalLoading.show();
    this.warehouseProductService.getAllTemplateSearchIssue(this.queryIssue)
      .then((result: any) => {
        if (result.ok) {
          this.templatesIssue = result.rows;
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
  showAllTemplateIssue() {
    this.modalLoading.show();
    this.templates = [];
    this.warehouseProductService.getallTemplateIssue()
      .then((result: any) => {
        if (result.ok) {
          this.templatesIssue = result.rows;
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
  removeTemplateIssue(template: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ [' + template.template_subject + '] ใช่หรือไม่?')
      .then(() => {
        this.modalLoading.show();
        this.warehouseProductService.removeRequisitionTemplateIssue(template.template_id)
          .then((rs: any) => {
            if (rs.ok) {
              this.alertService.success();
              this.showAllTemplateIssue();
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

  async onSave(){
    this.isOpenModal = false;
    try {
      const rs = await this.warehouseProductService.getTemplateDetail(this.templateId);
      console.log(rs);
    } catch (error) {
      
    }
  }

  openModal() {
    this.isOpenModal = true;
  }
}