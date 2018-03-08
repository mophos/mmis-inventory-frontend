import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import * as moment from 'moment';
@Injectable()
export class PeriodService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  async getYear(year: any) {
    const response = await this.authHttp.get(`${this.url}/period/getall/${year}`)
      .toPromise();
    return response.json();
  }
  async selectYear(){
      const response = await this.authHttp.get(`${this.url}/period/selectyear`)
      .toPromise();
    return response.json();
  }
  getPeriod() {
    moment.locale('th');
    const month: any = moment(new Date()).format('MM');
    const year: any = moment(new Date()).get('year');
    if (month < 10) {
      return year;
    }
    if (month >= 10) {
      return (year + 1);
    }
  }
  async getPo(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/po/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async getReceive(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/receive/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async getReceiveOther(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/receiveOther/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async getRequisition(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/requisition/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async getIssue(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/issue/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async getTransfer(startdate: any, enddate: any) {
    const response = await this.authHttp.get(`${this.url}/period/transfer/${startdate}/${enddate}`)
      .toPromise();
    return response.json();
  }
  async updateCloseDate(id: any, date: any) {
    const response = await this.authHttp.put(`${this.url}/period/close`, { "id": id, "date": date })
      .toPromise();
    return response.json();
  }
  async log(period_id: any, budget_year: any, period_year: any, period_month: any, status: any, date: any) {
    const response = await this.authHttp.post(`${this.url}/period/log`,
      {
        period_id: period_id,
        budget_year: budget_year,
        period_year: period_year,
        period_month: period_month,
        status: status,
        date: date
      })
      .toPromise();
    return response.json();
  }
  async updateOpenDate(id: any) {
    const response = await this.authHttp.put(`${this.url}/period/open`, { "id": id })
      .toPromise();
    return response.json();
  }

  getenddate(value: any) {
    const month: any = moment(value).format('M');
    const year: any = moment(new Date()).get('year');
    let y: any;
    if (month < 10) {
      y = year;
    }
    if (month >= 10) {
      y = (year + 1);
    }
    y = moment(y).format('YYYY');
    const date = y + '-' + month;
    const days = moment(date, "YYYY-MM").daysInMonth();
    return days;
  }
  getdate() {
    const today = moment(new Date()).format('YYYY-MM-D');
    return today;
  }
  getmonth() {
    const today = moment(new Date()).format('YYYY-MM');
    return today;
  }
  async finalclose(id: any) {
    const response = await this.authHttp.put(`${this.url}/period/finalclose`, { "id": id })
      .toPromise();
    return response.json();
  }
  async getStatus(date) {
    const response = await this.authHttp.get(`${this.url}/period/status?date=${date}`)
      .toPromise();
    return response.json();
  }
}
