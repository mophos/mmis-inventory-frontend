import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-account-payable',
  templateUrl: './account-payable.component.html',
  styles: []
})
export class AccountPayableComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  startDate: any;
  endDate: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypeId: any;
  token: any;
  @ViewChild('htmlPreview') public htmlPreview: any;
  constructor(
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token')
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

  selectGenericType(e) {
    if (e) {
      this.genericTypeId = e.generic_type_id;
    } else {
      this.genericTypeId = null;
    }

  }
  showReport() {
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/reports/account/payable?startDate=${startDate}&endDate=${endDate}&genericTypeId=${this.genericTypeId}&token=${this.token}`;
    this.htmlPreview.showReport(url, 'landscape');
  }



}
