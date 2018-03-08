import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-search-product-warehouse',
  templateUrl: './search-product-warehouse.component.html'
})
export class SearchProductWarehouseComponent implements OnInit {
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  productName: string;
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();
  dataServiceProduct: any;
  _warehouseId: any;

  @Input('warehouseId')
  set setWarehouse(value: boolean) {
      this._warehouseId = value;
      this.setApiUrl();
  }
  
  query: any = null;
  searchProductUrl: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {
      this.token = sessionStorage.getItem('token');
      const decodedToken: any = this.jwtHelper.decodeToken(this.token);
      this.setApiUrl();
     }

  ngOnInit() {
  }

  setApiUrl() {
    // const productApiUrl = `${this.apiUrl}/products/search-warehouse-autocomplete?warehouseId=${this._warehouseId}&token=${this.token}&query=`;
    // this.dataServiceProduct = this.completerService.remote(productApiUrl, 'product_name', 'product_name');
    this.searchProductUrl = `${this.apiUrl}/products/search-warehouse-autocomplete?warehouseId=${this._warehouseId}&token=${this.token}`;

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
