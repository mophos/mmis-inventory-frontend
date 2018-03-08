import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class LotService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  allProducts() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/lots/all-products`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getLots(productId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/lots/get-lots/${productId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getLotsWarehouse(productId: any, wmWithdraw: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/lots/get-lots-warehouse/${productId}/${wmWithdraw}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  save(lotNo: string, expiredDate: string, productId: string, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/lots`, {
        lotNo: lotNo,
        expiredDate: expiredDate,
        productId: productId,
        isActive: isActive
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(lotId: any, lotNo: string, expiredDate: string, isActive: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/lots/${lotId}`, {
        lotNo: lotNo,
        expiredDate: expiredDate,
        isActive: isActive
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(lotId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/lots/${lotId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
