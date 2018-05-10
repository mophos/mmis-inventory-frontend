import { ReportProductsService } from './../reports-products.service';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChild } from '@angular/core';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductsService } from '../../products.service';


import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-product-remain',
  templateUrl: './product-remain.component.html',
  styleUrls: ['./product-remain.component.css']
})
export class ProductRemainComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: any;

  products: any = [];
  allWarehouseProducts = [];
  warehouses: any = [];
  warehouseId: any;
  openGraph = false;
  openAllWarehouse = false;
  loading = false;
  loadingAll = false;
  productId: string;
  demoOption: any;
  chartOptions: any;
  token: string;
  genericTypes = [];
  genericType: any = 0;
  genericTypeIds = [];

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private warehouseService: WarehouseService,
    private reportProductService: ReportProductsService,
    private productService: ProductsService,
    private alertService: AlertService,
    private ref: ChangeDetectorRef,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decodedToken.generic_type_id ? decodedToken.generic_type_id.split(',') : [];
    this.warehouseId = decodedToken.warehouseId;
  }

  ngOnInit() {
    this.getGenericType();
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

  changeGenericType() {
    console.log(this.genericType, 'genericType');
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

  getreport() {
    const url = `${this.apiUrl}/report/product-remain/${this.warehouseId}/${this.genericType}?token=${this.token}`
    this.htmlPreview.showReport(url);
  }
}
