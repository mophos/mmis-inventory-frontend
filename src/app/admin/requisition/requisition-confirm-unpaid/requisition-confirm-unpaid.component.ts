import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { RequisitionService } from 'app/admin/requisition.service';
import { ActivatedRoute, Router } from '@angular/router';
import { IRequisitionOrder } from 'app/shared';
import * as moment from 'moment';
import { AlertService } from 'app/alert.service';
import * as uuid from 'uuid/v4';
import * as _ from 'lodash';
import { AccessCheck } from 'app/access-check';

@Component({
  selector: 'wm-requisition-confirm-unpaid',
  templateUrl: './requisition-confirm-unpaid.component.html',
  styles: []
})
export class RequisitionConfirmUnpaidComponent implements OnInit {

  products: any = [];
  requisitionDate: any = null;
  requisitionId: any = null;
  requisitionCode: any = null;
  requisitionWarehouseName: any = null;
  withdrawWarehouseName: any = null;
  requisitionType: any = null;
  isVerify: boolean = false;

  unpaidId: any = null;

  confirmId: any = null;

  isEdit: boolean = false;
  actionMsg: string = null;

  isConfirm: any;
  openModalConfirm: boolean = false
  confirmApprove: boolean = false
  tmpOderApprove: any
  username: any
  password: any

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
    private route: ActivatedRoute,
    private router: Router,
    private alertService: AlertService,
    private accessCheck: AccessCheck,
  ) {

    this.route.queryParams
      // .filter(params => params.order)
      .subscribe(params => {
        this.requisitionId = params.requisitionId;
        this.unpaidId = params.unpaidId;
        // this.isEdit = params.edit === '1' ? true : false;
      });
  }

  async ngOnInit() {
    await this.getOrderDetail();
    await this.getOrderItems();
  }

  onSuccessConfirm(event: any, idx: any) {
    console.log(event)
    let obj: any = {
      confirm_qty: event.confirm_qty,
      conversion_qty: event.conversion_qty,
      wm_product_id: event.wm_product_id,
      generic_id: this.products[idx].generic_id
    }

    let _idx = _.findIndex(this.products[idx].confirmItems, { wm_product_id: obj.wm_product_id });

    if (_idx > -1) {
      this.products[idx].confirmItems[_idx].confirm_qty = obj.confirm_qty;
    } else {
      this.products[idx].confirmItems.push(obj);
    }
  }

  async getOrderItems() {
    this.modalLoading.show();
    this.products = [];
    try {
      let rs: any = await this.requisitionService.getRequisitionOrderUnpaidItems(this.unpaidId);
      this.modalLoading.hide();
      if (rs.ok) {
        rs.rows.forEach((v: any) => {
          let obj: any = {
            conversion_qty: v.conversion_qty,
            unpaid_qty: v.unpaid_qty,
            cost: v.cost,
            from_unit_name: v.from_unit_name,
            generic_id: v.generic_id,
            generic_name: v.generic_name,
            primary_unit_name: v.priamry_unit_name,
            requisition_item_id: v.requisition_item_id,
            requisition_order_id: v.requisition_order_id,
            requisition_qty: v.requisition_qty,
            to_unit_name: v.to_unit_name,
            // to_unit_qty: v.to_unit_qty,
            unit_generic_id: v.unit_generic_id,
            working_code: v.working_code,
            confirmItems: []
          }

          this.products.push(obj);
        })
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
        this.requisitionWarehouseName = detail ? detail.requisition_warehouse_name : null;
        this.withdrawWarehouseName = detail ? detail.withdraw_warehouse_name : null;
        this.requisitionType = detail ? detail.requisition_type : null;

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

  async savePay() {
    let totalQty = 0;
    let items = [];

    this.products.forEach((v: any) => {
      v.confirmItems.forEach((x: any) => {
        totalQty += x.confirm_qty;
        let obj: any = {
          confirm_qty: (x.confirm_qty * x.conversion_qty),
          wm_product_id: x.wm_product_id,
          generic_id: v.generic_id
        }
        items.push(obj);
      });
    });

    if (totalQty) {
      this.modalLoading.show();
      try {
        const rs: any = await this.requisitionService.saveUnpaidConfirm(this.unpaidId, this.requisitionId, items);

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
    } else {
      this.alertService.error('กรุณาระบุจำนวนสินค้าที่ต้องการจ่าย');
    }
  }

  async approveRequisitionCheck() {
    if (this.accessCheck.can('WM_REQUISITION_APPROVE')) {
      this.savePay();
    } else {
      this.openModalConfirm = true
    }
  }

  async checkApprove(username: any, password: any) {
    const rs: any = await this.requisitionService.checkApprove(username, password, 'WM_REQUSITTION');
    if (rs.ok) {
      this.savePay();
      this.openModalConfirm = false
    } else {
      this.alertService.error('ไม่มีสิทธิ์อนุมัติ รายการเบิกสินค้า');
    }
  }

  close() {
    this.openModalConfirm = false
    this.username = ''
    this.password = ''
  }

  removeOrderConfirm() {
    this.alertService.confirm('ต้องการยกเลิกการจ่าย ใบเบิกนี้ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          let rs: any = await this.requisitionService.removeOrderConfirm(this.confirmId);
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
}
