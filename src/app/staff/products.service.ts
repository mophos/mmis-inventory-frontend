import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all(limit: number = 10, offset: number = 0) {
    const resp = await this.authHttp.post(`${this.url}/products/stock/products/all`, {
      limit: limit,
      offset: offset
    }).toPromise();
    return resp.json();
  }

  async getProductStockDetail(productId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/stock/remain/${productId}`).toPromise();
    return resp.json();
  }

  async getProductStockTotal() {
    const resp = await this.authHttp.post(`${this.url}/products/stock/products/total`, {}).toPromise();
    return resp.json();
  }

  async getProductRemain(productId: any, lotId: any) {
    const resp = await this.authHttp.post(`${this.url}/products/remain`, {
      productId: productId,
      lotId: lotId
    }).toPromise();
    return resp.json();
  }

  async listall() {
    const resp = await this.authHttp.get(`${this.url}/products/listall`).toPromise();
    return resp.json();
  }

  async getProductWarehouse(srcwarehouseId, dstwarehouseId) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductinwarehouse/${srcwarehouseId}/${dstwarehouseId}`).toPromise();
    return resp.json();
  }

  async searchAllProducts(query) {
    const resp = await this.authHttp.get(`${this.url}/products/searchallproduct/${query}`).toPromise();
    return resp.json();
  }

  async getProductsInTemplate(templateId) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductintemplate/${templateId}`).toPromise();
    return resp.json();
  }
  async getProductsInTemplateIssue(templateId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductintemplate-issue/${templateId}`).toPromise();
    return resp.json();
  }
  async productInWarehouse(genericId) {
    const resp = await this.authHttp.get(`${this.url}/products/in/warehouse?genericId=${genericId}`).toPromise();
    return resp.json();
  }

  async getGenericType() {
    const resp = await this.authHttp.get(`${this.url}/generics/types`).toPromise();
    return resp.json();
  }

}
