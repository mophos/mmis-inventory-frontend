import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';
import { ProductsService } from './../../admin/products.service';

@Component({
  selector: 'wm-product-stock-remain',
  templateUrl: './product-stock-remain.component.html',
  styleUrls: ['./product-stock-remain.component.css']
})
export class ProductStockRemainComponent implements OnInit {
  @Input() productId: any;
  loading = false;
  products = [];

  constructor(
    private productService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.getProductStockRemain();
    // this.getProductList(this.productId);
  }

  async getProductStockRemain() {
    this.loading = true;
    try {
      const rs = await this.productService.getProductStockDetail(this.productId)
      if (rs.ok) {
        this.products = rs.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.loading = false;
    } catch (error) {
      this.loading = false;
      this.alertService.error(error.message); 
    }
  }

}
