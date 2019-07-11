import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ReportsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getReportProcess() {
    const res = await this.authHttp.get(`${this.url}/reports/process`).toPromise();
    return res.json();
  }
  async monthlyReport(month, year, type, warehouseId) {
    const url = `${this.url}/reports/monthlyReport?month=${month}&year=${year}&` + type.join('&') + `&warehouseId=${warehouseId}`
    this.authHttp.get(url).toPromise();
    return true;
  }

  async monthlyReportAll(month, year, type, warehouseId) {
    const url = `${this.url}/reports/monthlyReportAll?month=${month}&year=${year}&` + type.join('&') + `&warehouseId=${warehouseId}`
    this.authHttp.get(url).toPromise();
    return true;
  }


}
