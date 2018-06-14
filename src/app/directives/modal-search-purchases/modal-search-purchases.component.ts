import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { ReceiveService } from './../../admin/receive.service';
import { AlertService } from './../../alert.service';
import { LoadingModalComponent } from '../../modals/loading-modal/loading-modal.component';

@Component({
  selector: 'wm-modal-search-purchases',
  templateUrl: './modal-search-purchases.component.html',
  styleUrls: []
})
export class ModalSearchPurchasesComponent implements OnInit {
  @Output('onClose') onClose: EventEmitter<any> = new EventEmitter<any>();
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Input() public labelerType: any;

  @ViewChild('mdlLoading') mdlLoading: LoadingModalComponent;

  purchases: any = [];
  selectedPurchase: any;
  selectedPurchaseId: any;
  loading = false;

  productPurchases = [];
  selectedPurchaseItem = [];

  products = [];

  open = false;
  openConflict = false;

  perPage = 20;
  offset = 0;
  query: string = '';
  sort: any;

  constructor(private receiveService: ReceiveService, private alertService: AlertService) { }

  ngOnInit() {

  }

  async getPurchaseList() {
    this.mdlLoading.show();
    try {
      const res: any = await this.receiveService.getPurchasesList();
      this.mdlLoading.hide();
      if (res.ok) {
        this.purchases = res.rows;
      } else {
        this.alertService.error(res.error);
      }
    } catch (error) {
      this.mdlLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async enterSearch(event: any) {
    if (event.keyCode === 13) {
      this.query = event.target.value;
      if (this.query) {
        const rs = await this.receiveService.searchPurchasesList(this.query, this.perPage, this.offset, {});
        console.log(rs)
        this.purchases = rs.rows;
      }
    } else if (this.query === '') {
      const rs = await this.receiveService.getPurchasesList();
      this.purchases = rs.rows;
    }
  }

  openModal() {
    this.getPurchaseList();
    this.open = true;
    this.query = '';
  }

  closeModal() {
    this.open = false;
    this.onClose.emit();
    this.query = '';
  }

  setSelected(purchase: any) {
    // this.onSelect.emit(this.purchases[idx]);
    this.selectedPurchase = purchase;
    this.getPurchaseProducts(purchase.purchase_order_id);
    this.open = false;
    this.openConflict = true;
  }

  async getPurchaseProducts(purchaseOrderId: any) {
    // clear old products
    this.productPurchases = [];
    this.selectedPurchaseId = purchaseOrderId;
    this.mdlLoading.show();
    try {
      const res: any = await this.receiveService.getPurchaseProductsList(purchaseOrderId);
      this.mdlLoading.hide();
      if (res.ok) {
        res.rows.forEach((v: any) => {
          if ((+v.purchase_qty - +v.total_received_qty) > 0) {
            const obj: any = {};

            obj.product_id = v.product_id;
            obj.product_name = v.product_name;
            obj.receive_qty = +v.purchase_qty - +v.total_received_qty;
            // obj.primary_unit_id = +v.base_unit_id;
            // obj.primary_unit_name = v.base_unit_name;
            obj.to_unit_name = v.to_unit_name;
            obj.lot_no = v.lot_no;
            obj.generic_id = v.generic_id;
            obj.generic_name = v.generic_name;
            obj.working_code = v.working_code;
            obj.is_lot_control = v.is_lot_control;
            // vendor
            obj.manufacture_id = v.m_labeler_id;
            obj.manufacture_name = v.m_labeler_name;

            // warehouses
            obj.warehouse_id = null;
            obj.warehouse_name = null;

            // location
            obj.location_id = null;
            obj.location_name = null;

            obj.unit_generic_id = +v.unit_generic_id;
            // obj.unit_name = v.base_unit_name;
            // obj.unit_id = v.from_unit_id;
            obj.conversion_qty = +v.conversion_qty;

            obj.purchase_qty = +v.purchase_qty;
            obj.total_received_qty = +v.total_received_qty;
            obj.canReceive = +v.purchase_qty - +v.total_received_qty;

            obj.expired_date = v.expired_date;
            obj.cost = v.cost;

            // ของแถม
            obj.is_free = v.giveaway === 'Y' ? 'Y' : 'N';

            this.productPurchases.push(obj);
          }
        });

      }
    } catch (error) {
      this.mdlLoading.hide();
      console.log(error);
      this.alertService.error(error.message);
    }
  }

  addPurchaseProduct() {
    this.products = [];
    this.selectedPurchaseItem.forEach((v: any) => {
      const product: any = {};
      product.product_id = v.product_id;
      product.product_name = v.product_name;
      product.receive_qty = v.receive_qty;
      // product.primary_unit_id = v.primary_unit_id;
      product.to_unit_name = v.to_unit_name;
      product.lot_no = null;
      product.generic_id = v.generic_id;
      product.canReceive = v.canReceive;
      product.discount = 0;
      product.is_lot_control = v.is_lot_control;
      // vendor
      product.manufacture_id = v.manufacture_id;
      product.manufacture_name = v.manufacture_name;

      // warehouses
      product.warehouse_id = null;
      product.warehouse_name = null;

      // location
      product.location_id = null;
      product.location_name = null;

      product.unit_generic_id = v.unit_generic_id;
      // product.unit_name = v.to_unit_name;
      // product.unit_id = v.unit_id;
      product.conversion_qty = +v.conversion_qty;

      product.expired_date = null;
      product.cost = v.cost;

      // ของแถม
      product.is_free = v.is_free;

      this.products.push(product);

    });

    const objSelected: any = {};
    objSelected.purchase = this.selectedPurchase;
    objSelected.products = this.products;

    this.onSelect.emit(objSelected);
    this.openConflict = false;
  }

  closePurchase() {
    this.alertService.confirm('ต้องการเปลี่ยนสถานะใบสั่งซื้อนี้เป็น เสร็จสมบูรณ์ (ปิดรับ) ใช่หรือไม่? กรุณาตรวจสอบรายการรับที่ยังไม่อนุมัติรับเข้าคลังเพื่อความถูกต้อง')
      .then(() => {
        this.mdlLoading.show();
        this.receiveService.updatePurchaseCompleted(this.selectedPurchaseId)
          .then((res: any) => {
            if (res.ok) {
              this.alertService.success();
              this.openConflict = false;
            } else {
              this.alertService.error(res.error);
            }

            this.mdlLoading.hide();
          })
          .catch((error: any) => {
            this.mdlLoading.hide();
            this.alertService.error(JSON.stringify(error));
          })
      })
      .catch(() => {

      });
  }

}
