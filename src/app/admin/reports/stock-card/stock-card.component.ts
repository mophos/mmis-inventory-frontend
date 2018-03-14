import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as moment from 'moment';
import * as _ from 'lodash';
@Component({
  selector: 'wm-stock-card',
  templateUrl: './stock-card.component.html',
  styles: []
})
export class StockCardComponent implements OnInit {

  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('htmlPreview') public htmlPreview: any;

  selectedGenericId: any;
  startDate: any;
  endDate: any;
  isPreview = false;
  start: any;
  end: any;
  token: any;
  warehouseId: any;
  datageneric = [];
  generic_id = [];
  myDatePickerOptions: IMyOptions = {
    inline: false,
    dateFormat: 'dd mmm yyyy',
    editableDateField: false,
    showClearDateBtn: false
  };

  constructor(
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token')
  }


  ngOnInit() {
  }

  setSelectedGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
    this.datageneric.push({
      generic_id: generic.generic_id,
      generic_name: generic.generic_name,
    });
    this.generic_id.push('genericId=' + generic.generic_id)
    // console.log(this.generic_id);
  }

  changeSearchGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }

  showReport() {
    this.start = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
    this.end = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
    const url = `${this.apiUrl}/report/generic/stock?&warehouseId=${this.warehouseId}
    &startDate=${this.start}&endDate=${this.end}&token=${this.token}&` + this.generic_id.join('&');
    this.htmlPreview.showReport(url);
  }

  refresh() {
    this.selectedGenericId = '';
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
    // console.log(this.datageneric);
    // console.log(this.generic_id);
  }

}
