import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as moment from 'moment';
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
  }

  changeSearchGeneric(generic) {
    this.selectedGenericId = generic.generic_id;
  }

  showReport() {
    if (this.selectedGenericId !== '' && this.startDate !== '' && this.endDate !== '') {
      this.start = this.startDate ? moment(this.startDate.jsdate).format('YYYY-MM-DD') : null;
      this.end = this.endDate ? moment(this.endDate.jsdate).format('YYYY-MM-DD') : null;
      const url = `${this.apiUrl}/report/generic/stock/${this.selectedGenericId}?&warehouseId=${this.warehouseId}
      &startDate=${this.start}&endDate=${this.end}&token=${this.token}`;
      this.htmlPreview.showReport(url);
      console.log(this.warehouseId);
    }
  }

  refresh() {
    this.selectedGenericId = '';
    this.startDate = '';
    this.endDate = '';
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

}
