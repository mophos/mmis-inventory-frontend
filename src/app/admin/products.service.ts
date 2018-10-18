import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class ProductsService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all(genericType: any, limit: number = 10, offset: number = 0, warehouseId: any, sort: any = {}) {
    const resp = await this.authHttp.post(`${this.url}/products/stock/products/all`, {
      genericType: genericType,
      limit: limit,
      offset: offset,
      sort: sort,
      warehouseId: warehouseId
    }).toPromise();
    return resp.json();
  }

  async search(query: any, genericType: any, limit: number = 10, offset: number = 0, warehouseId: any, sort: any = {}) {
    const resp = await this.authHttp.post(`${this.url}/products/stock/products/search`, {
      genericType: genericType,
      limit: limit,
      offset: offset,
      query: query,
      sort: sort,
      warehouseId: warehouseId
    }).toPromise();
    return resp.json();
  }

  async getProductStockDetail(productId: any, warehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/stock/remain/${productId}/${warehouseId}`).toPromise();
    return resp.json();
  }

  async getProductStockRemain(genericId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/stock/remain/generic/${genericId}`).toPromise();
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

  async getProductRemainByWarehouse(productId: any, lotId: any, warehouseId: any) {
    const resp = await this.authHttp.post(`${this.url}/products/remain/warehouse`, {
      productId: productId,
      lotId: lotId,
      warehouseId: warehouseId
    }).toPromise();
    return resp.json();
  }

  async listall() {
    const resp = await this.authHttp.get(`${this.url}/products/listall`).toPromise();
    return resp.json();
  }

  async getProductWarehouse(srcwarehouseId: any, dstwarehouseId) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductinwarehouse/${srcwarehouseId}/${dstwarehouseId}`).toPromise();
    return resp.json();
  }

  async searchAllProducts(query: any) {
    const resp = await this.authHttp.get(`${this.url}/products/searchallproduct/${query}`).toPromise();
    return resp.json();
  }

  async getProductsInTemplate(templateId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductintemplate/${templateId}`).toPromise();
    return resp.json();
  }
  async getProductsInTemplateIssue(templateId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/getallproductintemplate-issue/${templateId}`).toPromise();
    return resp.json();
  }
  async getWarehouseProductRemain(warehouseId: any, productId: any) {
    const resp = await this.authHttp.get(`${this.url}/products/getwarehouseproductremain/${warehouseId}/${productId}`).toPromise();
    return resp.json();
  }

  async getGenericType() {
    const resp = await this.authHttp.get(`${this.url}/generics/types`).toPromise();
    return resp.json();
  }

  async getAllProduct() {
    const resp = await this.authHttp.get(`${this.url}/products/mapping/all-product`).toPromise();
    return resp.json();
  }

  async getSearchProduct(query: any) {
    const resp = await this.authHttp.get(`${this.url}/products/mapping/search-product/${query}`).toPromise();
    return resp.json();
  }

  async updateTMT(productUpdate: any) {
    const resp = await this.authHttp.put(`${this.url}/products/mapping/update/tmt`, { productUpdate: productUpdate }).toPromise();
    return resp.json();
  }

  async tmtExportExcel() {
    const resp = await this.authHttp.get(`${this.url}/products/mapping/tmt/export`).toPromise();
    return resp.json();
  }

  async productInWarehouse(genericId) {
    const resp = await this.authHttp.get(`${this.url}/products/in/warehouse?genericId=${genericId}`).toPromise();
    return resp.json();
  }

}
