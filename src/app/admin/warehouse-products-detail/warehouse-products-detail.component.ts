import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';

// import product service
import { ProductsService } from '../products.service'
import { AlertService } from "../../alert.service";
import { WarehouseProductsService } from '../warehouse-products.service';

@Component({
  selector: 'wm-warehouse-products-detail',
  templateUrl: './warehouse-products-detail.component.html',
  styleUrls: ['./warehouse-products-detail.component.css']
})
export class WarehouseProductsDetailComponent implements OnInit {
  warehouseId: any;
  source_warehouseId: any;
  isSaving = false;

  public mask = [/\d/, /\d/, /\d/];

  allProducts = [];
  products = [];
  query: string;
  loading = false;

  myDatePickerOptions: IMyOptions = {
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductsService,
    private warehouseProductService: WarehouseProductsService
  ) {
    this.warehouseId = this.route.snapshot.params['warehouseId'];
  }

  ngOnInit() {
    this.showAllProducts();
    this.showAllProductsInWarehouse();
  }

  showAllProducts() {
    this.loading = true;
    this.productService.listall()
      .then((result: any) => {
        if (result.ok) {
          this.allProducts = result.rows;
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


  showAllProductsInWarehouse() {
    this.loading = true;
    this.productService.getProductWarehouse(this.warehouseId, this.source_warehouseId)
      .then((result: any) => {
        if (result.ok) {
          this.products = result.rows;
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

  addProduct(product) {
    this.products.push(product);
    const idx = _.findIndex(this.allProducts, { product_id: product.product_id });
    if (idx > -1) {
      this.allProducts[idx].is_selected = 'Y';
    }
  }

  removeSelected(g) {
    const idx = _.findIndex(this.products, { product_id: g.product_id });
    if (idx > -1) {
      this.products.splice(idx, 1);
    }

    const idxAll = _.findIndex(this.allProducts, { product_id: g.product_id });
    if (idx > -1) {
      this.allProducts[idxAll].is_selected = 'N';
    }
  }

  doSearch() {
    let timer;
    const that = this;
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (this.query.length > 1) {
        that.ShowsearchAllProducts();
      }

      if (!this.query) {
        that.showAllProducts();
      }

    }, 300);
  }

  async ShowsearchAllProducts() {

    try {
      this.loading = true;
      this.allProducts = [];

      const resp = await this.productService.searchAllProducts(this.query);
      if (resp.ok) {
        this.allProducts = resp.rows;
        this.allProducts.forEach((v, i) => {
          const idx = _.findIndex(this.products, { generic_id: v.generic_id });
          if (idx > -1) {
            this.allProducts[i].is_selected = 'Y';
          }
        })
        this.ref.detectChanges();
      } else {
        this.alertService.error(resp.error);
      }
      this.loading = false;
    } catch (error) {
      console.error(error);
    }
  }

  async saveWarehouseProduct() {
    try {
      this.isSaving = true;
      const resp: any = await this.warehouseProductService.saveWarehouseProducts(this.warehouseId, this.products);
      if (resp.ok) {
        this.alertService.success();
        this.router.navigateByUrl('/admin/warehouse-products');
      } else {
        this.alertService.error(resp.error);
      }
      this.isSaving = false;
    } catch (error) {
      console.error(error);
      this.isSaving = false;
      this.alertService.error(error.message);
    }
  }

  setMin(g, min) {
    // this.products.forEach(s => {
    const idx = _.findIndex(this.products, { product_id: g.product_id });
    if (idx > -1) {
      this.products[idx].min_qty = +min;
    }
    // });
  }

  setMax(g, max) {
    // this.products.forEach+(s => {
    const idx = _.findIndex(this.products, { product_id: g.product_id });
    if (idx > -1) {
      this.products[idx].max_qty = +max;
    }
    // });
  }

}
