import { Component, OnInit, ViewChild } from '@angular/core';
import { MinMaxService } from './../min-max.service';
import { AlertService } from '../../alert.service';
import { IMyOptions } from 'mydatepicker-th';
import * as _ from 'lodash';
import * as moment from 'moment';
import { BasicService } from 'app/basic.service';

@Component({
  selector: 'wm-calculate-min-max',
  templateUrl: './calculate-min-max.component.html',
  styles: []
})
export class CalculateMinMaxComponent implements OnInit {
  @ViewChild('modalLoading') private modalLoading;

  generics: any = [];
  _generics: any = [];

  fromDate: any;
  toDate: any;
  query: any = "";
  processDate: any;
  processDateGroup: any;
  tab = 'minmax_group';
  minMaxGroups: any = [];
  minMaxGroupId: any;
  fromDateGroup: any;
  toDateGroup: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  // minMaxGroupDatail: any;
  genericType: any;
  @ViewChild('genericTypes') public genericTypes: any;
  constructor(
    private minMaxService: MinMaxService,
    private alertService: AlertService,
    private basicService: BasicService
  ) { }

  ngOnInit() {
    this.getMinMaxGroup();
  }

  // tslint:disable-next-line:use-life-cycle-interface
  ngAfterViewInit() {
    this.genericType = this.genericTypes.getDefaultGenericType();
  }

  selectGenericTypeMulti(e) {
    this.genericType = e;
    this.searchGenerics();
  }

  selectGenericTypeMultiGroup(e) {
    this.genericType = e;
    this.searchGenericGroup();
  }

  async getHeader() {
    try {
      this.modalLoading.show();
      const rs: any = this.tab == 'minmax_group' ? await this.minMaxService.getHeaderGroup(this.minMaxGroupId) : await this.minMaxService.getHeader();
      if (rs.ok) {
        const result = rs.rows[0];
        this.processDate = result.process_date;
        if (result && result.from_stock_date) {
          this.fromDate = {
            date: {
              year: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('year') : moment().get('year'),
              month: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('month') + 1 : moment().get('month') + 1,
              day: moment(result.from_stock_date).isValid() ? moment(result.from_stock_date).get('date') : moment().get('date')
            }
          }
        }

        if (result && result.to_stock_date) {
          this.toDate = {
            date: {
              year: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('year') : moment().get('year'),
              month: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('month') + 1 : moment().get('month') + 1,
              day: moment(result.to_stock_date).isValid() ? moment(result.to_stock_date).get('date') : moment().get('date')
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
  async getMinMaxGroup() {
    this.tab = 'minmax_group'
    this.generics = [];
    this._generics = [];
    try {
      this.modalLoading.show();
      const rs: any = await this.minMaxService.getMinMaxGroup();
      if (rs.ok) {
        this.minMaxGroups = await rs.rows;
        if (this.minMaxGroups.length) {
          this.minMaxGroupId = await this.minMaxGroups[0].group_id;
          this.getHeader()
          this.getMinMaxGroupDetail();
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

  async getMinMaxGroupDetail() {
    try {
      this.getHeader()
      this.modalLoading.show();
      const rs: any = await this.minMaxService.getMinMaxGroupDetail(this.minMaxGroupId, this.genericType, this.query);
      if (rs.ok) {
        this.generics = rs.rows;
        const rsd: any = await this.minMaxService.getMinMax(this.genericType, this.query);
        if (rsd.ok) {
          this._generics = _.clone(rsd.rows);
        } else {
          this.alertService.error(rsd.error);
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
      this.tab = 'minmax'
      this.generics = [];
      this._generics = [];
      this.getHeader()
      this.modalLoading.show();
      const rs: any = await this.minMaxService.getMinMax(this.genericType, this.query);
      if (rs.ok) {
        this.generics = rs.rows;
        this._generics = _.clone(this.generics);
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
        this._generics = _.clone(this.generics);
        this.processDate = rs.process_date;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }
  async calculateMinMaxGroup() {
    try {
      this.modalLoading.show();
      const _fromDate = `${this.fromDate.date.year}-${this.fromDate.date.month}-${this.fromDate.date.day}`;
      const _toDate = `${this.toDate.date.year}-${this.toDate.date.month}-${this.toDate.date.day}`;
      const rs: any = await this.minMaxService.calculateMinMaxGroup(_fromDate, _toDate, this.minMaxGroupId);
      if (rs.ok) {
        this.generics = rs.rows;
        for (const g of this._generics) {
          const idx = _.findIndex(this.generics, { generic_id: g.generic_id });
          if (idx > -1) {
            g.use_total = this.generics[idx].use_total;
            g.use_per_day = this.generics[idx].use_per_day;
            g.safety_min_day = this.generics[idx].safety_min_day;
            g.safety_max_day = this.generics[idx].safety_max_day;
            g.qty = this.generics[idx].qty;
            g.min_qty = this.generics[idx].min_qty;
            g.max_qty = this.generics[idx].max_qty;
            g.lead_time_day = this.generics[idx].lead_time_day;
            g.rop_qty = this.generics[idx].rop_qty;
            g.ordering_cost = this.generics[idx].ordering_cost;
            g.carrying_cost = this.generics[idx].carrying_cost;
            g.eoq_qty = this.generics[idx].eoq_qty;
          }
        }
        this.processDate = rs.process_date;
      } else {
        this.alertService.error(rs.error);
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(JSON.stringify(error.message));
    }
  }

  onChangeSaftyStockMin(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].safety_min_day = +value;
      this.generics[idx].min_qty = Math.round(this.generics[idx].use_per_day * this.generics[idx].safety_min_day);
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].safety_min_day = +value;
      this._generics[_idx].min_qty = Math.round(this._generics[_idx].use_per_day * this._generics[_idx].safety_min_day);
    }
  }

  onChangeSaftyStockMax(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].safety_max_day = +value;
      this.generics[idx].max_qty = Math.round(this.generics[idx].use_per_day * this.generics[idx].safety_max_day);
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].safety_max_day = +value;
      this._generics[_idx].max_qty = Math.round(this._generics[_idx].use_per_day * this._generics[_idx].safety_max_day);
    }
  }

  onChangeMinQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].min_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].min_qty = +value;
    }
  }

  onChangeMaxQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].max_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].max_qty = +value;
    }
  }

  onChangeLeadTmie(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].lead_time_day = +value;
      this.generics[idx].rop_qty = +value * generic.use_per_day;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this.generics[_idx].lead_time_day = +value;
      this.generics[_idx].rop_qty = +value * generic.use_per_day;
    }
  }

  onChangeReorderPoint(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].rop_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].rop_qty = +value;
    }
  }

  onChangeOrderingCost(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].ordering_cost = +value;
      if (generic.carrying_cost) {
        this.generics[idx].eoq_qty = Math.round(Math.sqrt((2 * generic.use_total * +value) / generic.carrying_cost));
      } else {
        this.generics[idx].eoq_qty = 0;
      }
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this.generics[_idx].ordering_cost = +value;
      if (generic.carrying_cost) {
        this.generics[_idx].eoq_qty = Math.round(Math.sqrt((2 * generic.use_total * +value) / generic.carrying_cost));
      } else {
        this.generics[_idx].eoq_qty = 0;
      }
    }
  }

  onChangeCarryingCost(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].carrying_cost = +value;
      if (value) {
        this.generics[idx].eoq_qty = Math.round(Math.sqrt((2 * generic.use_total * generic.ordering_cost) / +value));
      } else {
        this.generics[idx].eoq_qty = 0;
      }
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this.generics[_idx].carrying_cost = +value;
      if (value) {
        this.generics[_idx].eoq_qty = Math.round(Math.sqrt((2 * generic.use_total * generic.ordering_cost) / +value));
      } else {
        this.generics[_idx].eoq_qty = 0;
      }
    }
  }

  onChangeEoqQty(value: any, generic: any) {
    const idx = _.findIndex(this.generics, { generic_id: generic.generic_id });
    if (idx > -1) {
      this.generics[idx].eoq_qty = +value;
    }
    const _idx = _.findIndex(this._generics, { generic_id: generic.generic_id });
    if (_idx > -1) {
      this._generics[_idx].eoq_qty = +value;
    }
  }

  save() {
    this.alertService.confirm('ต้องการบันทึกรายการ ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.minMaxService.saveGenericPlanning(this.processDate, this._generics);
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

  saveGroup() {
    this.alertService.confirm('ต้องการบันทึกรายการ ใช่หรือไม่?')
      .then(async () => {
        try {
          this.modalLoading.show();
          const rs: any = await this.minMaxService.saveGenericPlanning(this.processDate, this._generics, this.minMaxGroupId);
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
  enterSearch(e) {
    if (e.keyCode === 13) {
      this.searchGenerics();
    }
  }
  enterSearchGroup(e) {
    if (e.keyCode === 13) {
      this.searchGenericGroup();
    }
  }
  async searchGenerics() {
    this.modalLoading.show();
    try {
      const rs: any = await this.minMaxService.searchGenericsWarehosue(this.genericType, this.query);
      if (rs.ok) {
        this.generics = rs.rows;
        for (const g of this.generics) {
          const idx = _.findIndex(this._generics, { generic_id: g.generic_id });
          if (idx > -1) {
            g.use_total = this._generics[idx].use_total;
            g.use_per_day = this._generics[idx].use_per_day;
            g.safety_min_day = this._generics[idx].safety_min_day;
            g.safety_max_day = this._generics[idx].safety_max_day;
            g.qty = this._generics[idx].qty;
            g.min_qty = this._generics[idx].min_qty;
            g.max_qty = this._generics[idx].max_qty;
            g.lead_time_day = this._generics[idx].lead_time_day;
            g.rop_qty = this._generics[idx].rop_qty;
            g.ordering_cost = this._generics[idx].ordering_cost;
            g.carrying_cost = this._generics[idx].carrying_cost;
            g.eoq_qty = this._generics[idx].eoq_qty;
          }
        }
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }

  async searchGenericGroup() {
    this.modalLoading.show();
    try {
      const rs: any = await this.minMaxService.searchGenericsGroupWarehosue(this.genericType, this.query, this.minMaxGroupId);
      if (rs.ok) {
        this.generics = rs.rows;
        for (const g of this.generics) {
          const idx = _.findIndex(this._generics, { generic_id: g.generic_id });
          if (idx > -1) {
            g.use_total = this._generics[idx].use_total;
            g.use_per_day = this._generics[idx].use_per_day;
            g.safety_min_day = this._generics[idx].safety_min_day;
            g.safety_max_day = this._generics[idx].safety_max_day;
            g.qty = this._generics[idx].qty;
            g.min_qty = this._generics[idx].min_qty;
            g.max_qty = this._generics[idx].max_qty;
            g.lead_time_day = this._generics[idx].lead_time_day;
            g.rop_qty = this._generics[idx].rop_qty;
            g.ordering_cost = this._generics[idx].ordering_cost;
            g.carrying_cost = this._generics[idx].carrying_cost;
            g.eoq_qty = this._generics[idx].eoq_qty;
          }
        }
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(rs.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error.message);
    }
  }
}
