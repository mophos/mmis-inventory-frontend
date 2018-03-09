import { Component, OnInit, ViewChild } from '@angular/core';
import { IMyOptions } from 'mydatepicker-th';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';

@Component({
  selector: 'wm-stock-card',
  templateUrl: './stock-card.component.html',
  styles: []
})
export class StockCardComponent implements OnInit {

  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;

  selectedGenericId: any;
  startDate: any;
  endDate: any;
  isPreview = false;

  constructor() { }


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

    }
  }

  refresh() {
    this.selectedGenericId = '';
    this.startDate = '';
    this.endDate = '';
  }

}
