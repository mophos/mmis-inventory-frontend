import { Component, OnInit, Input, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ReceiveService } from 'app/admin/receive.service';
import { AlertService } from 'app/alert.service';

@Component({
  selector: 'wm-purchase-detail',
  templateUrl: './purchase-detail.component.html',
  styles: []
})
export class PurchaseDetailComponent implements OnInit {

  @Input() public purchaseId: any;

  productPurchases = [];
  loading = false;

  constructor(
    private receiveService: ReceiveService,
    private alertService: AlertService) { }

  ngOnInit() {
    this.getPurchaseProducts(this.purchaseId);
  }

  async getPurchaseProducts(purchaseOrderId: any) {
    // clear old products
    this.productPurchases = [];
    this.loading = true;
    try {
      const res: any = await this.receiveService.getPurchaseProductsList(purchaseOrderId);
      if (res.ok) {
        this.productPurchases = res.rows;
      } else {
        this.alertService.error(res.error);
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}
