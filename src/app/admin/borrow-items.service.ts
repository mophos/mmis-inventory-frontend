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

  async getDetailStockcardInfo(borrowId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/info-detail/stockcard/${borrowId}`).toPromise();
    return rs.json();
  }

  async getDetailInfoEdit(borrowId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/info-detail-edit/${borrowId}`).toPromise();
    return rs.json();
  }

  async getReturnedDetail(returnedId: any) {
    const res = await this.authHttp.get(`${this.url}/borrow/returned/detail/${returnedId}`).toPromise();
    return res.json();
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

  async saveBorrowFromNote(summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow/save/from-note`, {
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

  async approveAllOther(borrowOtherIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow-other/approve-all`, {
      borrowOtherIds: borrowOtherIds
    }).toPromise();

    return rs.json();
  }

  async approveAllReturned(returnedIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/borrow/returned/approved`, {
      returnedIds: returnedIds
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

  async stockcardBorrows(borrowId: any, summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.put(`${this.url}/tools/stockcard/borrow`, {
      borrowId: borrowId,
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async list(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/list?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async listOther(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/list/other?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async listBorrow(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/list-borrow?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async listOtherBorrow(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/list-borrow/other?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async returnedList(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/borrow/returned/list?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  detail(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/basic/dst-borrow/detail/${borrowId}`)
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

  async removeOther(borrowId: string) {
    const rs = await this.authHttp.delete(`${this.url}/borrow/other/${borrowId}`).toPromise();
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

  async allocateBorrow(data: any, srcWarehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate-borrow`, {
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

  async saveReceive(summary: any, products: Array<any>) {
    const res = await this.authHttp.post(`${this.url}/borrow/returned-product`, {
      summary: summary,
      products: products
    }).toPromise();

    return res.json();
  }

  async getReturnedProducts(returnedId) {
    const res = await this.authHttp.get(`${this.url}/basic/returned/product-list/${returnedId}`)
      .toPromise();
    return res.json();
  }
}
