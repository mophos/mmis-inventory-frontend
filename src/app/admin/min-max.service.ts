import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class MinMaxService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getHeader() {
    const resp = await this.authHttp.get(`${this.url}/min-max/header`).toPromise();
    return resp.json();
  }

  async getMinMax() {
    const resp = await this.authHttp.get(`${this.url}/min-max/detail`).toPromise();
    return resp.json();
  }

  async calculateMinMax(fromDate: any, toDate: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/calculate`, {
      fromDate: fromDate,
      toDate: toDate
    }).toPromise();
    return resp.json();
  }

  async saveGenericPlanning(fromDate: any, toDate: any, generics: any[]) {
    const resp = await this.authHttp.post(`${this.url}/min-max/save`, {
      fromDate: fromDate,
      toDate: toDate,
      generics: generics
    }).toPromise();
    return resp.json();
  }

}
