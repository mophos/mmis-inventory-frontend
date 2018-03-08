import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class TransferService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getProductsWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/transfer/product-warehouse/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductForTransfer(productId: string, warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/transfer/product-transfer`, {
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

  async saveTransfer(summary: Object, generics: any[]) {
    let rs = await this.authHttp.post(`${this.url}/staff/transfer/save`, {
      summary: summary,
      generics: generics
    }).toPromise();
    return rs.json();
  }

  approveTransfer(transferId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/transfer/approved`, {
        transferId: transferId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  all(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/transfer/all/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  request(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/transfer/request/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  detail(transferId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/transfer/detail/${transferId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getProductRemain(productId: any, lotId: any) {
    const resp = await this.authHttp.post(`${this.url}/staff/products/remain`, {
      productId: productId,
      lotId: lotId
    }).toPromise();
    return resp.json();
  }

  async remove(transferId: string) {
    const rs = await this.authHttp.delete(`${this.url}/staff/transfer/${transferId}`).toPromise();
    return rs.json();
  }

  // async approve(transferId: string) {
  //   const rs = await this.authHttp.post(`${this.url}/staff/transfer/approve/${transferId}`, {}).toPromise();
  //   return rs.json();
  // }

  async getLots(productId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/staff/transfer/product-warehouse-lots/${productId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async active(transferId: string) {
    const rs = await this.authHttp.post(`${this.url}/staff/transfer/active`, {
      transferId: transferId
    }).toPromise();
    return rs.json();
  }

  async getSummaryInfo(transferId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/transfer/info-summary/${transferId}`).toPromise();
    return rs.json();
  }

  async getDetailInfo(transferId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/transfer/info-detail/${transferId}`).toPromise();
    return rs.json();
  }

  async approveAll(transferIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/transfer/approve`, {
      transferIds: transferIds
    }).toPromise();

    return rs.json();
  }

  async updateTransfer(transferId: any, summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.put(`${this.url}/staff/transfer/save/${transferId}`, {
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async allocate(data: any, srcWarehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate`, {
      data: data,
      srcWarehouseId: srcWarehouseId
    }).toPromise();
    return rs.json();
  }
}
