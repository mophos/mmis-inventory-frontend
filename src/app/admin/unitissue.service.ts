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
      this.authHttp.get(`${this.url}/unitissue`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(unitissueName: string, unitissueDesc: string, israwmaterial: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/unitissue`, {
        unitissueName: unitissueName,
        unitissueDesc: unitissueDesc,
        israwmaterial: israwmaterial
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(unitissueId: any, unitissueName: string, unitissueDesc: string, israwmaterial: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/unitissue/${unitissueId}`, {
        unitissueName: unitissueName,
        unitissueDesc: unitissueDesc,
        israwmaterial: israwmaterial
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
      this.authHttp.delete(`${this.url}/unitissue/${unitissueId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
