import { StaffService } from './../staff.service';
import { AlertService } from 'app/alert.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'wm-product-requisition',
  templateUrl: './product-requisition.component.html',
  styles: []
})
export class ProductRequisitionComponent implements OnInit {

  warehouseId: any;
  jwtHelper: JwtHelper = new JwtHelper();
  token: any;
  genericTypes = [];
  genericType = 'all';
  products = [];
  generics = [];
  query = '';
  genericTypesAll = [];
  @ViewChild('modalLoading') public modalLoading: any;
  constructor(
    private alertService: AlertService,
    private staffService: StaffService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  async ngOnInit() {
    if (!this.warehouseId) {
      this.alertService.error('ไม่พบรหัสคลังสินค้า');
    } else {
      await this.getGenericType();
      await this.getProducts();
      await this.getGenerics();
    }
  }

  async getGenericType() {
    try {
      this.modalLoading.show();
      const rs = await this.staffService.getGenericType();
      if (rs.ok) {
        this.genericTypes = rs.rows;
        rs.rows.forEach(t => {
          this.genericTypesAll.push(t.generic_type_id);
        });
      } else {
        this.alertService.error(rs.error);
      }

      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      console.log(error);
      this.alertService.serverError();
    }
  }

  async getProducts() {
    try {
      this.modalLoading.show();
      let result;
      let type;
      if (this.genericType === 'all') {
        type = this.genericTypesAll;
      } else {
        type = this.genericType
      }
      if (!this.query) {
        result = await this.staffService.getProductsWarehouse(type)
      } else {
        result = await this.staffService.getProductsWarehouseSearch(type, this.query)
      }
      if (result.ok) {
        this.products = result.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error);
    }

  }

  async getGenerics() {
    try {
      this.modalLoading.show();
      let result;
      let type;
      if (this.genericType === 'all') {
        type = this.genericTypesAll;
      } else {
        type = this.genericType
      }
      console.log(type);
      if (!this.query) {
        result = await this.staffService.getGenericsRequisitionWarehouse(type);
      } else {
        result = await this.staffService.getGenericsRequisitionWarehouseSearch(type, this.query)
      }
      if (result.ok) {
        this.generics = result.rows;
      } else {
        this.alertService.error('เกิดข้อผิดพลาด: ' + JSON.stringify(result.error));
      }
      this.modalLoading.hide();
    } catch (error) {
      this.modalLoading.hide();
      this.alertService.error(error);
    }
  }

  enterSearch(e) {
    if (e.keyCode === 13) {
      this.getProducts();
    }
  }

  enterSearchGeneric(e) {
    if (e.keyCode === 13) {
      this.getGenerics();
    }
  }
}
