import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import * as moment from 'moment';
import { WarehouseService } from './../../warehouse.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-summary-disbursement-non',
  templateUrl: './summary-disbursement-non.component.html',
  styleUrls: ['./summary-disbursement-non.component.css']
})
export class SummaryDisbursementNonComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  jwtHelper: JwtHelper = new JwtHelper();
  startDate: any;
  endDate: any;
  start: any;
  end: any;
  date = new Date();
  month = this.date.getMonth() + 1;
  year = this.date.getFullYear();
  lastday = moment()
  dataYear = [];
  token: any;
  isPreview = false;
  warehouses: any = [];
  warehouseId = 0;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    @Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.getdate();
    this.getWarehouseList();
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

  summaryDisbursementMonth() {
    this.start = this.year + '-' + this.month + '-' + 1;
    this.end = this.year + '-' + this.month + '-' + moment(`${this.year}-${this.month}`, 'YYYY-MM').daysInMonth();
    const url = `${this.apiUrl}/report/summary/disbursement-non?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  summaryDisbursementDate() {
    const _startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`
    const _endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`
    const url = `${this.apiUrl}/report/summary/disbursement-non?startDate=${_startDate}&endDate=${_endDate}&warehouseId=${this.warehouseId}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  summaryDisbursementMonthExcel() {
    this.start = this.year + '-' + this.month + '-' + 1;
    this.end = this.year + '-' + this.month + '-' + moment(this.year, 'YYYY-MM').daysInMonth();
    const url = `${this.apiUrl}/report/summary/disbursement-non/excel?startDate=${this.start}&endDate=${this.end}&warehouseId=${this.warehouseId}&token=${this.token}`
    // this.htmlPreview.showReport(url);
    window.open(url);
  }

  summaryDisbursementDateExcel() {
    const _startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`
    const _endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`
    const url = `${this.apiUrl}/report/summary/disbursement-non/excel?startDate=${_startDate}&endDate=${_endDate}&warehouseId=${this.warehouseId}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  getdate() {
    for (let i = 0; i < 10; i++) {
      this.dataYear.push(this.date.getFullYear() - i)
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

}
