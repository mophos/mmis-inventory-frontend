import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';
import { SearchGenericAutocompleteComponent } from '../../../directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as _ from 'lodash';

@Component({
  selector: 'wm-product-summary',
  templateUrl: './product-summary.component.html',
  styles: []
})
export class ProductSummaryComponent implements OnInit {
  jwtHelper: JwtHelper = new JwtHelper();
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  startDate: any;
  endDate: any;
  warehouses: any = [];
  warehouseId:any = 0;
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

  options: any;
  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
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
  }

  showReport() {
    console.log(+this.warehouseId);
    if(+this.warehouseId !== 0){
      this.warehouseName = _.find(this.warehouses,(v)=>{return +v.warehouse_id === +this.warehouseId})
      this.warehouseName = this.warehouseName.warehouse_name
    } else {      
      this.warehouseName = 'ทุกคลังสินค้า'
    }
    console.log(this.warehouseName);
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/list/cost/${startDate}/${endDate}/${this.warehouseId}/${this.warehouseName}?token=${this.token}`;
    this.htmlPreview.showReport(url, 'landscape');
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
}
