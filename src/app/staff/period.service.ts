import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import * as moment from 'moment';

@Injectable()
export class PeriodService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp) { }

  async getStatus(date) {
    const response = await this.authHttp.get(`${this.url}/staff/period/status?date=${date}`)
      .toPromise();
    return response.json();
  }
}