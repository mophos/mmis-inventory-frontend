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
    // this.getProductList();
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
    this.getProductList();
  }

  async getProductList() {
    try {
      this.items = _.clone(this._confirmItems);
      if (this.items.length) {
        this.onSuccessConfirm.emit(this.items[0]);
      }
      this.calTotal();
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
    this.loading = false;
  }

}
