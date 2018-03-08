import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class CountingService{
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async allProducts() {
    const resp = await this.authHttp.get(`${this.url}/counting/product-all`).toPromise();
    return resp.json();
  }

  async list() {
    const resp = await this.authHttp.get(`${this.url}/counting/list`).toPromise();
    return resp.json();
  }

  async getProductListByCounting(countId: any) {
    const resp = await this.authHttp.get(`${this.url}/counting/products-list/${countId}`).toPromise();
    return resp.json();
  }

  async getProductListByCountingForAdjust(countId: any) {
    const resp = await this.authHttp.get(`${this.url}/counting/adjust/products-list/${countId}`).toPromise();
    return resp.json();
  }

  async getPeoples() {
    const resp = await this.authHttp.get(`${this.url}/counting/people-list`).toPromise();
    return resp.json();
  }

  async saveVerify(countId: any, verifyDate: any, products: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/verify`, {
      countId: countId,
      verifyDate: verifyDate,
      products: products
    }).toPromise();
    return resp.json();
  }

  async updateAdjustStatus(countId: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/adjust/update-status`, {
      countId: countId
    }).toPromise();
    return resp.json();
  }

  async saveConfirmed(countDetailId: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/adjust/confirmed`, {
      countDetailId: countDetailId
    }).toPromise();
    return resp.json();
  }

  async allByWarehouse(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/counting/product-all-warehouse/${warehouseId}`).toPromise();
    return resp.json();
  }

  async saveCounting(summaryData: any, products: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/save`, {
      warehouseId: summaryData.warehouseId,
      countDate: summaryData.countDate,
      products: products
    }).toPromise();
    return resp.json();
  }

  async removeCounting(countId: any) {
    const resp = await this.authHttp.delete(`${this.url}/counting/${countId}`).toPromise();
    return resp.json();
  }

  async getEventTime() {
    const resp = await this.authHttp.get(`${this.url}/counting/cycle/setting/event-time`).toPromise();
    return resp.json();
  }

  async saveEventTime(eventTime: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/cycle/setting/event-time`, {
      eventTime: eventTime
    }).toPromise();
    return resp.json();
  }

  async getEventStatus() {
    const resp = await this.authHttp.get(`${this.url}/counting/cycle/setting/event-status`).toPromise();
    return resp.json();
  }

  async saveEventStatus(eventStatus: any) {
    const resp = await this.authHttp.post(`${this.url}/counting/cycle/setting/event-status`, {
      eventStatus: eventStatus
    }).toPromise();
    return resp.json();
  }

  async startNewCycleCounting() {
    const resp = await this.authHttp.post(`${this.url}/counting/cycle/start-new-counting`, {}).toPromise();
    return resp.json();
  }

  async getCycleLogs() {
    const resp = await this.authHttp.get(`${this.url}/counting/cycle/logs`).toPromise();
    return resp.json();
  }

  async getRemainInWarehouse(productId: any) {
    const resp = await this.authHttp.get(`${this.url}/counting/cycle/remain-in-warehouse/${productId}`).toPromise();
    return resp.json();
  }

}
