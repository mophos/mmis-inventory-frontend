import { Component, OnInit, Inject, Output, EventEmitter, Input } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-search-product-warehouse-staff',
  templateUrl: './search-product-warehouse-staff.component.html'
})
export class SearchProductWarehouseStaffComponent implements OnInit {
  @Output('onSelect') onSelect: EventEmitter<any> = new EventEmitter<any>();
  @Output('onChange') onChange: EventEmitter<any> = new EventEmitter<any>();
  productName: string;
  token: any;
  jwtHelper: JwtHelper = new JwtHelper();

  @Input() warehouseId: any;

  query: any = null;
  searchProductUrl: any;

  constructor(
    @Inject('API_URL') private apiUrl: string) {
    this.token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(this.token);
    this.searchProductUrl = `${this.apiUrl}/staff/products/search-in-warehouses&token=${this.token}`;
  }

  ngOnInit() { }

  setSelectedProduct(event) {
    try {
      this.productName = `${event.product_name}`
      this.onSelect.emit(event);
    } catch (error) {
      //
    }
  }

  clearSearch() {
    this.query = null;
  }

  handleResultSelected(event: any) {
    this.onSelect.emit(event);
    this.query = event.product_name;
  }

}
