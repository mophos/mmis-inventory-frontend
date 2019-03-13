import { Component, OnInit, Inject, Output, Input, EventEmitter } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-search-product',
  templateUrl: './search-product.component.html'
})
export class SearchProductComponent implements OnInit {
  // private _labelerId: string;
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();

  @Input('labelerId')
  set setLabelerId(value: string) {
    // this._labelerId = value;
    this.setApiUrl(value);
  }

  token: any;
  query: any = null;
  searchProductUrl: any;
  limitAutocomplete: any;
  public jwtHelper: JwtHelper = new JwtHelper();
  constructor(

    @Inject('API_URL') private apiUrl: string) {

    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.limitAutocomplete = decodedToken.WM_AUTOCOMPLETE;
    this.searchProductUrl = `${this.apiUrl}/products/search-autocomplete?token=${this.token}&limit=${this.limitAutocomplete}`;
  }

  ngOnInit() {
  }

  clearProductSearch() {
    this.query = null;
  }
  setApiUrl(labelerId: any) {
    // this.labelerId = labelerId;
    this.searchProductUrl = `${this.apiUrl}/products/search-autocomplete?labelerId=${labelerId}&limit=${this.limitAutocomplete}&token=${this.token}`;
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
    this.query = event.generic_name;
  }

}
