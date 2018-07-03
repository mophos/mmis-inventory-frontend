import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ProductsService } from '../../admin/products.service';


import { AlertService } from '../../alert.service';


@Component({
  selector: 'wm-view-product-remain',
  templateUrl: './view-product-remain.component.html',
  styleUrls: ['./view-product-remain.component.css']
})
export class ViewProductRemainComponent implements OnInit {
  @Input() public productId: any;
  @Input() public warehouseId: any;
  loading = false;

  products: any[] = [];
  product_remain_qty: any;

  constructor(
    private alertService: AlertService,
    private productsService: ProductsService
  ) { }

  ngOnInit() {
    if (this.warehouseId && this.productId) {
      this.getProductList();
    }
  }

  getProductList() {
    this.productsService.getWarehouseProductRemain(this.warehouseId, this.productId)
      .then((result: any) => {
        this.loading = false;
        if (result.ok) {
          if (result.rows[0]) {
            this.product_remain_qty = result.rows[0].remain_qty || 0;
          }
        } else {
          console.log("ตรงนี้ Error");
          console.log(result.error);
          this.alertService.error(JSON.stringify(result.error));
        }
      })
      .catch(error => {
        this.alertService.error(error.message);
      });
  }

}
