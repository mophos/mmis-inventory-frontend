import {
  Component,
  OnInit,
  ChangeDetectorRef,
  Inject,
  ViewChild
} from '@angular/core';
// import { Router } from '@angular/router';
import { WarehouseService } from "../warehouse.service";
import { ReceiveService } from "../receive.service";
import { RequisitionTypeService } from "../requisition-type.service";
import { RequisitionService } from "../requisition.service";
import { UnitissueService } from "../unitissue.service";
import { LabelerService } from "../labeler.service";
import { AlertService } from "../../alert.service";
import { ProductlotsService } from "../productlots.service";
import { IMyOptions } from 'mydatepicker-th';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { PeriodService } from '../../period.service';

// import { LotService } from '../lot.service';

import { Headers } from '@angular/http';


import { IProductReceive, IReceive, IRequisition, IRequisitionStructure, IProductRequisition } from "../../models";

import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';

import { WarehouseProductsService } from './../warehouse-products.service';
import { ProductsService } from './../../admin/products.service';
import { JwtHelper } from 'angular2-jwt';

import { AlertExpiredService } from './../alert-expired.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { IGeneric, IUnit, IRequisitionOrderItem, IRequisitionOrder } from 'app/shared';
import { SelectReceiveUnitComponent } from 'app/directives/select-receive-unit/select-receive-unit.component';
@Component({
  selector: 'wm-requisition-new',
  templateUrl: './requisition-new.component.html'
})
export class RequisitionNewComponent implements OnInit {
  // @ViewChild('viewer') private viewer: any;
  // @ViewChild('modalRequisition') public modalRequisition: any;
  @ViewChild('modalLoading') public modalLoading: any;

  @ViewChild('selectUnits') public selectUnits: SelectReceiveUnitComponent;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;

  // public mask = [/\d/, /\d/, /\d/];

  warehouses: any[] = [];
  tmpwareHouses: any[] = [];
  withDrawWarehouses: any[] = [];
  wmRequisition: any;
  wmWithdraw: any;

  requisitionTypes: any[] = [];
  requisitionStatus: any[] = [];

  requisitionSummary: any = [];
  products: Array<IRequisitionOrderItem> = [];
  requiSitionTypes: any = [];
  requisitionTypeID: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  requisitionId: any;
  requisitionDate: any;
  selectedGenericId: any;
  selectedGenericName: any;
  selectedWorkingCode: any;
  selectedUnitGenericId: any;
  selectedSmallQty: any = 0;
  selectedRequisitionQty: any;
  selectedTotalSmallQty: any = 0;
  requisitionCode: any;
  selectedRemainQty: any = 0;

  isUpdate = false;
  isSave = false;

  templates: any = [];
  templateId: any = null;

  constructor(
    private wareHouseService: WarehouseService,
    private productService: ProductsService,
    private alertService: AlertService,
    private requisitionService: RequisitionService,
    private requisitionTypeService: RequisitionTypeService,
    private route: ActivatedRoute,
    private router: Router,
    private warehouseProductService: WarehouseProductsService,
    @Inject('API_URL') private apiUrl: string,
    private periodService: PeriodService
  ) {
    this.requisitionId = this.route.snapshot.params['requisitionId'];
  }

  async ngOnInit() {

    const date = new Date();
    this.requisitionDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    await this.getTypes();
    await this.getWarehouses();

    if (this.requisitionId) {
      await this.getOrderDetail();
      await this.getOrderItems();
      this.isUpdate = true;
    }

  }

  async getTypes() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionTypeService.all();
      this.modalLoading.hide();
      if (rs.ok) {
        this.requiSitionTypes = rs.rows;
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }

  async getWarehouses() {
    this.modalLoading.show();
    try {
      const rs: any = await this.wareHouseService.getWarehouse();
      this.modalLoading.hide();
      if (rs.ok) {
        this.warehouses = rs.rows;
        // this.wareHouses = _.clone(this.tmpwareHouses);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }

  async getOrderItems() {
    this.modalLoading.show();
    this.products = [];
    try {
      const rs: any = await this.requisitionService.getEditRequisitionOrderItems(this.requisitionId);
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  async getOrderDetail() {
    this.modalLoading.show();
    try {
      const rs: any = await this.requisitionService.getOrderDetail(this.requisitionId);
      this.modalLoading.hide();
      if (rs.ok) {
        const detail: IRequisitionOrder = <IRequisitionOrder>rs.detail;
        this.requisitionCode = detail ? detail.requisition_code : null;
        this.requisitionTypeID = detail ? detail.requisition_type_id : null;

        this.wmWithdraw = detail ? detail.wm_withdraw : null;
        this.wmRequisition = detail ? detail.wm_requisition : null;

        await this.onSelectWarehouses(null);

        if (detail.requisition_date) {
          this.requisitionDate = {
            date: {
              year: moment(detail.requisition_date).get('year'),
              month: moment(detail.requisition_date).get('month') + 1,
              day: moment(detail.requisition_date).get('date')
            }
          }
        }
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  changeSearchGeneric(event: any) {
    if (event) {
      this.clearItem();
    }
  }

  clearItem() {
    this.selectUnits.clearUnits();
    this.selectedGenericId = null;
    this.selectedUnitGenericId = null;
    this.selectedGenericName = null;
    this.selectedWorkingCode = null;
    this.selectedSmallQty = 0;
    this.selectedTotalSmallQty = 0;
    this.selectedRequisitionQty = '';
    this.selectedRemainQty = 0;
    this.searchGenericCmp.clearSearch();
  }

  setSelectedGeneric(generic: IGeneric) {
    this.selectedGenericId = generic.generic_id;
    this.selectedGenericName = generic.generic_name;
    this.selectedWorkingCode = generic.working_code;
    this.selectedRemainQty = generic.qty;
    this.selectedRequisitionQty = 1;
    
    this.selectUnits.getUnits(generic.generic_id);
  }

  onChangeUnit(event: IUnit) {
    this.selectedUnitGenericId = event.unit_generic_id;
    this.selectedSmallQty = event.qty;
  }

  onChangeEditUnit(event: IUnit, idx: any) {
    this.products[idx].unit_generic_id = event.unit_generic_id;
    this.products[idx].to_unit_qty = event.qty;
  }

  onChangeEditQty(idx: any, qty: any) {
    this.products[idx].requisition_qty = qty;
  }

  qtyEnter(event: any) {
    if (event.keyCode === 13) {
      this.addProduct();
    }
  }

  addProduct() {
    const idx = _.findIndex(this.products, { generic_id: this.selectedGenericId })
    if (idx > -1) {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม')
    } else {
      const product: IRequisitionOrderItem = {};
      product.generic_id = this.selectedGenericId;
      product.requisition_qty = this.selectedRequisitionQty;
      product.generic_name = this.selectedGenericName;
      product.to_unit_qty = this.selectedSmallQty;
      product.unit_generic_id = this.selectedUnitGenericId;
      product.working_code = this.selectedWorkingCode;
      product.remain_qty = this.selectedRemainQty;

      this.products.push(product);
      this.clearItem();
    }
  }

  async getTemplateItems(templateId: any) {
    try {
      const rs: any = await this.requisitionService.getTemplateItems(templateId);
      if (rs.ok) {
        this.products = [];

        rs.rows.forEach(v => {
          const product: IRequisitionOrderItem = {};
          product.generic_id = v.generic_id;
          product.requisition_qty = 0;
          product.generic_name = v.generic_name;
          product.to_unit_qty = 0;
          product.unit_generic_id = null;
          product.working_code = v.working_code;
          product.remain_qty = 0;

          this.products.push(product);
        });
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  removeItem(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.products.splice(idx, 1);
      })
      .catch(() => { });
  }

  async onSelectWarehouses(event: any) {
    await this.getShipingNetwork(this.wmRequisition);
  }

  async getShipingNetwork(warehouseId: any) {
    this.modalLoading.show();
    this.withDrawWarehouses = [];
    try {
      const rs: any = await this.wareHouseService.getShipingNetwork(warehouseId, 'REQ');
      this.modalLoading.hide();
      if (rs.ok) {
        this.templates = [];
        this.withDrawWarehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async save() {
    this.isSave = true;
    const reqDate = this.requisitionDate.date ? `${this.requisitionDate.date.year}-${this.requisitionDate.date.month}-${this.requisitionDate.date.day}` : null;
    this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
      .then(async () => {
        const order: IRequisitionOrder = {};
        // console.log(this.requisitionDate.date);
        order.requisition_date = reqDate;
        order.requisition_type_id = this.requisitionTypeID;
        order.wm_requisition = this.wmRequisition;
        order.wm_withdraw = this.wmWithdraw;

        const products: Array<IRequisitionOrderItem> = [];
        let isError = false;

        this.products.forEach((v: IRequisitionOrderItem) => {
          if (v.requisition_qty <= 0) {
            isError = true;
          }
          const obj: IRequisitionOrderItem = {};
          obj.generic_id = v.generic_id;
          obj.requisition_qty = v.to_unit_qty * v.requisition_qty;
          obj.unit_generic_id = v.unit_generic_id;
          products.push(obj);
        });

        if (isError) {
          this.alertService.error('กรุณาระบุจำนวนให้ครบถ้วน เช่น จำนวนต้องมากกว่า 0');
        } else {
          this.modalLoading.show();
          try {
            let rs: any;
            if (this.isUpdate) {
              rs = await this.requisitionService.updateRequisitionOrder(this.requisitionId, order, products);
            } else {
              rs = await this.requisitionService.saveRequisitionOrder(order, products);
            }

            this.modalLoading.hide();
            this.isSave = false;
            if (rs.ok) {
              this.router.navigate(['/admin/requisition']);
            } else {
              this.alertService.error(rs.error);
            }

          } catch (error) {
            this.isSave = false;
            this.modalLoading.hide();
            this.alertService.error(error.message);
          }
        }
      })
      .catch(() => {
        this.isSave = false;
        this.modalLoading.hide();
      })
    
  }

  async getTemplates(event: any) {
    try {
      const dstWarehouseId = this.wmWithdraw;
      const srcWarehouseId = this.wmRequisition;

      if (dstWarehouseId && srcWarehouseId) {
        const rs: any = await this.requisitionService.getTemplates(srcWarehouseId, dstWarehouseId);

        if (rs.ok) {
          this.templates = rs.rows;
        } else {
          this.alertService.error(rs.error);
        }
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async getGenericItems(event: any) {
    if (this.templateId) {
      this.getTemplateItems(this.templateId);
    }
  }

}
