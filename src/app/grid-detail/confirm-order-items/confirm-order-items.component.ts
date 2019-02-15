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
  confirmItems: any = [];
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
    this.confirmItems = value;
    console.log(this.confirmItems);

    // this.getProductList();
  }

  @Input('isEdit')
  set setEdit(value: boolean) {
    this._isEdit = value;
  }

  @ViewChild('loadingModal') loadingModal: LoadingModalComponent;

  loading = false;
  items = [];
  currentTotalSmallQty = 0;

  constructor(private requisitionService: RequisitionService, private alertService: AlertService) {

  }

  ngOnInit() {
  }


  onChangeQty(cmp: any, wmProductId: any) {
    try {
      console.log(wmProductId);
      const idx = _.findIndex(this.confirmItems, { 'wm_product_id': wmProductId });
      console.log(this.confirmItems[idx], idx);

      // ถ้าจำนวนที่คีย์เข้ามามากว่าจำนวนคงเหลือ ให้ใช้จำนวนคงเหลือเป็นยอดยืนยัน
      if (this.confirmItems[idx].pack_remain_qty < cmp.value) {
        cmp.value = this.confirmItems[idx].pack_remain_qty;
      }
      this.confirmItems[idx].confirm_qty = +cmp.value;
      this.confirmItems[idx].total_small_qty = (+cmp.value * +this.confirmItems[idx].conversion_qty);

      this.onSuccessConfirm.emit(this.confirmItems[idx]);
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
