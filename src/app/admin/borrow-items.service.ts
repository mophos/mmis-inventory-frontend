import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BorrowItemsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getWarehouseLocations(warehouseId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/locations/${warehouseId}`).toPromise();
    return rs.json();
  }

  async getSummaryInfo(borrowId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/info-summary/${borrowId}`).toPromise();
    return rs.json();
  }

  async getDetailInfo(borrowId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/info-detail/${borrowId}`).toPromise();
    return rs.json();
  }

  async getDetailInfoEdit(borrowId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/info-detail-edit/${borrowId}`).toPromise();
    return rs.json();
  }

  getProductsWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrow/product-warehouse/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductForBorrow(productId: string, warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrow/product-borrow`, {
        productId: productId,
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

  async saveBorrow(summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow/save`, {
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async approveAll(borrowIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow/approve-all`, {
      borrowIds: borrowIds
    }).toPromise();

    return rs.json();
  }

  async updateBorrow(borrowId: any, summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.put(`${this.url}/borrow/save/${borrowId}`, {
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async list(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/list?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  detail(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrow/detail/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async remove(borrowId: string) {
    const rs = await this.authHttp.delete(`${this.url}/borrow/${borrowId}`).toPromise();
    return rs.json();
  }

  async approve(borrowId: string) {
    const rs = await this.authHttp.post(`${this.url}/borrow/approve`, {
      borrowId: borrowId
    }).toPromise();
    return rs.json();
  }

  async active(borrowId: string) {
    const rs = await this.authHttp.post(`${this.url}/borrow/active`, {
      borrowId: borrowId
    }).toPromise();
    return rs.json();
  }

  async getLots(productId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow/product-warehouse-lots/${productId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async allocate(data: any, srcWarehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate`, {
      data: data,
      srcWarehouseId: srcWarehouseId
    }).toPromise();
    return rs.json();
  }

  async confirmAll(borrowIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow/confirm`, {
      borrowIds: borrowIds
    }).toPromise();

    return rs.json();
  }

  async request(limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/request?limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

}
