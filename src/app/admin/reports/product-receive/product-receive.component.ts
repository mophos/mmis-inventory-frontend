import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ProductsService } from '../../products.service';
import { ReceiveService } from '../../receive.service';
import { WarehouseService } from './../../warehouse.service';

@Component({
  selector: 'wm-product-receive',
  templateUrl: './product-receive.component.html'
})
export class ProductReceiveComponent implements OnInit {
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
  isFree = false

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

  async ptintReport() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
    const rs: any = await this.receiveService.getReport('PR');
    const report_url = rs.rows[0].report_url;
    const url = `${this.apiUrl}${report_url}?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&isFree=${this.isFree}&token=${this.token}&warehouseName=${this.warehouseName}&` + genericType.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }

  async ptintReportAccount() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
    const url = `${this.apiUrl}/report/product-receive-account?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&token=${this.token}&` + genericType.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }

  async ptintReportPurchasingMethod() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
    const url = `${this.apiUrl}/report/purchase-bit-type?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&token=${this.token}&` + genericType.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }
  async ptintReportVender() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
    const url = `${this.apiUrl}/report/receive-where-vender?startDate=${this.start}&endDate=${this.end}&isFree=${this.isFree}&warehouseId=${this.warehouseId}&token=${this.token}&` + genericType.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }
  async exportExcelVender() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;

    const url = `${this.apiUrl}/report/receive-where-vender/export?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&isFree=${this.isFree}&token=${this.token}&` + genericType.join('&');
    window.open(url, '_blank');
  }
  async exportExcel() {
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.start = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    this.end = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;

    const url = `${this.apiUrl}/report/receive/export?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&isFree=${this.isFree}&token=${this.token}&` + genericType.join('&');
    window.open(url, '_blank');
  }

  async editChangeFree(event){
    console.log( event.target.checked);
    this.isFree = event.target.checked
  }

}
