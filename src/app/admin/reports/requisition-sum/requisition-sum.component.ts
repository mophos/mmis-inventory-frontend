import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import * as moment from 'moment';

@Component({
  selector: 'wm-requisition-sum',
  templateUrl: './requisition-sum.component.html',
  styleUrls: []
})
export class RequisitionSumComponent implements OnInit {
  startDate: any;
  endDate: any;
  token: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  @ViewChild('htmlPreview') public htmlPreview: any;

  constructor(
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
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

  async showReport() {
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/reports/requisition/sum?token=${this.token}&startDate=${startDate}&endDate=${endDate}`;
    this.htmlPreview.showReport(url);
  }

}
