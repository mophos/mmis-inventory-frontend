import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class ProductionUnitService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/production-units`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(productionUnitName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/production-units`, {
        productionUnitName: productionUnitName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(productionUnitId: any, productionUnitName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/production-units/${productionUnitId}`, {
        productionUnitName: productionUnitName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(productionUnitId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/production-units/${productionUnitId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}