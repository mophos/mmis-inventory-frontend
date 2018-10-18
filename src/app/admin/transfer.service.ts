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

  async getWarehouseLocations(warehouseId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/locations/${warehouseId}`).toPromise();
    return rs.json();
  }

  async getSummaryInfo(transferId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/info-summary/${transferId}`).toPromise();
    return rs.json();
  }

  async getDetailInfo(transferId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/info-detail/${transferId}`).toPromise();
    return rs.json();
  }

  async getDetailInfoEdit(transferId: string) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/info-detail-edit/${transferId}`).toPromise();
    return rs.json();
  }

  getProductsWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/transfer/product-warehouse/${warehouseId}`)
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
      this.authHttp.post(`${this.url}/transfer/product-transfer`, {
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
    const rs: any = await this.authHttp.post(`${this.url}/transfer/save`, {
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async approveAll(transferIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/transfer/approve-all`, {
      transferIds: transferIds
    }).toPromise();

    return rs.json();
  }

  async updateTransfer(transferId: any, summary: Object, generics: any[]) {
    const rs: any = await this.authHttp.put(`${this.url}/transfer/save/${transferId}`, {
      summary: summary,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async list(type: any, limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/list?t=${type}&limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  detail(transferId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/transfer/detail/${transferId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async remove(transferId: string) {
    const rs = await this.authHttp.delete(`${this.url}/transfer/${transferId}`).toPromise();
    return rs.json();
  }

  async approve(transferId: string) {
    const rs = await this.authHttp.post(`${this.url}/transfer/approve`, {
      transferId: transferId
    }).toPromise();
    return rs.json();
  }

  async active(transferId: string) {
    const rs = await this.authHttp.post(`${this.url}/transfer/active`, {
      transferId: transferId
    }).toPromise();
    return rs.json();
  }

  async getLots(productId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/transfer/product-warehouse-lots/${productId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async allocate(data: any, srcWarehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate`, {
      data: data,
      srcWarehouseId: srcWarehouseId
    }).toPromise();
    return rs.json();
  }

  async confirmAll(transferIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/transfer/confirm`, {
      transferIds: transferIds
    }).toPromise();

    return rs.json();
  }

  async request(limit: number, offset: number) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/request?limit=${limit}&offset=${offset}`).toPromise();
    return rs.json();
  }

  async getTemplateItems(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/transfer/templates-items/${templateId}`).toPromise();
    return rs.json();
  }

}
