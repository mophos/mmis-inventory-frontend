import { Component, OnInit, Output, EventEmitter, Input, ViewChild } from '@angular/core';

import { AlertService } from 'app/alert.service';
import { BasicService } from './../../basic.service';

@Component({
  selector: 'wm-modal-search-requisition',
  templateUrl: './modal-search-requisition.component.html',
  styles: []
})
export class ModalSearchRequisitionComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public wmRequisition: any;

  requisitions: any = [];
  selectedRequisitionItem: any = [];
  requisitionDetail: any = [];
  products: any = [];
  openDetail = false;
  open = false;
  selectedRequisition: any;

  constructor(
    private basicService: BasicService,
    private alertService: AlertService
  ) { }

  ngOnInit() { }

  async getSuccessRequisitionList() {
    this.modalLoading.show();
    try {
      const rs: any = await this.basicService.getRequisitionSuccess(this.wmRequisition);
      if (rs.ok) {
        this.requisitions = rs.rows;
      } else {
        this.alertService.error(JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  setSelected(idx) {
    this.selectedRequisition = this.requisitions[idx];
    this.getRequisitionProducts(this.requisitions[idx].requisition_id);
    this.open = false;
    this.openDetail = true;
  }

  async getRequisitionProducts(requisitionId) {
    this.modalLoading.show();
      this.requisitionDetail = [];
      try {
        const rs: any = await this.basicService.getRequisitionSucessDetail(requisitionId);
        if (rs.ok) {
          this.requisitionDetail = rs.rows;
        } else {
          this.alertService.error(JSON.stringify(rs.error));
        }
        this.modalLoading.hide();
      } catch (error) {
        this.modalLoading.hide();
        this.alertService.error(error.message);
      }
  }

  addRequisitionProduct() {
    this.products = [];
    this.selectedRequisitionItem.forEach((v: any) => {
      const product: any = {};
      product.product_id = v.product_id;
      product.product_name = v.product_name;
      product.requisition_qty = v.requisition_qty;
      product.lot_no = v.lot_no;
      product.generic_id = v.generic_id;
      product.generic_name = v.generic_name;
      product.unit_generic_id = v.unit_generic_id;
      product.expired_date = v.expired_date;
      this.products.push(product);
    });

    const objSelected: any = {};
    objSelected.requisition = this.selectedRequisition;
    objSelected.products = this.products;

    this.onSelect.emit(objSelected);
    this.openDetail = false;
  }

  openModal() {
    this.getSuccessRequisitionList();
    this.open = true;
  }

  closeModal() {
    this.onClose.emit();
    this.open = false;
  }

}
