import { PeriodService } from 'app/period.service';
import { ToolsService } from './../../tools.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { RequisitionService } from 'app/admin/requisition.service';
import { AlertService } from 'app/alert.service';
import { IRequisitionOrder } from 'app/shared';
@Component({
  selector: 'wm-stockcard-requisition',
  templateUrl: './stockcard-requisition.component.html',
  styles: []
})
export class StockcardRequisitionComponent implements OnInit {


  @ViewChild('modalLoading') public modalLoading: any;

  products: any = [];
  requisitionDate: any = null;
  requisitionId: any = null;
  requisitionCode: any = null;
  requisitionWarehouseName: any = null;
  withdrawWarehouseName: any = null;
  requisitionWarehouseId: any;
  withdrawWarehouseId: any;
  wmRequisitionId: any;

  requisitionType: any = null;
  confirmId: any;

  genericIds: any = [];
  checkEnterPass = true;
  password: any;
  passwordModal = false;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  isSave = false;
  constructor(
    private requisitionService: RequisitionService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private toolsService: ToolsService,
    private periodService: PeriodService
  ) {

    this.route.queryParams
      .subscribe(params => {
        this.requisitionId = params.requisitionId;
        this.confirmId = params.confirmId;
      });
  }

  async ngOnInit() {
    await this.getOrderDetail();
    await this.getOrderItems();
    await this.getConfirmItems();

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
          console.log(v);

          const obj: any = {
            conversion_qty: v.conversion_qty,
            confirm_qty: v.confirm_qty,
            cost: v.cost,
            allowcate_qty: 0,
            from_unit_name: v.from_unit_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            primary_unit_name: v.priamry_unit_name,
            requisition_item_id: v.requisition_order_item_id,
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
          obj.confirm_qty = 0;
          obj.confirmItems.forEach(c => {
            obj.confirm_qty += (c.confirm_qty * c.conversion_qty);
          });
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
        this.requisitionWarehouseId = detail ? detail.wm_requisition : null;
        this.requisitionWarehouseName = detail ? detail.requisition_warehouse_name : null;
        this.withdrawWarehouseId = detail ? detail.wm_withdraw : null;
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
          if (idx > -1 && v.confirm_qty > 0) {
            const obj: any = {
              confirm_qty: v.confirm_qty,
              confirm_qty_old: v.confirm_qty,
              conversion_qty: v.conversion_qty,
              conversion_qty_old: v.conversion_qty,
              wm_product_id: v.wm_product_id,
              generic_id: this.products[idx].generic_id,
              product_name: v.product_name,
              product_id: v.product_id,
              working_code: v.working_code,
              lot_no: v.lot_no,
              small_remain_qty: v.remain_qty,
              pack_remain_qty: v.remain_qty / v.conversion_qty,
              expired_date: v.expired_date,
              from_unit_name: v.from_unit_name,
              to_unit_name: v.to_unit_name,
              unit_generic_id: v.unit_generic_id,
              cost: v.cost
            }

            if (v.confirm_qty > 0) {
              _totalConfirmQty = v.conversion_qty * v.confirm_qty;
            }

            this.products[idx].confirmItems.push(obj);
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

  editChangeRequisitionQty(genericId, qty) {
    const idx = _.findIndex(this.products, { 'generic_id': genericId });
    if (idx > -1) {
      this.products[idx].requisition_qty = qty;
    }

  }
  // async savePay() {
  //   const isError = false;
  //   const items = [];

  //   const generics = [];
  //   const _productTotalItems = 0;

  //   this.products.forEach((v: any) => {
  //     const objx: any = {};
  //     objx.requisition_qty = v.requisition_qty * v.conversion_qty;
  //     objx.generic_id = v.generic_id;
  //     objx.requisition_order_id = v.requisition_order_id;

  //     let totalConfirmQty = 0;

  //     v.confirmItems.forEach((x: any) => {
  //       totalConfirmQty += x.confirm_qty * x.conversion_qty; // base

  //       const obj: any = {
  //         confirm_qty: x.confirm_qty * x.conversion_qty, // base
  //         wm_product_id: x.wm_product_id,
  //         generic_id: v.generic_id
  //       }

  //       items.push(obj);
  //     });

  //     objx.total_confirm_qty = totalConfirmQty;
  //     generics.push(objx);
  //   });

  //   let isErrorTotalConfirm = false;
  //   generics.forEach(v => {
  //     if (v.total_confirm_qty < v.requisition_qty) {
  //       isErrorTotalConfirm = true;
  //     }
  //   })

  //   const isErrorItems = _.uniqBy(items, 'generic_id').length < generics.length;

  //   const data: any = {};
  //   data.items = items;
  //   data.generics = generics;
  //   this.alertService.confirm('ต้องการบันทึกข้อมูลการจ่ายเวชภัณฑ์ ใช่หรือไม่?')
  //     .then(() => {
  //       if (isErrorItems || isErrorTotalConfirm) {
  //         this.alertService.confirm('มีรายค้างจ่าย ต้องการบันทึกเป็นรายการค้างจ่าย หรือไม่?')
  //           .then(() => {
  //             // บันทึกแบบมีค้างจ่าย
  //             this.saveWithUnPaid(data);
  //           }).catch(() => {
  //             // บันทึกแบบไม่มีค้างจ่าย
  //             this.saveWithOutUnPaid(data);
  //           });
  //       } else {
  //         // บันทึกแบบไม่มีค้างจ่าย
  //         this.saveWithOutUnPaid(data);
  //       }
  //     })
  //     .catch(() => { });
  // }


  enterSave(e) {
    if (e.keyCode === 13 && this.password) {
      if (this.checkEnterPass) {
        this.save();
      }
      this.checkEnterPass = !this.checkEnterPass;
    }
  }

  editChangeUnit(genericId, e) {
    console.log(e);
    const idx = _.findIndex(this.products, { "generic_id": genericId });
    if (idx > -1) {
      this.products[idx].unit_generic_id = e.unit_generic_id;
      this.products[idx].conversion_qty = e.qty;
      this.products[idx].to_unit_name = e.to_unit_name;
      this.products[idx].to_unit_name = e.to_unit_name;
      this.products[idx].from_unit_name = e.from_unit_name;
      console.log(this.products[idx]);

    }
  }

  async save() {
    try {
      if (this.password) {
        const rsC = await this.toolsService.checkPassword(this.password);
        if (rsC.ok) {
          this.modalLoading.show();
          this.isSave = true;
          const _requisitionDate = this.requisitionDate ?
            `${this.requisitionDate.date.year}-${this.requisitionDate.date.month}-${this.requisitionDate.date.day}` : null;
          const rsP = await this.periodService.getStatus(_requisitionDate)
          if (rsP.rows[0].status_close === 'Y') {
            this.alertService.error('ปิดรอบบัญชีแล้ว ไม่สามารถแก้ไข stockcard ได้');
            this.isSave = false;
          } else {
            const summary = {
              withdrawWarehouseId: this.withdrawWarehouseId,
              requisitionWarehouseId: this.requisitionWarehouseId,
              requisition_date: _requisitionDate
            }
            const rs: any = await this.toolsService.saveRequisition(this.requisitionId, this.confirmId, summary, this.products);
            if (rs.ok) {
              this.modalLoading.hide();
              this.router.navigate(['admin/tools/stockcard']);
              this.isSave = false;
            } else {
              this.isSave = false;
              this.modalLoading.hide();
              this.alertService.error(JSON.stringify(rs.error));
            }
          }
        } else {
          this.isSave = false;
          this.modalLoading.hide();
          this.passwordModal = false;
          this.alertService.error('รหัสผ่านผิดพลาด');
        }
      } else {
        this.isSave = false;
        this.modalLoading.hide();
        this.alertService.error('ยังไม่ได้ระบุรหัสผ่าน');
      }

    } catch (error) {
      this.alertService.error(error);
    }
  }
}
