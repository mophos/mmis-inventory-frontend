import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BasicService {
  constructor(private authHttp: AuthHttp, @Inject('API_URL') private url: string) {
  }

  async getProductVendors(genericId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-vendors/${genericId}`).toPromise();
    return res.json()
  }

  async getProductManufactures(genericId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-manufactures/${genericId}`).toPromise();
    return res.json()
  }

  async getProductLots(productId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-lots/${productId}`).toPromise();
    return res.json()
  }

  async getProductLotsWarehouse(productId: any, waerhouseId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-lots-warehouse/${productId}/${waerhouseId}`).toPromise();
    return res.json()
  }

  async getProductWarehouses(productId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-warehouses/${productId}`).toPromise();
    return res.json()
  }

  async getGenericWarehouses(genericId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/generic-warehouses/${genericId}`).toPromise();
    return res.json()
  }

  async getWarehouseLocation(warehouseId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/warehouse-location?warehouseId=${warehouseId}`).toPromise();
    return res.json()
  }

  async getProductLocation(productId: any) {
    const res = await this.authHttp.get(`${this.url}/basic/product-location?&productId=${productId}`).toPromise();
    return res.json()
  }

  async getPeopleList() {
    const res: any = await this.authHttp.get(`${this.url}/basic/people-list`).toPromise();
    return res.json();
  }

  async getWarehouses() {
    const res: any = await this.authHttp.get(`${this.url}/basic/warehouses`).toPromise();
    return res.json();
  }

  async getWarehousesShipping(val) {
    const res: any = await this.authHttp.get(`${this.url}/warehouses/get-shippingnetwork-list/${val}/REQ`).toPromise();
    return res.json();
  }

  async getNetworkTypes() {
    const res: any = await this.authHttp.get(`${this.url}/basic/network-types`).toPromise();
    return res.json();
  }

  async getTransactionIssues() {
    const res: any = await this.authHttp.get(`${this.url}/basic/transaction-issues`).toPromise();
    return res.json();
  }

  async getGenericTypes() {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-types`).toPromise();
    return res.json();
  }
  async getGenericTypesLV1() {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-types/lv1`).toPromise();
    return res.json();
  }
  async getGenericTypesLV2(genericTypeLV1Id) {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-types/lv2?genericTypeLV1Id=${genericTypeLV1Id}`).toPromise();
    return res.json();
  }
  async getGenericTypesLV3(genericTypeLV1Id, genericTypeLV2Id) {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-types/lv3?genericTypeLV1Id=${genericTypeLV1Id}&genericTypeLV2Id=${genericTypeLV2Id}`).toPromise();
    return res.json();
  }

  async getGenericGroupsList() {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-group-list`).toPromise();
    return res.json();
  }

  // async getProductInGroups(groupId: any) {
  //   const res: any = await this.authHttp.get(`${this.url}/basic/product-in-group?groupId=${groupId}`).toPromise();
  //   return res.json();
  // }

  async getGenericInGroups(groupId: any) {
    const res: any = await this.authHttp.get(`${this.url}/basic/generic-in-group?groupId=${groupId}`).toPromise();
    return res.json();
  }

  async getRequisitionSuccess(wmRequisition) {
    if (wmRequisition) {
      const res: any = await this.authHttp.get(`${this.url}/basic/req-success/${wmRequisition}`).toPromise();
      return res.json();
    } else {
      const res: any = await this.authHttp.get(`${this.url}/basic/req-success`).toPromise();
      return res.json();
    }
  }

  async getRequisitionSucessDetail(requisitionId) {
    const res: any = await this.authHttp.get(`${this.url}/basic/req-success-detail/${requisitionId}`).toPromise();
    return res.json();
  }


}
