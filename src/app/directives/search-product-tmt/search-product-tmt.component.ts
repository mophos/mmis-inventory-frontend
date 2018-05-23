import { Component, OnInit, Inject, Output, Input, EventEmitter, ViewChild } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';


@Component({
  selector: 'wm-search-product-tmt',
  templateUrl: './search-product-tmt.component.html',
  styles: []
})
export class SearchProductTmtComponent implements OnInit {

  @Input('tmtId')
  set settmtId(value: any) {
    this.query = value;
  }
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  token: any;
  query: any = null;
  searchProductTMTUrl: any;
  tmt_id: any;

  constructor(

    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    this.searchProductTMTUrl = `${this.apiUrl}/products/mapping/search-product-tmt?token=${this.token}`;
  }

  ngOnInit() {
  }

  clearProductSearch() {
    this.query = null;
  }

  clearSelected(event: any) {
    if (event) {
      if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
        this.onChange.emit(false);
      } else {
        this.onChange.emit(true);
      }
    } else {
      this.onChange.emit(false);
    }
  }
  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = event.TMTID;
    this.onChange.emit(event);
  }

  set(id: any) {
    this.query = id;
  }

}
