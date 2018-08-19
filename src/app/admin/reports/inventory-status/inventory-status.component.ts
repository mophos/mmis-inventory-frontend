import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as moment from 'moment';
import { IMyOptions } from 'mydatepicker-th';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ReportProductsService } from './../reports-products.service';
import { AlertService } from './../../../alert.service';
import * as _ from 'lodash';
import { ProductsService } from '../../products.service';
import { State } from "@clr/angular";
import { WarehouseService } from './../../warehouse.service';


@Component({
  selector: 'wm-inventory-status',
  templateUrl: './inventory-status.component.html',
  styles: []
})
export class InventoryStatusComponent implements OnInit {

  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('htmlPreview') public htmlPreview: any;

  token: any;
  warehouseId: any;
  genericTypes = [];
  genericType: any = 0;
  warehouses: any = [];
  genericTypeIds = [];
  genericTypeSelect: any = [];
  warehouseName: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  statusDate: any;

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    private warehouseService: WarehouseService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decodedToken.generic_type_id ? decodedToken.generic_type_id.split(',') : [];
    this.warehouseId = decodedToken.warehouseId;
    this.warehouseName = decodedToken.warehouseName
  }


  ngOnInit() {
    const date = new Date();
    this.statusDate = {
      date: {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
    };
    this.getGenericType();
    this.getWarehouseList();
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

  async getGenericType() {
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

  changeGenericType() {
  }

  showReport() {
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    console.log(this.warehouseId);
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.statusDate = this.statusDate ? moment(this.statusDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/inventorystatus?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
    this.htmlPreview.showReport(url);
  }

  refreshWaiting(state: State) {
    this.getGenericType();
  }

  exportExcel() {
    if (+this.warehouseId !== 0) {
      this.warehouseName = _.find(this.warehouses, (v) => { return +v.warehouse_id === +this.warehouseId })
      this.warehouseName = this.warehouseName.warehouse_name
    } else {
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    let genericType = [];
    this.genericTypeSelect.forEach(value => {
      genericType.push('genericType=' + value.generic_type_id)
    });
    this.statusDate = this.statusDate ? moment(this.statusDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/inventorystatus/excel?warehouseId=${this.warehouseId}&statusDate=${this.statusDate}&warehouseName=${this.warehouseName}&token=${this.token}&` + genericType.join('&');
    window.open(url, '_blank');
  }
}
