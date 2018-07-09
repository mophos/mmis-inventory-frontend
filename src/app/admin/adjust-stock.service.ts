import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class AdjustStockService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) {

  }

  async getList(limit, offset) {
    const rs = await this.authHttp.get(`${this.url}/adjust-stock/list?limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async getGeneric(adjustId) {
    const rs = await this.authHttp.get(`${this.url}/adjust-stock/generic?adjustId=${adjustId}`).toPromise();
    return rs.json();
  }

  async checkPassword(password) {
    const rs = await this.authHttp.post(`${this.url}/adjust-stock/check/password`, { password: password }).toPromise();
    return rs.json();
  }

  async save(head, detail) {
    const rs = await this.authHttp.post(`${this.url}/adjust-stock`, { 'head': head, 'detail': detail }).toPromise();
    return rs.json();
  }
}
