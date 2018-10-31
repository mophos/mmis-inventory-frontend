import { ProductsService } from './../products.service';
import { AlertService } from './../../alert.service';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { State } from '@clr/angular';
import { JwtHelper } from 'angular2-jwt';
import { WarehouseService } from './../warehouse.service';
@Component({
  selector: 'wm-products',
  templateUrl: './products.component.html',
  styleUrls: []
})
export class ProductsComponent implements OnInit {
  sort: any = {};

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
  warehouses: any = [];
  warehouseId = 0;
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('pagination') pagination: any;
  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    private warehouseService: WarehouseService,
    @Inject('API_URL') private apiUrl: string,
  ) {
    this.token = sessionStorage.getItem('token');
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decoded.generic_type_id ? decoded.generic_type_id.split(',') : [];
    // this.warehouseId = decoded.warehouseId;
  }

  ngOnInit() {
    this.getGenericType();
    this.getWarehouseList();
  }

  search(event) {
    if (event.keyCode === 13) {
      if (this.query) {
        this.doSearch();
      } else {
        this.getAllProducts();
      }
    } else if (this.query === '') {
      this.getAllProducts();
    }
  }

  async doSearch() {
    try {
      this.modalLoading.show();
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      const rs = await this.productService.search(this.query, _genericType, this.perPage, 0, this.warehouseId);
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
      const rs = await this.productService.all(_genericType, this.perPage, 0, this.warehouseId);

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
    this.sort = state.sort;

    if (!this.currentPage) {
      this.currentPage = this.pagination.currentPage;
    } else {
      this.currentPage = this.currentPage > this.pagination.lastPage ? this.pagination.currentPage : this.pagination.currentPage;
    }

    try {
      let rs: any;
      const _genericType = this.genericType === '' ? this.genericTypeIds : this.genericType;
      if (this.query) {
        rs = await this.productService.search(this.query, _genericType, limit, offset, this.warehouseId, this.sort);
      } else {
        rs = await this.productService.all(_genericType, limit, offset, this.warehouseId, this.sort);
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
    const url = `${this.apiUrl}/report/product/balance?&productId=${p.product_id}&warehouseId=${this.warehouseId}&token=${this.token}`;
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
        rs = await this.productService.search(this.query, _genericType, this.perPage, 0, this.warehouseId);
      } else {
        rs = await this.productService.all(_genericType, this.perPage, 0, this.warehouseId);
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

  getWarehouseList() {
    this.warehouseService.all()
      .then((result: any) => {
        if (result.ok) {
          this.warehouses = result.rows;
        } else {
          this.alertService.error(JSON.stringify(result.error));
        }
      });
  }

  changewarehouses() {
    if (this.query) {
      this.doSearch();
    } else {
      this.getAllProducts();
    }
  }

}
