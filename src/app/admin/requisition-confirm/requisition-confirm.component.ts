import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { RequisitionService } from 'app/admin/requisition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IRequisitionOrder } from 'app/shared';
import * as moment from 'moment';
import { AlertService } from 'app/alert.service';
import * as uuid from 'uuid/v4';
import * as _ from 'lodash';
import { BorrowNoteService } from '../borrow-note.service';

@Component({
  selector: 'wm-requisition-confirm',
  templateUrl: './requisition-confirm.component.html',
  styles: []
})
export class RequisitionConfirmComponent implements OnInit {

  products: any = [];
  requisitionDate: any = null;
  requisitionId: any = null;
  requisitionCode: any = null;
  requisitionWarehouseName: any = null;
  withdrawWarehouseName: any = null;
  wmRequisitionId: any;

  requisitionType: any = null;
  confirmId: any;
  isVerify = false;

  isEdit = false;
  actionMsg: string = null;

  genericIds: any = [];
  borrowNotes: any = [];
  borrowRequisitions: any = [];
  selectedBorrowNotes: any = [];
  openBorrowNote = false;

  @ViewChild('modalLoading') public modalLoading: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false,
    componentDisabled: true
  };
  constructor(
    private requisitionService: RequisitionService,
    private borrowNoteService: BorrowNoteService,
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService
  ) {

    this.route.queryParams
      // .filter(params => params.order)
      .subscribe(params => {
        this.requisitionId = params.requisitionId;
        this.confirmId = params.confirmId;
        // this.isEdit = params.edit === '1' ? true : false;
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
      this.products[idx].is_minus = event.small_remain_qty - (event.confirm_qty * event.conversion_qty) < 0;
      this.products[idx].confirm_qty = event.confirm_qty;

      if (_idx > -1) {
        this.products[idx].confirmItems[_idx].confirm_qty = event.confirm_qty;
      } else {
        this.products[idx].confirmItems.push(event);
      }

      // calculate new allowcate_qty
      this.products[idx].allowcate_qty = 0;
      this.products[idx].confirmItems.forEach(v => {
        this.products[idx].allowcate_qty += (v.confirm_qty * v.conversion_qty);
      });
    }
  }

  async getOrderItems() {
    this.modalLoading.show();
    this.products = [];
    try {
      const rs: any = await this.requisitionService.getRequisitionOrderItems(this.requisitionId);
      if (rs.ok) {
        for (const v of rs.rows) {
          this.genericIds.push(v.generic_id);
          const obj: any = {
            conversion_qty: v.conversion_qty,
            confirm_qty: v.confirm_qty,
            cost: v.cost,
            allowcate_qty: 0,
            is_minus: false,
            from_unit_name: v.from_unit_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            primary_unit_name: v.priamry_unit_name,
            requisition_item_id: v.requisition_item_id,
            requisition_order_id: v.requisition_order_id,
            requisition_qty: v.requisition_qty,
            borrow_qty: 0, // pack
            to_unit_name: v.to_unit_name,
            unit_generic_id: v.unit_generic_id,
            working_code: v.working_code,
            confirmItems: [],
            remain_qty: v.small_remain_qty, // small qty
          }
          const allocate = await this.requisitionService.getAllocate([{ 'genericId': v.generic_id, 'genericQty': v.requisition_qty * v.conversion_qty }])
          if (allocate.ok) {
            for (const z of allocate.rows) {
              let _obj: any;
              if (z.generic_id === v.generic_id) {
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
                    confirm_qty: Math.floor(z.product_qty / z.conversion_qty),
                    cost: z.cost
                  }
                  if (v.temp_confirm_id) {
                    const rsT: any = await this.requisitionService.getRequisitionConfirmTemp(v.temp_confirm_id);
                    const idx = _.findIndex(rsT.rows, { wm_product_id: z.wm_product_id });
                    if (idx > -1) {
                      _obj.confirm_qty = rsT.rows[idx].confirm_qty / z.conversion_qty;

                      // if (_obj.confirm_qty > z.pay_qty) {
                      //   _obj.remain_qty += (_obj.confirm_qty - z.pay_qty);
                      // } else {
                      //   _obj.remain_qty -= (_obj.confirm_qty - z.pay_qty);
                    }
                  }
                  obj.is_minus = (z.small_remain_qty - +z.product_qty) < 0;
                  obj.allowcate_qty += z.product_qty;
                  obj.confirmItems.push(_obj);
                }
              }
            }
          }
          this.products.push(obj);
        }
        // get borrow note
        await this.getBorrowNotes();
        this.modalLoading.hide();
      } else {
        this.modalLoading.hide();
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  async getBorrowNotes() {
    try {
      this.modalLoading.show();
      const rs: any = await this.requisitionService.getBorrowNotes(this.wmRequisitionId, this.genericIds, this.requisitionId);
      this.modalLoading.hide();
      if (rs.ok) {
        this.borrowNotes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error));
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
      console.log(rs);
      if (rs.ok) {
        const rows = rs.rows;
        rows.forEach(v => {

          const idx = _.findIndex(this.products, { generic_id: v.generic_id });
          if (idx > -1) {
            // const obj: any = {
            //   confirm_qty: v.confirm_qty,
            //   conversion_qty: v.conversion_qty,
            //   wm_product_id: v.wm_product_id,
            //   generic_id: this.products[idx].generic_id
            // }
            this.products[idx].confirmItems.push(v);
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
    // console.log();

    let totalQty = 0;
    let minus = false;
    const items = [];

    const generics = [];
    this.products.forEach((v: any) => {
      const objx: any = {};
      objx.requisition_qty = v.requisition_qty * v.conversion_qty;
      objx.generic_id = v.generic_id;
      objx.requisition_order_id = v.requisition_order_id;

      let totalConfirmQty = 0;

      v.confirmItems.forEach((x: any) => {
        if (x.confirm_qty < 0) {
          minus = true;
        }
        totalQty += x.confirm_qty;
        const _totalConfirmQty = x.confirm_qty * x.conversion_qty;
        totalConfirmQty += _totalConfirmQty;

        const obj: any = {
          confirm_qty: _totalConfirmQty,
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
    if (minus) {
      this.alertService.error('มีรายการจ่ายติดลบ กรุณาตรวจสอบอย่างละเอียด');
    }
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
      const rs = await this.requisitionService.saveOrderConfirmItemsWithOutUnpaid(this.requisitionId, data.items);
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
      const rs = await this.requisitionService.saveOrderConfirmItemsWithUnpaid(this.requisitionId, data.items, data.generics);
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

  // open borrow notes
  showBorrowNotes() {
    this.openBorrowNote = true;
  }

  doCalculateRequisition() {
    this.alertService.confirm('ต้องการปรับยอดการเบิกจากการยืมใหม่  ใช่หรือไม่?')
      .then(async () => {

        const dataBorrow = [];
        const borrowItems = [];
        const data = [];
        const slData: any = _.clone(this.selectedBorrowNotes);

        slData.forEach((v, i) => {
          const idx = _.findIndex(data, { generic_id: v.generic_id });
          if (idx > -1) {
            data[idx].qty += v.qty * v.conversion_qty;
          } else {
            const obj: any = v;
            obj.qty = v.qty * v.conversion_qty;
            data.push(obj);
          }
        });

        this.products.forEach((x, i) => {
          const idx = _.findIndex(data, { generic_id: x.generic_id });
          if (idx > -1) {
            const pQty = this.products[i].requisition_qty * this.products[i].conversion_qty;
            const reqQty = pQty + data[idx].qty;
            // จำนวนที่ยืมไป
            dataBorrow.push({
              requisitionId: this.requisitionId,
              genericId: this.products[i].generic_id,
              requisitionQty: reqQty,
              unitGenericId: this.products[i].unit_generic_id
            });
          }

          // remove selected
          slData.forEach((b, ix) => {
            if (b.generic_id === x.generic_id) {

              const _idx = _.findIndex(dataBorrow, { genericId: b.generic_id });
              if (_idx > -1) {
                const obj: any = {};
                obj.borrowNoteDetailId = b.borrow_note_detail_id;
                obj.requisitionId = dataBorrow[_idx].requisitionId;
                borrowItems.push(obj);
              }

              const idxB = _.findIndex(this.borrowNotes, { borrow_note_detail_id: b.borrow_note_detail_id });
              if (idxB > -1) {
                this.borrowNotes.splice(idxB, 1);
              }
              this.selectedBorrowNotes.splice(ix, 1);
            }
          });
        });
        try {
          this.modalLoading.show();
          const rs: any = await this.borrowNoteService.updateRequisitionBorrow(this.requisitionId, dataBorrow, borrowItems);
          this.modalLoading.hide();

          if (rs.ok) {
            this.alertService.success();
            await this.getOrderItems();
            await this.getBorrowNotes();
          } else {
            this.alertService.error(rs.error);
            this.selectedBorrowNotes = [];
            this.borrowNotes = [];

          }
          this.openBorrowNote = false;

        } catch (error) {
          console.log(error);
          this.alertService.error();
          this.selectedBorrowNotes = [];
          this.borrowNotes = [];
          await this.getOrderItems();
          await this.getBorrowNotes();
          this.openBorrowNote = false;
        }
      }).catch(() => {
        // this.alertService.success();
        // this.router.navigate(['/admin/requisition']);
        this.openBorrowNote = false;
      });

  }
}
