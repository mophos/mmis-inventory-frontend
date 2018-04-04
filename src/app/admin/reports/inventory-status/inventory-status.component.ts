import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { SearchGenericAutocompleteComponent } from 'app/directives/search-generic-autocomplete/search-generic-autocomplete.component';
import * as moment from 'moment';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { ReportProductsService } from './../reports-products.service';
import { AlertService } from './../../../alert.service';
import * as _ from 'lodash';
import { ProductsService } from '../../products.service';
@Component({
  selector: 'wm-inventory-status',
  templateUrl: './inventory-status.component.html',
  styles: []
})
export class InventoryStatusComponent implements OnInit {

  @ViewChild('searchGenericCmp') public searchGenericCmp: SearchGenericAutocompleteComponent;
  @ViewChild('htmlPreview') public htmlPreview: any;

  token: any;
  warehouseId: any;
  genericTypes = [];
  genericType: any = "";
  genericTypeIds = [];

  jwtHelper: JwtHelper = new JwtHelper();

  constructor(
    private alertService: AlertService,
    private productService: ProductsService,
    @Inject('API_URL') private apiUrl: string
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.genericTypeIds = decodedToken.generic_type_id ? decodedToken.generic_type_id.split(',') : [];
    this.warehouseId = decodedToken.warehouseId;
  }


  ngOnInit() {
    this.getGenericType();
  }

  setSelectedWarehouse(event) {
    this.warehouseId = event.warehouse_id;
  }

  async getGenericType() {
    try {
      const rs = await this.productService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
      } else {
        this.alertService.error(rs.error);
      }
    } catch (error) {
      console.log(error);
      this.alertService.serverError();
    }
  }

  changeGenericType() {
    console.log(this.genericType);
  }

  inventoryStatus() {
    const url = `${this.apiUrl}/report/inventorystatus/${this.warehouseId}/${this.genericType}?token=${this.token}`
    this.htmlPreview.showReport(url);
  }
}
