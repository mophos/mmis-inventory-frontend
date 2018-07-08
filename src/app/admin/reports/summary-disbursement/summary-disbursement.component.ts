import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-summary-disbursement',
  templateUrl: './summary-disbursement.component.html',
  styles: []
})
export class SummaryDisbursementComponent implements OnInit {
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
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
  }

  ngOnInit() {
    this.getdate();
  }

  summaryDisbursementMonth() {
    this.start = this.year + '-' + this.month + '-' + 1;
    this.end = this.year + '-' + this.month + '-' + moment(this.year, 'YYYY-MM').daysInMonth();
    const url = `${this.apiUrl}/report/summary/disbursement?startDate=${this.start}&endDate=${this.end}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  summaryDisbursementDate() {
    const _startDate = `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}`
    const _endDate = `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}`
    const url = `${this.apiUrl}/report/summary/disbursement?startDate=${_startDate}&endDate=${_endDate}&token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  getdate() {
    for (let i = 0; i < 10; i++) {
      this.dataYear.push(this.date.getFullYear() - i)
    }
  }

}
