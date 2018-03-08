import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransferDashboardService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouse() {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/warehouse`).toPromise();
    return resp.json();
  }

  async getWarehouseGeneric(dstWarehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/warehouse/generic/${dstWarehouseId}`).toPromise();
    return resp.json();
  }

  async getGenericDetail(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/generic/detail/${genericId}`).toPromise();
    return resp.json();
  }

  async getDashboardGeneric(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/dashboard/generic/${genericId}`).toPromise();
    return resp.json();
  }

  async getDashboardWarehouse(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/dashboard/warehouse/${warehouseId}`).toPromise();
    return resp.json();
  }

  async getDashboardProduct(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/dashboard/product/${genericId}`).toPromise();
    return resp.json();
  }

  async getTransaction(limit: number = 10, offset: number = 0) {
    const resp = await this.authHttp.post(`${this.url}/transfer-dashboard/transaction/list`, {
      limit: limit,
      offset: offset
    }).toPromise();
    return resp.json();
  }

  async getTransactionHistory(limit: number = 10, offset: number = 0) {
    const resp = await this.authHttp.post(`${this.url}/transfer-dashboard/transaction/history`, {
      limit: limit,
      offset: offset
    }).toPromise();
    return resp.json();
  }

  async getTransactionInfo(transactionId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/transaction/info/${transactionId}`).toPromise();
    return resp.json();
  }

  async getTransactionProduct(transactionId: any, genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/transfer-dashboard/transaction/product/${transactionId}/${genericId}`).toPromise();
    return resp.json();
  }

  async saveTransaction(header: any, detail: any[]) {
    const resp = await this.authHttp.post(`${this.url}/transfer-dashboard`, {
      header: header,
      data: detail
    }).toPromise();
    return resp.json();
  }

  async updateTransaction(header: any, detail: any[]) {
    const res = await this.authHttp.put(`${this.url}/transfer-dashboard`, {
      header: header,
      data: detail
    }).toPromise();
    return res.json();
  }

  async approveTransactions(transactionIds: any[]) {
    const res = await this.authHttp.post(`${this.url}/transfer-dashboard/transaction/approve`, {
      transactionIds: transactionIds
    }).toPromise();
    return res.json();
  }

  async cancelTransactions(transactionId: any) {
    const res = await this.authHttp.post(`${this.url}/transfer-dashboard/transaction/cancel`, {
      transactionId: transactionId
    }).toPromise();
    return res.json();
  }

  async getProductBookingQty(productId: any, lotNo: any, expiredDate: any) {
    const resp = await this.authHttp.post(`${this.url}/transfer-dashboard`, {
      productId: productId,
      lotNo: lotNo,
      expiredDate: expiredDate
    }).toPromise();
    return resp.json();
  }

}
