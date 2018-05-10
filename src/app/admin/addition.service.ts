import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AdditionService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouse() {
    const resp = await this.authHttp.get(`${this.url}/addition/warehouse`).toPromise();
    return resp.json();
  }

  async getWarehouseGeneric(dstWarehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/warehouse/generic/${dstWarehouseId}`).toPromise();
    return resp.json();
  }

  async getGeneric() {
    const resp = await this.authHttp.get(`${this.url}/addition/generic`).toPromise();
    return resp.json();
  }

  async getGenericWarehouse(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/generic/warehouse/${genericId}`).toPromise();
    return resp.json();
  }

  async getDashboardGeneric(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/dashboard/generic/${genericId}`).toPromise();
    return resp.json();
  }

  async getDashboardWarehouse(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/dashboard/warehouse/${warehouseId}`).toPromise();
    return resp.json();
  }

  async getAddition(limit: number = 10, offset: number = 0) {
    const resp = await this.authHttp.post(`${this.url}/addition/list`, {
      limit: limit,
      offset: offset
    }).toPromise();
    return resp.json();
  }

  async getTransaction(status: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/list/${status}`).toPromise();
    return resp.json();
  }

  async getTransactionHistory() {
    const resp = await this.authHttp.get(`${this.url}/addition/history`).toPromise();
    return resp.json();
  }

  async getTransactionInfo(transactionId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/info/${transactionId}`).toPromise();
    return resp.json();
  }

  async getTransactionProduct(transactionId: any, genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/addition/product/${transactionId}/${genericId}`).toPromise();
    return resp.json();
  }

  async saveAdditionWarehouse(dstWarehouseId: any, detail: any[]) {
    const resp = await this.authHttp.post(`${this.url}/addition/warehouse`, {
      dstWarehouseId: dstWarehouseId,
      data: detail
    }).toPromise();
    return resp.json();
  }

  async saveAdditionGeneric(data: any[]) {
    const resp = await this.authHttp.post(`${this.url}/addition/generic`, {
      data: data
    }).toPromise();
    return resp.json();
  }

  async openTransactions(transactionIds: any[]) {
    const res = await this.authHttp.post(`${this.url}/addition/open`, {
      transactionIds: transactionIds
    }).toPromise();
    return res.json();
  }


  async approveTransactions(transactionIds: any[]) {
    const res = await this.authHttp.post(`${this.url}/addition/approve`, {
      transactionIds: transactionIds
    }).toPromise();
    return res.json();
  }

  async cancelTransactions(transactionId: any) {
    const res = await this.authHttp.post(`${this.url}/addition/cancel`, {
      transactionId: transactionId
    }).toPromise();
    return res.json();
  }

}
