import { AlertService } from './../../alert.service';
import { ReceiveService } from './../../admin/receive.service';
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'wm-product-detail',
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  @Input() receiveId: any;
  loading = false;
  products = [];

  constructor(private receiveService: ReceiveService, private alertService: AlertService) { }

  ngOnInit() {
    this.getProductList(this.receiveId);
  }

  async getProductList(receiveId) {
    this.loading = true;
    try {
      const result: any = await this.receiveService.getReceiveProducts(receiveId);
      this.loading = false;
      if (result.ok) {
        this.products = result.rows;
      } else {
        console.log(result.error);
        this.alertService.error();
      }
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message);
    }
  }

}
