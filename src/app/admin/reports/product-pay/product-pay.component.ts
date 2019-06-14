import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from '../../../alert.service';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductsService } from '../../products.service';
import { ReceiveService } from '../../receive.service';
import { WarehouseService } from '../../warehouse.service';

import * as _ from "lodash";
@Component({
  selector: 'wm-product-pay',
  templateUrl: './product-pay.component.html'
})
export class ProductPayComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  jwtHelper: JwtHelper = new JwtHelper();

  startDate: any;
  endDate: any;
  start: any;
  end: any;
  token: any;
  isPreview = false;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  warehouseId: any;
  warehouseName: any;
  warehouses: any = [];
  genericTypes = [];
  genericTypeSelect: any = [];

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private productService: ProductsService,
    private receiveService: ReceiveService,
    private warehouseService: WarehouseService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
    this.warehouseName = decodedToken.warehouseName
  }

  ngOnInit() {
    this.getGenericsType();
    this.getWarehouseList();
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: 1
      }
    };
    this.endDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
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

  async getGenericsType() {
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

  
  async exportExcel() {
    let warehouseIdx = _.findIndex(this.warehouses, { warehouse_id: this.warehouseId })
    let warehouseSelect = this.warehouses[warehouseIdx]
    let type = _.map(this.genericTypeSelect, function (v) {
      return 'genericTypes=' + v.generic_type_id;
    })
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;

    const url = `${this.apiUrl}/report/requisition/generic/excel?startDate=${this.start}&endDate=${this.end}&warehouseName=${warehouseSelect.warehouse_name}&warehouseId=${this.warehouseId}&token=${this.token}&` + type.join('&');
    window.open(url, '_blank');
  }
  async export() {
    let warehouseIdx = _.findIndex(this.warehouses, { warehouse_id: this.warehouseId })
    let warehouseSelect = this.warehouses[warehouseIdx]
    let type = _.map(this.genericTypeSelect, function (v) {
      return 'genericTypes=' + v.generic_type_id;
    })
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;

    const url = `${this.apiUrl}/report/requisition/generic?startDate=${this.start}&endDate=${this.end}&warehouseName=${warehouseSelect.warehouse_name}&warehouseId=${this.warehouseId}&token=${this.token}&` + type.join('&');
    this.htmlPreview.showReport(url);


}
