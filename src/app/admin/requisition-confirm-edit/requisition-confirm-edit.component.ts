import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';

import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';
import { RequisitionService } from 'app/admin/requisition.service';
import { AlertService } from 'app/alert.service';
import { IRequisitionOrder } from 'app/shared';

@Component({
  selector: 'wm-requisition-confirm-edit',
  templateUrl: './requisition-confirm-edit.component.html',
  styles: []
})
export class RequisitionConfirmEditComponent implements OnInit {

  @ViewChild('modalLoading') public modalLoading: any;

  products: any = [];
  requisitionDate: any = null;
  requisitionId: any = null;
  requisitionCode: any = null;
  requisitionWarehouseName: any = null;
  withdrawWarehouseName: any = null;
  wmRequisitionId: any;

  requisitionType: any = null;
  confirmId: any;

  isEdit = false;
  actionMsg: string = null;

  genericIds: any = [];

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };
  constructor(
    private requisitionService: RequisitionService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {

    this.route.queryParams
      .subscribe(params => {
        this.requisitionId = params.requisitionId;
        this.confirmId = params.confirmId;
      });
  }

  async ngOnInit() {
    if (this.requisitionId && this.confirmId) {
      this.isEdit = true;
      this.actionMsg = 'แก้ไข';
      await this.getOrderDetail();
      await this.getOrderItems();
      await this.getConfirmItems();
    } else {
      this.isEdit = false;
      this.actionMsg = 'เพิ่ม';
      await this.getOrderDetail();
      await this.getOrderItems();

    }
  }

  onSuccessConfirm(event: any) {
    const idx = _.findIndex(this.products, { generic_id: event.generic_id });

    if (idx > -1) {
      const _idx = _.findIndex(this.products[idx].confirmItems, { wm_product_id: event.wm_product_id });
      this.products[idx].confirm_qty = event.confirm_qty * event.conversion_qty;

      if (_idx > -1) {
        this.products[idx].confirmItems[_idx].confirm_qty = event.confirm_qty;
      } else {
        this.products[idx].confirmItems.push(event);
      }

      // calculate new confirm_qty
      this.products[idx].confirm_qty = 0;
      this.products[idx].confirmItems.forEach(v => {
        this.products[idx].confirm_qty += (v.confirm_qty * v.conversion_qty);
      });
    }
  }

  async getOrderItems() {
    this.modalLoading.show();
    this.products = [];
    try {
      const rs: any = await this.requisitionService.getRequisitionOrderItems(this.requisitionId);
      this.modalLoading.hide();
      if (rs.ok) {
        rs.rows.forEach((v: any) => {
          this.genericIds.push(v.generic_id);

          const obj: any = {
            conversion_qty: v.conversion_qty,
            confirm_qty: v.confirm_qty,
            cost: v.cost,
            allowcate_qty: 0,
            from_unit_name: v.from_unit_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            primary_unit_name: v.priamry_unit_name,
            requisition_item_id: v.requisition_item_id,
            requisition_order_id: v.requisition_order_id,
            requisition_qty: v.requisition_qty, // pack
            borrow_qty: 0, // pack
            to_unit_name: v.to_unit_name,
            unit_generic_id: v.unit_generic_id,
            working_code: v.working_code,
            confirmItems: [],
            small_remain_qty: v.remain_qty, // small qty
            small_book_qty: v.book_qty, // small qty
          }
          this.products.push(obj);
        });

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
        this.requisitionWarehouseName = detail ? detail.requisition_warehouse_name : null;
        this.withdrawWarehouseName = detail ? detail.withdraw_warehouse_name : null;
        this.requisitionType = detail ? detail.requisition_type : null;
        this.wmRequisitionId = detail ? detail.wm_requisition : null;

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

  async getConfirmItems() {
    try {
      const rs: any = await this.requisitionService.getOrderConfirmItems(this.confirmId);
      if (rs.ok) {
        const rows = rs.rows;
        rows.forEach(v => {
          let _totalConfirmQty = 0;
          const idx = _.findIndex(this.products, { generic_id: v.generic_id });
          if (idx > -1) {
            const obj: any = {
              confirm_qty: v.confirm_qty,
              conversion_qty: v.conversion_qty,
              wm_product_id: v.wm_product_id,
              generic_id: this.products[idx].generic_id,
              product_name: v.product_name,
              working_code: v.working_code,
              lot_no: v.lot_no,
              small_remain_qty: v.remain_qty,
              pack_remain_qty: v.remain_qty / v.conversion_qty,
              expired_date: v.expired_date,
              from_unit_name: v.from_unit_name,
              to_unit_name: v.to_unit_name,
              cost: v.cost
            }

            if (v.confirm_qty > 0) {
              _totalConfirmQty = v.conversion_qty * v.confirm_qty;
            }

            this.products[idx].confirmItems.push(v);
            this.products[idx].confirm_qty += _totalConfirmQty;
            this.products[idx].small_book_qty -= v.confirm_qty;
          }
        });

      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.alertService.error(error.message);
    }
  }

  async savePay() {
    const isError = false;
    const items = [];

    const generics = [];
    const _productTotalItems = 0;

    this.products.forEach((v: any) => {
      const objx: any = {};
      objx.requisition_qty = v.requisition_qty * v.conversion_qty;
      objx.generic_id = v.generic_id;
      objx.requisition_order_id = v.requisition_order_id;

      let totalConfirmQty = 0;

      v.confirmItems.forEach((x: any) => {
        totalConfirmQty += x.confirm_qty * x.conversion_qty; // base

        const obj: any = {
          confirm_qty: x.confirm_qty * x.conversion_qty, // base
          wm_product_id: x.wm_product_id,
          generic_id: v.generic_id,
          cost: x.cost
        }

        items.push(obj);
      });

      objx.total_confirm_qty = totalConfirmQty;
      generics.push(objx);
    });

    let isErrorTotalConfirm = false;
    generics.forEach(v => {
      if (v.total_confirm_qty < v.requisition_qty) {
        isErrorTotalConfirm = true;
      }
    })

    const isErrorItems = _.uniqBy(items, 'generic_id').length < generics.length;

    const data: any = {};
    data.items = items;
    data.generics = generics;
    this.alertService.confirm('ต้องการบันทึกข้อมูลการจ่ายเวชภัณฑ์ ใช่หรือไม่?')
      .then(() => {
        if (isErrorItems || isErrorTotalConfirm) {
          this.alertService.confirm('มีรายค้างจ่าย ต้องการบันทึกเป็นรายการค้างจ่าย หรือไม่?')
            .then(() => {
              // บันทึกแบบมีค้างจ่าย
              this.saveWithUnPaid(data);
            }).catch(() => {
              // บันทึกแบบไม่มีค้างจ่าย
              this.saveWithOutUnPaid(data);
            });
        } else {
          // บันทึกแบบไม่มีค้างจ่าย
          this.saveWithOutUnPaid(data);
        }
      })
      .catch(() => { });
  }

  async saveWithOutUnPaid(data: any) {
    this.modalLoading.show();
    try {
      const rs = await this.requisitionService.updateOrderConfirmItemsWithOutUnpaid(this.requisitionId, this.confirmId, data.items);
      this.modalLoading.hide();
      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/admin/requisition']);
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async saveWithUnPaid(data: any) {
    this.modalLoading.show();
    try {
      let rs:any = await this.requisitionService.updateOrderConfirmItemsWithUnpaid(this.requisitionId, this.confirmId, data.items, data.generics);
      this.modalLoading.hide();
      if (rs.ok) {
        this.alertService.success();
        this.router.navigate(['/admin/requisition']);
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  removeOrderConfirm() {
    this.alertService.confirm('ต้องการยกเลิกการจ่าย ใบเบิกนี้ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.requisitionService.removeOrderConfirm(this.confirmId);
          this.modalLoading.hide();
          if (rs.ok) {
            this.alertService.success();
            this.router.navigate(['/admin/requisition']);
          } else {
            this.alertService.error(rs.error);
          }
        } catch (error) {
          this.modalLoading.hide();
          this.alertService.error(error.message);
        }
      }).catch(() => {

      });
  }
  removeGeneric(g) {
    const idx = _.findIndex(this.products, { "generic_id": g.generic_id });
    if (idx > -1) {
      this.products.splice(idx, 1);
    }
  }
}
