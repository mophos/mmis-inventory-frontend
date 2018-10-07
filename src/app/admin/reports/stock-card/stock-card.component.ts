import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { AlertService } from './../../../alert.service';
import * as _ from 'lodash';
import { ReportProductsService } from '../reports-products.service'
@Component({
  selector: 'wm-stock-card',
  templateUrl: './stock-card.component.html',
  styles: []
})
export class StockCardComponent implements OnInit {

  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('modalLoading') public modalLoading;

  startDate: any;
  endDate: any;
  isPreview = false;
  start: any;
  end: any;
  token: any;
  warehouseId: any;
  datageneric = [];
  generic_id = [];
  genericInStockcard = [];
  productId: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  modalAll = false;
  modalMovement = false;
  numButtonAll: any = [];
  numButtonMovement: any = [];
  sumGenericAll: any;
  sumGenericMovement: any;
  jwtHelper: JwtHelper = new JwtHelper();
  constructor(
    private alertService: AlertService,
    private reportProducts: ReportProductsService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
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

  setSelectedGeneric(generic) {
    this.datageneric.push({
      generic_id: generic.generic_id,
      generic_name: generic.generic_name,
      generic_code: generic.working_code
    });
    this.generic_id.push('genericId=' + generic.generic_id)
  }

  changeSearchGeneric(generic) {
  }

  changeTab() {
    this.generic_id = [];
    this.datageneric = [];
  }

  showReport() {
    this.start = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    this.end = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/generic/stock?&warehouseId=${this.warehouseId}&startDate=${this.start}&endDate=${this.end}&token=${this.token}&` + this.generic_id.join('&');
    this.htmlPreview.showReport(url, 'landscape');
  }

  refresh() {
    this.startDate = '';
    this.endDate = '';
    this.datageneric = [];
    this.generic_id = [];
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

  removeSelected(g) {
    const idx = _.findIndex(this.datageneric, { generic_id: g.generic_id });
    if (idx > -1) {
      this.datageneric.splice(idx, 1);
      this.generic_id.splice(idx, 1)
    }
  }

  async printReportHaveMovement(offset: any) {
    this.modalMovement = false;
    const startDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day
    const endDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day
    const url = `${this.apiUrl}/report/genericStock/haveMovement?&warehouseId=${this.warehouseId}&startDate=${startDate}&endDate=${endDate}&offset=${offset}&token=${this.token}&`
    this.htmlPreview.showReport(url, 'landscape');
  }

  async printReportNomovement() {
    const startDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day
    const endDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day
    const url = `${this.apiUrl}/report/generics-no-movement/${this.warehouseId}/${startDate}/${endDate}?token=${this.token}`
    this.htmlPreview.showReport(url);
  }

  async OpenmodalAll() {
    this.modalLoading.show();
    this.numButtonAll = [];
    let rs = await this.reportProducts.getGenericWarehouse(this.warehouseId);
    this.sumGenericAll = rs.rows;
    let sumButton = Math.ceil(rs.rows / 150);
    for (let i = 0; i < sumButton; i++) {
      if (i == 0) {
        this.numButtonAll.push(0)
      } else {
        this.numButtonAll.push(i * 150)
      }
    }
    this.modalLoading.hide();
    this.modalAll = true;
  }

  async OpenmodalMovement() {
    this.modalLoading.show();
    const startDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day
    const endDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day
    this.numButtonMovement = [];
    let rs = await this.reportProducts.getGenericInStockcrad(this.warehouseId, startDate, endDate);
    this.sumGenericMovement = rs.rows;
    let sumButton = Math.ceil(rs.rows / 150);
    for (let i = 0; i < sumButton; i++) {
      if (i == 0) {
        this.numButtonMovement.push(0)
      } else {
        this.numButtonMovement.push(i * 150)
      }
    }
    this.modalLoading.hide();
    this.modalMovement = true;
  }

  async printReportAll(offset: any) {
    this.modalAll = false;
    const startDate = this.startDate.date.year + '-' + this.startDate.date.month + '-' + this.startDate.date.day
    const endDate = this.endDate.date.year + '-' + this.endDate.date.month + '-' + this.endDate.date.day
    const url = `${this.apiUrl}/report/genericStock/all?&warehouseId=${this.warehouseId}&startDate=${startDate}&endDate=${endDate}&offset=${offset}&token=${this.token}&`
    this.htmlPreview.showReport(url, 'landscape');
  }

  clearProductSearch() {
    this.productId = null;
  }


}
