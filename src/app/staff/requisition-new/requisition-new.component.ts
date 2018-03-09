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
import { Headers } from '@angular/http';


import { IProductReceive, IReceive, IRequisition, IRequisitionStructure, IProductRequisition } from "../../models";

import * as _ from 'lodash';
import * as numeral from 'numeral';
import * as moment from 'moment';

import { WarehouseProductsService } from './../warehouse-products.service';
import { ProductsService } from './../../staff/products.service';
import { JwtHelper } from 'angular2-jwt';

import { AlertExpiredService } from './../alert-expired.service';
import { ToThaiDatePipe } from './../../helper/to-thai-date.pipe';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { IGeneric, IUnit, IRequisitionOrderItem, IRequisitionOrder } from 'app/shared';
import { SelectReceiveUnitComponent } from 'app/directives/select-receive-unit/select-receive-unit.component';
import { StaffService } from 'app/staff/staff.service';
import { PeriodService } from 'app/staff/period.service';

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

  wareHouses: any[] = [];
  tmpwareHouses: any[] = [];
  withDrawWarehouses: any[] = [];
  wmRequisition: any;
  wmRequisitionName: any = null;
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
  selectedSmallQty: number = 0;
  selectedRequisitionQty: any;
  selectedTotalSmallQty: number = 0;
  selectedRemainQty: number = 0;
  isVerify: boolean = false;
  requisitionCode: any;
  
  isTemp: any = 'N';
  isOldTemp: any = 'N';
  isUpdate = false;
  isSave = false;
  templates: any = [];
  templateId: any = null;
  jwtHelper: JwtHelper = new JwtHelper();

  token: any;
  openTemp: boolean = false;
  tempList: any = [];
  
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
    private staffService: StaffService,
    private periodService: PeriodService
  ) { 
    this.token = sessionStorage.getItem('token');
    this.requisitionId = this.route.snapshot.params['requisitionId'];
  }

  async ngOnInit() {
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.wmRequisition = decoded.warehouseId;
    this.wmRequisitionName = `${decoded.warehouseCode} - ${decoded.warehouseName}`;

    const date = new Date();
    this.requisitionDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };

    await this.getTypes();
    // await this.getWarehouses();
    // await this.getWarehouseDetail();
    await this.getShipingNetwork(this.wmRequisition);

    if (this.requisitionId) {
      await this.getOrderDetail();
      await this.getOrderItems();
      this.isUpdate = true;
    }

  }

  async getTypes() {
    this.modalLoading.show();
    try {
      let rs: any = await this.requisitionTypeService.all();
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

  async getOrderItems() {
    this.modalLoading.show();
    this.products = [];
    try {
      let rs: any = await this.requisitionService.getEditRequisitionOrderItems(this.requisitionId);
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
      let rs: any = await this.requisitionService.getOrderDetail(this.requisitionId);
      this.modalLoading.hide();
      if (rs.ok) {
        let detail: IRequisitionOrder = <IRequisitionOrder>rs.detail;
        this.requisitionCode = detail ? detail.requisition_code : null;
        this.requisitionTypeID = detail ? detail.requisition_type_id : null;

        this.wmWithdraw = detail ? detail.wm_withdraw : null;
        this.wmRequisition = detail ? detail.wm_requisition : null;
        this.isTemp = detail ? detail.is_temp : 'N';
        this.isOldTemp = detail ? detail.is_temp : 'N';

        // await this.onSelectWarehouses();
        await this.getShipingNetwork(this.wmRequisition);
        await this.getTemplates(null);

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
    // console.log(event);
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
    this.selectedRemainQty = 0;
    this.selectedRequisitionQty = '';
    this.searchGenericCmp.clearSearch();
  }

  async setSelectedGeneric(generic: IGeneric) {
    this.selectedGenericId = generic.generic_id;
    this.selectedGenericName = generic.generic_name;
    this.selectedWorkingCode = generic.working_code;
   
    let rs: any = await this.requisitionService.getGenericWarehouseRemain(this.wmWithdraw, this.selectedGenericId)
    this.selectedRemainQty = rs.ok ? rs.remain_qty : 0;
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
    this.products[idx].requisition_qty = +qty;
    console.log(this.products[idx]);
  }

  qtyEnter(event: any) {
    if (event.keyCode === 13) {
      this.addProduct();
    }
  }

  async addProduct() {
    const idx = _.findIndex(this.products,{generic_id:this.selectedGenericId})
    if (idx > -1) {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม')
    } else {
      // get remain qty
      let product: IRequisitionOrderItem = {};
      product.generic_id = this.selectedGenericId;
      product.requisition_qty = this.selectedRequisitionQty;
      product.generic_name = this.selectedGenericName;
      product.to_unit_qty = this.selectedSmallQty;
      product.unit_generic_id = this.selectedUnitGenericId;
      product.working_code = this.selectedWorkingCode;
      product.remain_qty = this.selectedRemainQty;
      this.products.push(product);
    }
    this.clearItem();
  }

  async getTemplateItems(templateId: any) {
    try {
      let rs: any = await this.requisitionService.getTemplateItems(templateId);
      if (rs.ok) {
        this.products = [];

        rs.rows.forEach(v => {
          let product: IRequisitionOrderItem = {};
          product.generic_id = v.generic_id;
          product.requisition_qty = 0;
          product.generic_name = v.generic_name;
          product.to_unit_qty = 0;
          product.unit_generic_id = null;
          product.working_code = v.working_code;
          product.remain_qty = v.remain_qty;

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

  async onSelectWarehouses() {
    await this.getShipingNetwork(this.wmRequisition);
  }

  async getShipingNetwork(warehouseId: any) {
    this.modalLoading.show();
    this.withDrawWarehouses = [];
    try {
      let rs: any = await this.wareHouseService.getShipingNetwork(warehouseId, 'REQ');
      this.modalLoading.hide();
      if (rs.ok) {
        this.withDrawWarehouses = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  saveTemp(){
    this.isTemp = 'Y';
    this._save();
  }

  save() {
    this.isTemp = 'N';
    this._save();
  }

  async _save() {
    this.isSave = true;
    const reqDate = this.requisitionDate.date ? `${this.requisitionDate.date.year}-${this.requisitionDate.date.month}-${this.requisitionDate.date.day}` : null;
    const rs = await this.periodService.getStatus(reqDate); 
    if(rs.rows[0].status_close === 'Y') {
      this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถเบิกได้')
    } else {
      this.alertService.confirm('ต้องการบันทึกข้อมูล ใช่หรือไม่?')
      .then(async () => {
        let order: IRequisitionOrder = {};
        // console.log(this.requisitionDate.date);
        // let reqDate = this.requisitionDate.date ? `${this.requisitionDate.date.year}-${this.requisitionDate.date.month}-${this.requisitionDate.date.day}` : null;
        order.requisition_date = reqDate;
        order.requisition_type_id = this.requisitionTypeID;
        order.wm_requisition = this.wmRequisition;
        order.wm_withdraw = this.wmWithdraw;
        order.is_temp = this.isTemp;
        order.requisition_code = this.requisitionCode;

        let products: Array<IRequisitionOrderItem> = [];

        this.products.forEach((v: IRequisitionOrderItem) => {
          if (v.requisition_qty > 0) {
            let obj: IRequisitionOrderItem = {};
            obj.generic_id = v.generic_id;
            obj.requisition_qty = v.to_unit_qty * v.requisition_qty;
            obj.unit_generic_id = v.unit_generic_id;
            products.push(obj);
          }
        });

        if (!products.length) {
          this.alertService.error('กรุณาระบุสินค้าที่ต้องการเบิก');
        } else {
          this.modalLoading.show();
          try {
            let rs: any;
            if (this.requisitionId) {
              rs = await this.requisitionService.updateRequisitionOrder(this.requisitionId, order, products);
            } else {
              rs = await this.requisitionService.saveRequisitionOrder(order, products);
            }

            this.modalLoading.hide();

            if (rs.ok) {
              this.router.navigate(['/staff/requisition']);
            } else {
              this.isSave = false;
              this.isTemp = this.isOldTemp;
              this.alertService.error(rs.error);
            }

          } catch (error) {
            this.isSave = false;
            this.isTemp = this.isOldTemp;
            this.modalLoading.hide();
            this.alertService.error(error.message);
          }
        }

      })
        .catch(() => {
          this.isSave = false;
          this.isTemp = this.isOldTemp;
          this.modalLoading.hide();
      });
    }

    this.isSave = false;
  }

  async getTemplates(event: any) {
    try {
      let dstWarehouseId = this.wmWithdraw;
      let srcWarehouseId = this.wmRequisition;

      if (dstWarehouseId && srcWarehouseId) {
        let rs: any = await this.requisitionService.getTemplates(srcWarehouseId, dstWarehouseId);

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

  async showTemp() {
    try {
      await this.getTempList();
      this.openTemp = true;
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
    }
  }

  onSelectTemp(temp: any) {
    this.requisitionId = temp.requisition_order_id;
    this.getOrderDetail();
    this.getOrderItems();
    this.openTemp = false;
    console.log(temp);
  }

  async getTempList() {
    try {
      this.modalLoading.show();
      let rs: any = await this.requisitionService.getTempList();
      this.modalLoading.hide();
      if (rs.ok) {
        this.tempList = [];
        this.tempList = rs.rows;
        this.openTemp = true;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.alertService.error(JSON.stringify(error));
    }
  }

  onRemoveTemp(temp: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          let rs: any = await this.requisitionService.removeTemp(temp.requisition_order_id);
          if (rs.ok) {
            this.alertService.success();
            this.getTempList();
          }
        } catch (error) {
        
        }
      }).catch(() => {
      
      });
  }
}
