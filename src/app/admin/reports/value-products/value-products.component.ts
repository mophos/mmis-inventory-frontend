import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { SearchGenericAutocompleteComponent } from '../../../directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as _ from 'lodash';
import { ProductsService } from '../../products.service';

@Component({
  selector: 'wm-value-products',
  templateUrl: './value-products.component.html',
  styles: []
})
export class ValueProductsComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  startDate: any;
  endDate: any;
  warehouses: any = [];
  warehouseId: any = 0;
  warehouseName: any;
  isPreview = false;
  selectedGenericId = 0;
  token: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypes = [];
  genericType = 'all';

  options: any;
  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private productService: ProductsService,
    private alertService: AlertService) {
    this.token = sessionStorage.getItem('token')
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId
    this.warehouseName = decodedToken.warehouseName
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
    this.getWarehouseList();
    this.getGenericsType();
  }

  showReport() {
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    if (this.genericType == 'all') {
      const url = `${this.apiUrl}/report/list/cost/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}`;
      this.htmlPreview.showReport(url, 'landscape');
    } else {
      const url = `${this.apiUrl}/report/list/cost/type/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}/${this.genericType}?token=${this.token}`;
      this.htmlPreview.showReport(url, 'landscape');
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

  refresh() {
    this.warehouseId = 0;
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

}
