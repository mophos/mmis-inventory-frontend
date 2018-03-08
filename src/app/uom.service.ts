import { AuthHttp } from 'angular2-jwt';
import { Injectable, Inject } from '@angular/core';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UomService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getActiveUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/active`).toPromise();
    return resp.json();
  }

  async getActiveProductUnits(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/active/${genericId}`).toPromise();
    return resp.json();
  }

  async getPrimaryUnits() {
    const resp = await this.authHttp.get(`${this.url}/units/active-primary`).toPromise();
    return resp.json();
  }

  async saveConversion(genericId: any, fromUnitId: any, toUnitId: any, qty: number, isActive: any, cost: any) {
    const resp = await this.authHttp.post(`${this.url}/units/conversion/${genericId}`, {
      fromUnitId: fromUnitId,
      toUnitId: toUnitId,
      qty: qty,
      isActive: isActive,
      cost: cost
    }).toPromise();
    return resp.json();
  }

  async updateConversion(unitGenericId: any, genericId: any, fromUnitId: any, toUnitId: any, qty: number, isActive: any, cost: any) {
    const resp = await this.authHttp.put(`${this.url}/units/conversion/${unitGenericId}/${genericId}`, {
      fromUnitId: fromUnitId,
      toUnitId: toUnitId,
      qty: qty,
      isActive: isActive,
      cost: cost
    }).toPromise();
    return resp.json();
  }

  async getConversionList(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/conversion/${genericId}`).toPromise();
    return resp.json();
  }

  async getProductPrimaryUnit(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/units/generic/primary-unit/${genericId}`).toPromise();
    return resp.json();
  }

  async removeConversion(unitGenericId: any) {
    const resp = await this.authHttp.delete(`${this.url}/units/conversion/${unitGenericId}`).toPromise();
    return resp.json();
  }

}
