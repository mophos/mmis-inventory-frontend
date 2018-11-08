import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertService } from './../../../alert.service';
import * as _ from 'lodash';
import { ProductsService } from '../../products.service';
import { State } from "@clr/angular";

@Component({
  selector: 'wm-inventory-status',
  templateUrl: './inventory-status.component.html',
  styles: []
})
export class InventoryStatusComponent implements OnInit {

  @ViewChild('htmlPreview') public htmlPreview: any;

  radio = 'generic';
  token: any;
  warehouseId: any;
  genericTypes = [];
  genericType: any = 0;
  warehouses: any = [];
  genericTypeIds = [];
  genericTypeSelect: any = [];
  warehouseName: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  statusDate: any;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decodedToken.generic_type_id ? decodedToken.generic_type_id.split(',') : [];
    this.warehouseId = decodedToken.warehouseId;
    this.warehouseName = decodedToken.warehouseName
  }

  ngOnInit() {
    const date = new Date();
    this.statusDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
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

  refreshWaiting(state: State) {
    this.getGenericType();
  }

  showReport() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.statusDate = this.statusDate ? moment(this.statusDate.jsdate).format('YYYY-MM-DD') : null;
    if (this.radio == 'generic') {
      const url = `${this.apiUrl}/report/inventoryStatus/generic?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
      this.htmlPreview.showReport(url);
    } else if (this.radio == 'product') {
      const url = `${this.apiUrl}/report/inventoryStatus/product?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
      this.htmlPreview.showReport(url);
    }
  }

  exportExcel() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.statusDate = this.statusDate ? moment(this.statusDate.jsdate).format('YYYY-MM-DD') : null;
    if (this.radio == 'generic') {
      const url = `${this.apiUrl}/report/inventoryStatus/generic/excel?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
      window.open(url, '_blank');
    } else if (this.radio == 'product') {
      const url = `${this.apiUrl}/report/inventoryStatus/product/excel?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
      window.open(url, '_blank');
    }
  }

}
