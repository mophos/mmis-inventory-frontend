import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ReturnBudgetService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getPurchasesList(limit: number = 100, offset: number = 0, sort: any = {}, query: any) {
    const res = await this.authHttp.post(`${this.url}/return-budget/purchases/list`, {
      query: query,
      limit: limit,
      offset: offset,
      sort: sort
    }).toPromise();

    return res.json();
  }

  async getReceivesList(purchaseId: any) {
    const res = await this.authHttp.post(`${this.url}/return-budget/receives/list`, {
      purchaseId: purchaseId
    }).toPromise();

    return res.json();
  }

  async getHistoryList(limit: number = 100, offset: number = 0, sort: any = {}, query: any, status: any) {
    const res = await this.authHttp.post(`${this.url}/return-budget/history/list`, {
      query: query,
      status: status,
      limit: limit,
      offset: offset,
      sort: sort
    }).toPromise();

    return res.json();
  }

  async notReturnBudget(purchaseId: any) {
    const res = await this.authHttp.put(`${this.url}/return-budget/purchases/not-return`, {
      purchaseId: purchaseId
    }).toPromise();

    return res.json();
  }

  async returnBudget(purchaseId: any, returnPrice: any) {
    const res = await this.authHttp.put(`${this.url}/return-budget/purchases/return`, {
      purchaseId: purchaseId,
      returnPrice: returnPrice
    }).toPromise();

    return res.json();
  }

}
