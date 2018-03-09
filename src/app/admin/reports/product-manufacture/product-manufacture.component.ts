import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'wm-product-manufacture',
  templateUrl: './product-manufacture.component.html',
  styleUrls: ['./product-manufacture.component.css']
})
export class ProductManufactureComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  startDate: any;
  endDate: any;
  isPreview = false;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  options: any;
  token: any;

  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private alertService: AlertService) {
    this.token = sessionStorage.getItem('token')
    this.options = {
      pdfOpenParams: { toolbar: '1' },
      height: "450px"
    };
  }

  ngOnInit() {
    const date = new Date();

    this.startDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
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

  showReport() {
    const token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(token);
    const warehouseId = decodedToken.warehouseId;
    console.log(decodedToken);
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/product/manufacture/warehouse/?warehouseId=${warehouseId}&startDate=${startDate}&endDate=${endDate}&token=${this.token}`;
    this.htmlPreview.showReport(url);
  }
  refresh() {
    console.log('test');
  }
}
