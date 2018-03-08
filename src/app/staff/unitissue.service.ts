import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class UnitissueService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffunitissue`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(unitissueName: string, unitissueDesc: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffunitissue`, {
        unitissueName: unitissueName,
        unitissueDesc: unitissueDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(unitissueId: any, unitissueName: string, unitissueDesc: string) {
    // console.log("service id:" + unitissueId);
    // console.log("service name: " + unitissueName);
    // console.log("service desc: " + unitissueDesc);
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/staffunitissue/${unitissueId}`, {
        unitissueName: unitissueName,
        unitissueDesc: unitissueDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(unitissueId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/staffunitissue/${unitissueId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
