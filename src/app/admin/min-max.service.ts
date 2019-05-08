import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class MinMaxService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getMinMaxGroupDetail(minMaxGroupId: any, genericType: any, query: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/minmax-group-detail`, {
      minMaxGroupId: minMaxGroupId,
      genericType: genericType,
      query: query
    }).toPromise();
    return resp.json();
  }

  async getMinMaxGroup() {
    const resp = await this.authHttp.get(`${this.url}/min-max/minmax-group`).toPromise();
    return resp.json();
  }

  async getHeader() {
    const resp = await this.authHttp.get(`${this.url}/min-max/header`).toPromise();
    return resp.json();
  }
  async getHeaderGroup(minMaxGroupId) {
    const resp = await this.authHttp.get(`${this.url}/min-max/header-group?groupId=${minMaxGroupId}`).toPromise();
    return resp.json();
  }

  async getMinMax(genericType: any, query: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/detail`, {
      genericType: genericType,
      query: query
    }).toPromise();
    return resp.json();
  }

  async calculateMinMax(fromDate: any, toDate: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/calculate`, {
      fromDate: fromDate,
      toDate: toDate
    }).toPromise();
    return resp.json();
  }
  async calculateMinMaxGroup(fromDate: any, toDate: any, minMaxGroupId: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/calculate-group`, {
      fromDate: fromDate,
      toDate: toDate,
      minMaxGroupId: minMaxGroupId
    }).toPromise();
    return resp.json();
  }
  async saveGenericPlanning(processDate: any, generics: any[], groupId = 0) {
    const resp = await this.authHttp.post(`${this.url}/min-max/save`, {
      processDate: processDate,
      generics: generics,
      groupId: groupId
    }).toPromise();
    return resp.json();
  }
  async searchGenericsGroupWarehosue(genericType: string, query: string, minMaxGroupId: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/search-group`, {
      query: query,
      genericType: genericType,
      minMaxGroupId: minMaxGroupId
    }).toPromise();
    return resp.json();
  }
  async searchGenericsWarehosue(genericType: string, query: string) {
    const resp = await this.authHttp.post(`${this.url}/min-max/search`, {
      query: query,
      genericType: genericType
    }).toPromise();
    return resp.json();
  }

}
