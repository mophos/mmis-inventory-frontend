import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import * as _ from 'lodash';
import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { ActivatedRoute, Router, Params } from '@angular/router';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import { IGeneric } from 'app/shared';
import { SelectReceiveUnitComponent } from 'app/directives/select-receive-unit/select-receive-unit.component';
import { WarehouseService } from 'app/admin/warehouse.service';
import { ProductsService } from 'app/admin/products.service';
import { AlertService } from 'app/alert.service';
import { RequisitionService } from 'app/admin/requisition.service';
import { RequisitionTypeService } from 'app/admin/requisition-type.service';
import { WarehouseProductsService } from 'app/admin/warehouse-products.service';
import { PeriodService } from 'app/period.service';

@Component({
  selector: 'wm-requisition-fast',
  templateUrl: './requisition-fast.component.html',
  styles: []
})
export class RequisitionFastComponent implements OnInit {

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
  products = [];
  generics = [];
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
  selectedRemainQty = 0;

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
        this.warehouses = _.sortBy(rs.rows, 'short_code');
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
      console.error(error);
    }
  }

  // async getOrderItems() {
  //   this.modalLoading.show();
  //   this.products = [];
  //   try {
  //     const rs: any = await this.requisitionService.getEditRequisitionOrderItems(this.requisitionId);
  //     this.modalLoading.hide();
  //     if (rs.ok) {
  //       this.products = rs.rows;
  //     } else {
  //       this.alertService.error(rs.error);
  //     }
  //   } catch (error) {
  //     this.modalLoading.hide();
  //     console.log(error);
  //     this.alertService.error(error.message);
  //   }
  // }

  // async getOrderDetail() {
  //   this.modalLoading.show();
  //   try {
  //     const rs: any = await this.requisitionService.getOrderDetail(this.requisitionId);
  //     this.modalLoading.hide();
  //     if (rs.ok) {
  //       const detail: IRequisitionOrder = <IRequisitionOrder>rs.detail;
  //       this.requisitionCode = detail ? detail.requisition_code : null;
  //       this.requisitionTypeID = detail ? detail.requisition_type_id : null;

  //       this.wmWithdraw = detail ? detail.wm_withdraw : null;
  //       this.wmRequisition = detail ? detail.wm_requisition : null;

  //       await this.onSelectWarehouses(null);

  //       if (detail.requisition_date) {
  //         this.requisitionDate = {
  //           date: {
  //             year: moment(detail.requisition_date).get('year'),
  //             month: moment(detail.requisition_date).get('month') + 1,
  //             day: moment(detail.requisition_date).get('date')
  //           }
  //         }
  //       }
  //     } else {
  //       this.alertService.error(rs.error);
  //     }

  //   } catch (error) {
  //     this.modalLoading.hide();
  //     this.alertService.error(error.message);
  //   }
  // }

  // changeSearchGeneric(event: any) {
  //   if (event) {
  //     this.clearItem();
  //   }
  // }

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

  onSuccessConfirm(event: any) {
    console.log(event);

    const idx = _.findIndex(this.generics, { generic_id: event.generic_id });

    if (idx > -1) {
      const _idx = _.findIndex(this.generics[idx].products, { wm_product_id: event.wm_product_id });
      if (_idx > -1) {
        this.generics[idx].products[_idx].confirm_qty = event.confirm_qty;
      } else {
        this.generics[idx].products.push(event);
      }

      // calculate new allowcate_qty
      this.generics[idx].requisition_qty = 0;
      this.generics[idx].products.forEach(v => {
        this.generics[idx].requisition_qty += (v.confirm_qty * v.conversion_qty);
      });
      this.generics[idx].requisition_qty /= this.generics[idx].to_unit_qty;
    }
  }

  onChangeUnit(event) {
    this.selectedUnitGenericId = event.unit_generic_id;
    this.selectedSmallQty = event.qty;
  }

  onChangeEditUnit(event, genericId: any) {

    const idx = _.findIndex(this.generics, { 'generic_id': genericId });
    console.log(event, idx);
    if (idx > -1) {
      this.generics[idx].unit_generic_id = event.unit_generic_id;
      this.generics[idx].to_unit_qty = event.qty;
      this.generics[idx].from_unit_name = event.from_unit_name;
      this.generics[idx].to_unit_name = event.to_unit_name;
      this.generics[idx].qty = event.qty;

    }
  }

  async onChangeEditQty(genericId: any, qty: any) {
    console.log('qty', qty);

    const idx = _.findIndex(this.generics, { 'generic_id': genericId });
    if (idx > -1) {
      if (qty * this.generics[idx].to_unit_qty > this.generics[idx].remain_qty) {
        this.generics[idx].requisition_qty = this.generics[idx].remain_qty / this.generics[idx].to_unit_qty;
        this.alertService.error('จำนวนเบิกมากกว่าจำนวนคงเหลือ')
      } else {
        this.generics[idx].requisition_qty = qty;
      }
      await this.allowcate(genericId, qty * this.generics[idx].to_unit_qty)
    }

  }

  qtyEnter(event: any) {
    if (event.keyCode === 13) {
      this.addProduct();
    }
  }

  async addProduct() {
    const idx = _.findIndex(this.generics, { 'generic_id': this.selectedGenericId })
    if (idx > -1) {
      this.alertService.error('รายการซ้ำกรุณาแก้ไขรายการเดิม')
    } else {
      const obj: any = {};
      obj.generic_id = this.selectedGenericId;
      obj.requisition_qty = this.selectedRequisitionQty;
      obj.confirm_qty = this.selectedRequisitionQty * this.selectedSmallQty;
      obj.generic_name = this.selectedGenericName;
      obj.to_unit_qty = this.selectedSmallQty;
      obj.unit_generic_id = this.selectedUnitGenericId;
      obj.working_code = this.selectedWorkingCode;
      obj.remain_qty = this.selectedRemainQty;
      obj.products = [];
      this.generics.push(obj);
      this.clearItem();
      await this.allowcate(obj.generic_id, obj.requisition_qty * obj.to_unit_qty);
      console.log(this.generics);

    }
  }

  async allowcate(genericId, requisitionQty) {
    try {
      const idx = _.findIndex(this.generics, { generic_id: genericId });
      const allocate = await this.requisitionService.getAllocate([{ 'genericId': genericId, 'genericQty': requisitionQty }])
      if (allocate.ok) {
        this.generics[idx].products = [];
        let sum = 0;
        for (const z of allocate.rows) {
          let _obj: any;
          if (z.generic_id === genericId) {
            if (z.pack_remain_qty > 0) {
              _obj = {
                conversion_qty: z.conversion_qty,
                wm_product_id: z.wm_product_id,
                generic_id: z.generic_id,
                expired_date: z.expired_date,
                from_unit_name: z.from_unit_name,
                lot_no: z.lot_no,
                product_name: z.product_name,
                small_remain_qty: +z.small_remain_qty,
                pack_remain_qty: +z.pack_remain_qty,
                to_unit_name: z.to_unit_name,
                unit_generic_id: z.unit_generic_id,
                confirm_qty: Math.floor(z.product_qty / z.conversion_qty)
              }
              sum += z.product_qty;
              this.generics[idx].products.push(_obj);
            }
          }
        }
        this.generics[idx].confirm_qty = sum;
      } else {
        this.alertService.error(allocate.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.error(error)

    }
  }

  async getTemplateItems(templateId: any) {
    try {
      console.log(this.templateId)
      const rs: any = await this.requisitionService.getTemplateItems(this.templateId);
      if (rs.ok) {
        this.products = [];

        rs.rows.forEach(v => {
          const product: any = {};
          product.generic_id = v.generic_id;
          product.requisition_qty = 0;
          product.generic_name = v.generic_name;
          product.to_unit_qty = 0;
          product.unit_generic_id = v.unit_generic_id;
          product.from_unit_name = null;
          product.to_unit_name = null;
          product.qty = null;
          product.working_code = v.working_code;
          product.remain_qty = v.remain_qty;
          this.generics.push(product);
        });
        console.log(this.products)
      }
    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  removeItem(genericId: any) {
    const idx = _.findIndex(this.generics, { 'generic_id': genericId });
    if (idx > -1) {
      this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
        .then(() => {
          this.generics.splice(idx, 1);
        })
    }
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
        if (rs.rows.length > 0) {
          this.wmWithdraw = rs.rows[0].destination_warehouse_id;
          this.getTemplates();
        }
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
    this.alertService.confirm('คุณตรวจสอบจำนวนจ่ายถูกต้องแล้ว ใช่หรือไม่?')
      .then(async () => {
        const order: any = {};
        order.requisition_date = reqDate;
        order.requisition_type_id = this.requisitionTypeID;
        order.wm_requisition = this.wmRequisition;
        order.wm_withdraw = this.wmWithdraw;

        // const generics: any = [];
        // this.generics.forEach((v: any) => {
        //   if (v.requisition_qty > 0) {
        //     const obj: any = {};
        //     obj.generic_id = v.generic_id;
        //     obj.requisition_qty = v.to_unit_qty * v.requisition_qty;
        //     obj.unit_generic_id = v.unit_generic_id;
        //     generics.push(obj);
        //   }
        // });

        if (!this.generics.length) {
          this.alertService.error('กรุณาระบุจำนวนสินค้าที่ต้องการเบิก');
          this.isSave = false;
        } else {
          this.modalLoading.show();
          try {
            let rs: any;
            rs = await this.requisitionService.saveRequisitionFastOrder(order, this.generics);

            this.modalLoading.hide();
            this.isSave = false;
            if (rs.ok) {
              sessionStorage.setItem('tabRequisition', 'waitingApprove');
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

  async getTemplates() {
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

  // async getGenericItems(event: any) {
  //   if (this.templateId) {
  //     this.getTemplateItems(this.templateId);
  //   }
  // }

}
