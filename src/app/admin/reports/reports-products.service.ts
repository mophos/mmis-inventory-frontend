import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class ReportProductsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getProductRemain(warehouseId: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/reports/products/remain`, {
        warehouseId: warehouseId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductRemainAllWarehouse(productId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/reports/products/remain-all-warehouse`, {
        productId: productId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductReceives(productId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/reports/products/receives`, {
        productId: productId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getGenericInStockcrad(warehouseId: any, startDate: any, endDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/reports/products/genericinstockcrad`, {
        warehouseId: warehouseId,
        startDate: startDate,
        endDate: endDate
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}
