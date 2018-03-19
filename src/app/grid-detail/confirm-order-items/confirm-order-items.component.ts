import { Component, OnInit, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { RequisitionService } from 'app/admin/requisition.service';
import { AlertService } from 'app/alert.service';
import { LoadingModalComponent } from 'app/modals/loading-modal/loading-modal.component';
import * as _ from 'lodash';

@Component({
  selector: 'wm-confirm-order-items',
  templateUrl: './confirm-order-items.component.html',
  styles: []
})
export class ConfirmOrderItemsComponent implements OnInit {

  _confirmId: any;
  _isEdit = false;
  _confirmItems: any = [];
  _baseUnitName: any;

  @Output('onSuccessConfirm') onSuccessConfirm: EventEmitter<any> = new EventEmitter<any>();

  @Input() requisitionId: any;
  @Input() genericId: any;
  @Input() requisitionQty: number; // จำนวนขอเบิกทั้งหมด หน่วยเป็น package
  // @Input() totalSmallQty: number; // หน่วยย่อยทั้งหมด
  @Input('baseUnitName')
  set setBaseUnitName(value: any) {
    this._baseUnitName = value;
  }

  @Input('confirmId')
  set setConfirmId(value: any) {
    this._confirmId = value;
  }


  @Input('confirmItems')
  set setConfirmItems(value: any) {
    this._confirmItems = value;
    this.getProductList();
  }

  @Input('isEdit')
  set setEdit(value: boolean) {
    this._isEdit = value;
    console.log(value);
  }

  @ViewChild('loadingModal') loadingModal: LoadingModalComponent;

  loading = false;
  items = [];
  currentTotalSmallQty = 0;

  constructor(private requisitionService: RequisitionService, private alertService: AlertService) {

  }

  ngOnInit() {
    this.loading = true;
    // this.getProductList();
    this.currentTotalSmallQty = 0;
  }

  async getProductList() {

    try {
      let rs: any;
      if (this._isEdit) {
        rs = await this.requisitionService.getEditRequisitionOrderProductItems(this._confirmId, this.genericId);
      } else {
        rs = await this.requisitionService.getRequisitionOrderProductItems(this.genericId);
      }

      this.loading = false;
      this.items = [];
      if (rs.ok) {
        let _items = rs.rows;

        _items.forEach((v: any) => {
          let _idx = _.findIndex(this._confirmItems, { wm_product_id: v.wm_product_id });

          let obj: any = {};
          obj.wm_product_id = v.wm_product_id;
          obj.conversion_qty = +v.conversion_qty;
          obj.expired_date = v.expired_date;
          obj.from_unit_name = v.from_unit_name;
          obj.generic_id = v.generic_id;
          obj.lot_no = v.lot_no;
          obj.product_name = v.product_name;
          obj.remain_qty = +v.remain_qty; // pack
          obj.to_unit_name = v.to_unit_name;
          obj.unit_generic_id = v.unit_generic_id;

          obj.book_qty = v.book_qty; // pack

          if (_idx > -1) {
            obj.confirm_qty = +this._confirmItems[_idx].confirm_qty; // pack
          } else {
            // allowcate
            obj.confirm_qty = 0;
          }

          obj.remain_small_qty = (obj.remain_qty - obj.book_qty) * obj.conversion_qty; // base
          obj.total_small_qty = +obj.confirm_qty * +obj.conversion_qty;

          this.items.push(obj);
        });

        if (this.items.length) {
          this.onSuccessConfirm.emit(this.items[0]);
        }

        this.calTotal();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

  onChangeQty(cmp: any, idx: any) {
    try {
      // ถ้าจำนวนที่คีย์เข้ามามากว่าจำนวนคงเหลือ ให้ใช้จำนวนคงเหลือเป็นยอดยืนยัน
      // if (this.items[idx].remain_qty < cmp.value) {
      //   cmp.value = this.items[idx].remain_qty;
      // }

      this.items[idx].confirm_qty = +cmp.value;
      this.items[idx].total_small_qty = (+cmp.value * +this.items[idx].conversion_qty);

      this.onSuccessConfirm.emit(this.items[idx]);
      // นับยอดยืนยัน
      this.calTotal();
    } catch (error) {
      console.error(error);
    }
  }

  calTotal() {
    this.currentTotalSmallQty = 0;

    this.items.forEach((v: any) => {
      this.currentTotalSmallQty += (+v.confirm_qty * +v.conversion_qty);
    });
  }

}
