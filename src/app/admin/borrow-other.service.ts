import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BorrowOtherService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async saveIssue(summary: any, products: any) {
    const rs = await this.authHttp.post(`${this.url}/borrow-other`, {
      summary: summary,
      products: products
    }).toPromise();
    return rs.json();
  }

  async getWarehouses(borrowId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/warehouses?borrowId=${borrowId}`).toPromise();
    return rs.json();
  }

  async removeIssue(issueId: any) {
    const rs = await this.authHttp.delete(`${this.url}/borrow-other/${issueId}`).toPromise();
    return rs.json();
  }

  async getLots(productId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/product-warehouse-lots/${productId}/${warehouseId}`).toPromise();
    return rs.json();
  }
  async getLotGeneric(genericId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/generic-warehouse-lots/${genericId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async approveIssue(issueIds: any) {
    const rs = await this.authHttp.post(`${this.url}/borrow-other/approve`, {
      issueIds: issueIds
    }).toPromise();
    return rs.json();
  }

  async getIssues(issue_id: any) {
    const rs = await this.authHttp.get(`${this.url}/getissues/${issue_id}`).toPromise();
    return rs.json();
  }
  async _getIssues(warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/_getissues/${warehouseId}`).toPromise();
    return rs.json();
  }
  async getProductIssues(id: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/getproduct/${id}`).toPromise();
    return rs.json();
  }

  async updateIssue(borrowId: any, summary: any, products: any) {
    const rs = await this.authHttp.put(`${this.url}/borrow-other/${borrowId}`, {
      summary: summary,
      products: products
    }).toPromise();
    return rs.json();
  }

  async list(limit: number = 10, offset: number = 0, status = '') {
    const rs = await this.authHttp.get(`${this.url}/borrow-other?limit=${limit}&offset=${offset}&status=${status}`).toPromise();
    return rs.json();
  }

  async getProductList(borrowId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/product-list/${borrowId}`).toPromise();
    return rs.json();
  }
  async getGenericList(borrowId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/generic-list/${borrowId}`).toPromise();
    return rs.json();
  }

  async getEditProductList(borrowId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/info/products?borrowId=${borrowId}`).toPromise();
    return rs.json();
  }
  async getEditGenericList(borrowId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/info/generics?borrowId=${borrowId}`).toPromise();
    return rs.json();
  }

  async getSummary(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/info/summary?issueId=${issueId}`).toPromise();
    return rs.json();
  }

  async getGenericQty(genericId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/borrow-other/generic/qty/${genericId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async getIssuesProduct(data: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate/baseunit`, { data: data }).toPromise();
    return rs.json();
  }

  async checkApprove(username: any, password: any, action: any) {
    const rs: any = await this.authHttp.post(`${this.url}/basic/checkApprove`, {
      username: username,
      password: password,
      action: action
    }).toPromise();
    return rs.json();
  }
}
