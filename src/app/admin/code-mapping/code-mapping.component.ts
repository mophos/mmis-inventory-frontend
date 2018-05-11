import { async } from '@angular/core/testing';
import { log } from 'util';
import { ProductDetailComponent } from './../../grid-detail/product-detail/product-detail.component';
import { Component, OnInit, Inject, Output, Input, EventEmitter, ViewChild, Directive } from '@angular/core';
import { ProductsService } from './../products.service'
import { AlertService } from '../../alert.service';
import * as _ from 'lodash';

@Component({
  selector: 'wm-code-mapping',
  templateUrl: './code-mapping.component.html',
  styles: []
})
export class CodeMappingComponent implements OnInit {
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('searchTMT') public searchTMT: any;

  product: any;
  productUpdate: any = [];

  constructor(
    private productsService: ProductsService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getAllProduct();
  }

  async getAllProduct() {
    this.modalLoading.show();
    try {
      const rs: any = await this.productsService.getAllProduct();
      this.product = rs.rows;
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  changeSearchProduct(event, tmt) {
    // console.log(event, 'event');
    // console.log(tmt, 'tmt');
  }

  setSelectedProduct(event, m) {
    const product = {
      working_code: m.working_code,
      product_id: m.product_id,
      tmt_id: event.TMTID
    }

    const idDup = _.findIndex(this.productUpdate, { 'product_id': m.product_id });
    if (idDup > -1) {
      this.productUpdate[idDup] = product;
    } else {
      this.productUpdate.push(product);
    }

    const idx = _.findIndex(this.product, { 'product_id': m.product_id });
    if (idx > -1) {
      this.product[idx].FSN = event.FSN;
    }
  }

  async save() {
    console.log(this.productUpdate, 'productUpdate');
    this.modalLoading.show();
    try {
      const rs = await this.productsService.updateTMT(this.productUpdate)
      this.modalLoading.hide();
      if (rs.ok) {
        this.alertService.success();
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
}
