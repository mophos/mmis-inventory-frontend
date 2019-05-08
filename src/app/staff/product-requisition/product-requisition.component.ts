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
  generics = [];
  query = '';
  genericTypeMultis: any;
  @ViewChild('modalLoading') public modalLoading: any;
  @ViewChild('genericTypeMulti') public genericTypeMulti: any;
  constructor(
    private alertService: AlertService,
    private staffService: StaffService
  ) {
    this.token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    this.warehouseId = decodedToken.warehouseId;
  }

  async ngOnInit() {
    this.genericTypeMultis = this.genericTypeMulti.getDefaultGenericType();
    if (!this.warehouseId) {
      this.alertService.error('ไม่พบรหัสคลังสินค้า');
    } else {
      await this.getGenerics();
    }
  }
  selectGenericTypeMulti(e) {
    this.genericTypeMultis = e;
    this.getGenerics();
  }


  async getGenerics() {
    try {
      this.modalLoading.show();
      let result;
      if (!this.query) {
        result = await this.staffService.getGenericsRequisitionWarehouse(this.genericTypeMultis);
      } else {
        result = await this.staffService.getGenericsRequisitionWarehouseSearch(this.genericTypeMultis, this.query)
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

  enterSearchGeneric(e) {
    if (e.keyCode === 13) {
      this.getGenerics();
    }
  }
}
