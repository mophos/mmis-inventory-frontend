import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ReportsService } from 'app/admin/reports.service';
import { AlertService } from 'app/alert.service';
import { IMyOptions } from 'mydatepicker-th';

import * as _ from "lodash";
import * as moment from'moment';
@Component({
  selector: 'wm-export-financial',
  templateUrl: './export-financial.component.html',
  styles: []
})
export class ExportFinancialComponent implements OnInit {
  @ViewChild('genericTypes') public genericTypes: any = 0;
  @ViewChild('modalLoading') public modalLoading: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypeId: any = 0;
  startDate: any = {
    date: {
      year: moment().get('year'),
      month: moment().get('month') + 1,
      day: '1'
    }
  };
  endDate: any = {
    date: {
      year: moment().get('year'),
      month: moment().get('month') + 1,
      day: moment().get('date')
    }
  };
  lists: any = [];
  constructor(
    private reportsService: ReportsService,
    private alertService: AlertService,
    @Inject('API_URL') private apiUrl: string
  ) { }

  ngOnInit() {
  }

  selectGenericType(e) {
    if (e) {
      this.genericTypeId = e.generic_type_id;
    } else {
      this.genericTypeId = 0
    }
  }

  async getFinancial() {
    try {
      this.modalLoading.show();
      var startDate = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
      var endDate = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
      const rs: any = await this.reportsService.getFinancial(startDate, endDate, this.genericTypeId)
      if (rs.ok) {
        this.lists = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async remove(idx: any) {
    this.alertService.confirm('ต้องการลบรายการนี้ ใช่หรือไม่?')
      .then(() => {
        this.lists.splice(idx, 1);
      }).catch(() => { });
  }

  export() {
    var startDate = this.startDate ? `${this.startDate.date.year}-${this.startDate.date.month}-${this.startDate.date.day}` : null;
    var endDate = this.endDate ? `${this.endDate.date.year}-${this.endDate.date.month}-${this.endDate.date.day}` : null;
    const token = sessionStorage.getItem('token');
    const url = `${this.apiUrl}/reports/exports/financialData?token=${token}&startDate=${startDate}&endDate=${endDate}&genericTypeId=${this.genericTypeId}`;
    window.open(url, '_blank');
  }
}
