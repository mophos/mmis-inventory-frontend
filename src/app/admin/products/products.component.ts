import { ProductsService } from './../products.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { State } from '@clr/angular';

@Component({
  selector: 'wm-products',
  templateUrl: './products.component.html',
  styleUrls: []
})
export class ProductsComponent implements OnInit {
  products = [];
  genericTypes = [];
  genericType: any = "";
  loading = false;
  totalProducts = 0;
  perPage = 20;
  isSearching = false;

  query: any;

  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;

  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    @Inject('API_URL') private apiUrl: string,
  ) {

  }

  ngOnInit() {
    this.getGenericType();
  }

  search(event) {
    if (event.keyCode === 13) {
      if (this.query) {
        this.doSearch();
      } else {
        this.getAllProducts();
      }
    }
  }

  async doSearch() {
    try {
      this.modalLoading.show();
      const rs = await this.productService.search(this.query, this.genericType, this.perPage, 0);
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = rs.total;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
    }
  }

  async getAllProducts() {
    this.modalLoading.show();
    try {
      const rs = await this.productService.all(this.genericType, this.perPage, 0);

      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = rs.total;
      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
      this.alertService.serverError();
    }
  }

  async refresh(state: State) {
    this.modalLoading.show();
    const offset = +state.page.from;
    const limit = +state.page.size;

    try {
      let rs: any;
      if (this.query) {
        rs = await this.productService.search(this.query, this.genericType, limit, offset);
      } else {
        rs = await this.productService.all(this.genericType, limit, offset);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = rs.total;
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
      console.log(error.message);
    }
  }

  showStockCard(p: any) {
    const url = `${this.apiUrl}/report/product/balance/${p.product_id}`;
    this.htmlPreview.showReport(url);
  }

  async getGenericType() {
    try {
      // this.modalLoading.show();
      const rs = await this.productService.getGenericType();

      if (rs.ok) {
        this.genericTypes = rs.rows;
        this.genericType = rs.rows.length === 1 ? rs.rows[0].generic_type_id : "";
      } else {
        this.alertService.error(rs.error);
      }

      // this.modalLoading.hide();
    } catch (error) {
      // this.modalLoading.hide();
      console.log(error);
      this.alertService.serverError();
    }
  }

  async changeGenericType() {
    try {
      this.modalLoading.show();
      let rs: any;
      if (this.query) {
        rs = await this.productService.search(this.query, this.genericType, this.perPage, 0);
      } else {
        rs = await this.productService.all(this.genericType, this.perPage, 0);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = rs.total;
      } else {
        this.alertService.error(rs.error);
      }

    } catch (error) {
      this.modalLoading.hide();
      this.alertService.serverError();
      console.log(error.message);
    }
  }

}
