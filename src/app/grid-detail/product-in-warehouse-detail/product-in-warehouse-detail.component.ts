import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { AlertService } from './../../alert.service';
import { ProductsService } from './../../admin/products.service';

@Component({
  selector: 'wm-product-in-warehouse-detail',
  templateUrl: './product-in-warehouse-detail.component.html',
  styleUrls: ['./product-in-warehouse-detail.component.css']
})
export class ProductInWarehouseDetailComponent implements OnInit {
  @Input() warehouseId: any;
  @Input() source_warehouseId: any;
  loading = false;
  productsdetail = [];

  constructor(
    private ref: ChangeDetectorRef,
    private productService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loading = true;
    this.showAllProductsInWarehouse();
    // this.getProductList(this.warehouseId);
  }

  showAllProductsInWarehouse() {
    this.loading = true;
    this.productService.getProductWarehouse(this.warehouseId, this.source_warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.productsdetail = result.rows;
          this.ref.detectChanges();
        } else {
          this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
        }
        this.loading = false;
      })
      .catch(() => {
        this.loading = false;
        this.alertService.serverError();
      });
  }

}
