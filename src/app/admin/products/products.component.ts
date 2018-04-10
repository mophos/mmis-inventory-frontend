import { ProductsService } from './../products.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { JwtHelper } from 'angular2-jwt';
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
  token: any;
  genericTypeIds = [];
  query: any;
  currentPage = 1;
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('pagination') pagination: any;
  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    @Inject('API_URL') private apiUrl: string,
  ) {
    this.token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];
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
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      const rs = await this.productService.search(this.query, _genericType, this.perPage, 0);
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
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      const rs = await this.productService.all(_genericType, this.perPage, 0);

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

    if (!this.currentPage) {
      this.currentPage = this.pagination.currentPage;
    } else {
      this.currentPage = this.currentPage > this.pagination.lastPage ? this.pagination.currentPage : this.pagination.currentPage;
    }

    try {
      let rs: any;
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      if (this.query) {
        rs = await this.productService.search(this.query, _genericType, limit, offset);
      } else {
        rs = await this.productService.all(_genericType, limit, offset);
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
    const url = `${this.apiUrl}/report/product/balance/${p.product_id}?token=${this.token}`;
    this.htmlPreview.showReport(url);
  }

  async getGenericType() {
    try {
      const rs = await this.productService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  async changeGenericType() {
    try {
      this.modalLoading.show();
      let rs: any;
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      if (this.query) {
        rs = await this.productService.search(this.query, _genericType, this.perPage, 0);
      } else {
        rs = await this.productService.all(_genericType, this.perPage, 0);
      }
      this.modalLoading.hide();
      if (rs.ok) {
        this.products = rs.rows;
        this.totalProducts = rs.total;
        this.currentPage = 1;
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
