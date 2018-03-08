import { Injectable, Inject, ChangeDetectorRef } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class PackageService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  save(largeUnit: string, smallUnit: string, largeQty: number, smallQty: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/packages`, {
        largeUnit: largeUnit,
        smallUnit: smallUnit,
        largeQty: largeQty,
        smallQty: smallQty
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(packageId: string, largeUnit: string, smallUnit: string, largeQty: number, smallQty: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/packages/${packageId}`, {
        largeUnit: largeUnit,
        smallUnit: smallUnit,
        largeQty: largeQty,
        smallQty: smallQty
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/packages`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(packageId) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/packages/${packageId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


}