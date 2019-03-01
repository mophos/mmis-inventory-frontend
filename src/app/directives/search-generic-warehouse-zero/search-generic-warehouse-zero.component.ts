import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-search-generic-warehouse-zero',
  templateUrl: './search-generic-warehouse-zero.component.html',
})
export class SearchGenericWarehouseZeroComponent implements OnInit {
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  productName: string;
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  dataServiceProduct: any;
  _warehouseId: any;
  setZreo = false;
  @Input('zero')
  set setWarehouseZero(value: boolean) {
    this.setZreo = value
  }
  @Input('warehouseId')
  set setWarehouse(value: boolean) {
    this._warehouseId = value;
    this.setApiUrl();
  }

  @Input('disabled')
  set setDisabled(value: boolean) {
    this._disabled = value;
  }

  query: any = null;
  searchProductUrl: any;
  _disabled = false;

  constructor(
    @Inject('API_URL') private apiUrl: string) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.setApiUrl();
  }

  ngOnInit() {
  }

  setApiUrl() {
    if (this.setZreo) {
      this.searchProductUrl = `${this.apiUrl}/generics/search-warehouse-setzero-autocomplete?warehouseId=${this._warehouseId}&token=${this.token}`;
    } else {
      this.searchProductUrl = `${this.apiUrl}/generics/search-warehouse-zero-autocomplete?warehouseId=${this._warehouseId}&token=${this.token}`;
    }

  }

  setSelectedProduct(event) {
    try {
      this.productName = `${event.originalObject.product_name}`
      this.onSelect.emit(event.originalObject);
    } catch (error) {
      //
    }
  }

  clearProductSearch() {
    this.query = null;
  }

  clearSelected(event: any) {
    if (event.keyCode === 13 || event.keyCode === 37 || event.keyCode === 38 || event.keyCode === 39 || event.keyCode === 40) {
      this.onChange.emit(false);
    } else {
      this.onChange.emit(true);
    }
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = event.generic_name;
  }

}

