import { ProductDetailComponent } from './../../grid-detail/product-detail/product-detail.component';
import { Component, OnInit } from '@angular/core';
import { ProductsService } from './../products.service'
import { AlertService } from '../../alert.service';

@Component({
  selector: 'wm-code-mapping',
  templateUrl: './code-mapping.component.html',
  styles: []
})
export class CodeMappingComponent implements OnInit {

  product: any;

  constructor(
    private productsService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getAllProduct();
  }

  async getAllProduct() {
    try {
      const rs: any = await this.productsService.getAllProduct();
      this.product = rs.rows;
    } catch (error) {
      this.alertService.error(error.message);
    }
    console.log(this.product);
  }

}
