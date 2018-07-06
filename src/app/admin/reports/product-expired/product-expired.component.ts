import { SelectGenericTypeComponent } from './../../../directives/select-generic-type/select-generic-type.component';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { AlertService } from './../../../alert.service';
import { WarehouseService } from './../../warehouse.service';
import * as moment from 'moment';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-product-expired',
  templateUrl: './product-expired.component.html',
  styleUrls: ['./product-expired.component.css']
})
export class ProductExpiredComponent implements OnInit {
  @ViewChild('htmlPreview') public htmlPreview: any;
  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('selectGenericType') public selectGenericType: SelectGenericTypeComponent;
  startDate: any;
  endDate: any;
  warehouses: any = [];
  warehouseId = 0;
  isPreview = false;
  selectedGenericId = 0;
  token: any;
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };
  genericTypeId;
  options: any;

  constructor(@Inject('API_URL') private apiUrl: string,
    private warehouseService: WarehouseService,
    private alertService: AlertService, ) {
    this.token = sessionStorage.getItem('token')
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
    const startDate = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    const endDate = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/product/expired/${startDate}/${endDate}/${this.warehouseId}/${this.selectedGenericId}?genericTypeId=${this.genericTypeId}&token=${this.token}`;
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
  setSelectedGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }
  changeSearchGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }
  refresh() {
    this.selectedGenericId = 0;
    this.warehouseId = 0;
    this.searchGenericCmp.clearSearch();
  }

  setSelectedGenericType(e) {
    this.genericTypeId = e.generic_type_id;
  }
}
