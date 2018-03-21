import { Component, OnInit, ViewChild } from '@angular/core';
import { MinMaxService } from './../min-max.service';
import { AlertService } from '../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'wm-calculate-min-max',
  templateUrl: './calculate-min-max.component.html',
  styles: []
})
export class CalculateMinMaxComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;

  generics: any = [];

  fromDate: any;
  toDate: any;

  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    private minMaxService: MinMaxService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.getHeader();
    this.getMinMax();
  }

  async getHeader() {
    try {
      this.modalLoading.show();
      const rs: any = await this.minMaxService.getHeader();
      if (rs.ok) {
        const result = rs.rows[0];
        if (result.from_stock_date) {
          this.fromDate = {
            date: {
              year: moment(result.from_stock_date).get('year'),
              month: moment(result.from_stock_date).get('month') + 1,
              day: moment(result.from_stock_date).get('date')
            }
          }
        }

        if (result.to_stock_date) {
          this.toDate = {
            date: {
              year: moment(result.to_stock_date).get('year'),
              month: moment(result.to_stock_date).get('month') + 1,
              day: moment(result.to_stock_date).get('date')
            }
          }
        } else {
          this.toDate = {
            date: {
              year: moment().get('year'),
              month: moment().get('month') + 1,
              day: moment().get('date')
            }
          };
        }
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  async getMinMax() {
    try {
      this.modalLoading.show();
      const rs: any = await this.minMaxService.getMinMax();
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  onClickCalculate() {
    this.alertService.confirm('ต้องการคำนวณ Min - Max ใช่หรือไม่?')
      .then(() => {
        this.calculateMinMax();
      })
      .catch(() => { });
  }

  async calculateMinMax() {
    try {
      this.modalLoading.show();
      const _fromDate = `${this.fromDate.date.year}-${this.fromDate.date.month}-${this.fromDate.date.day}`;
      const _toDate = `${this.toDate.date.year}-${this.toDate.date.month}-${this.toDate.date.day}`;
      const rs: any = await this.minMaxService.calculateMinMax(_fromDate, _toDate);
      if (rs.ok) {
        this.generics = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  onChangeSaftyStock(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].safty_stock_day = +value;
      this.generics[idx].min_qty = this.generics[idx].qty + (this.generics[idx].use_per_day * this.generics[idx].safty_stock_day);
      if (this.generics[idx].use_total > this.generics[idx].qty) {
        this.generics[idx].max_qty = this.generics[idx].use_total + (this.generics[idx].use_per_day * this.generics[idx].safty_stock_day);
      } else {
        this.generics[idx].max_qty = this.generics[idx].min_qty + (this.generics[idx].use_per_day * this.generics[idx].safty_stock_day);
      }
    }
  }

  onChangeMinQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].min_qty = +value;
    }
  }

  onChangeMaxQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].max_qty = +value;
    }
  }

  save() {
    this.alertService.confirm('ต้องการบันทึกรายการ ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const _fromDate = `${this.fromDate.date.year}-${this.fromDate.date.month}-${this.fromDate.date.day}`;
          const _toDate = `${this.toDate.date.year}-${this.toDate.date.month}-${this.toDate.date.day}`;
          const rs: any = await this.minMaxService.saveGenericPlanning(_fromDate, _toDate, this.generics);
          if (rs.ok) {
            this.alertService.success();
          } else {
            this.alertService.error(JSON.stringify(rs.error));
          }
          this.modalLoading.hide();
        } catch (error) {
          this.modalLoading.hide();
        }
      })
      .catch(() => { });
  }

}
