import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class IssueService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async saveIssue(summary: any, products: any) {
    const rs = await this.authHttp.post(`${this.url}/issues`, {
      summary: summary,
      products: products
    }).toPromise();
    return rs.json();
  }

  async removeIssue(issueId: any) {
    const rs = await this.authHttp.delete(`${this.url}/issues/${issueId}`).toPromise();
    return rs.json();
  }

  async getLots(productId: any, warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/product-warehouse-lots/${productId}/${warehouseId}`).toPromise();
    return rs.json();
  }

  async approveIssue(issueIds: any) {
    const rs = await this.authHttp.post(`${this.url}/issues/approve`, {
      issueIds: issueIds
    }).toPromise();
    return rs.json();
  }

  async updateIssue(issueId: any, summary: any, products: any) {
    const rs = await this.authHttp.put(`${this.url}/issues/${issueId}`, {
      summary: summary,
      products: products
    }).toPromise();
    return rs.json();
  }

  async list() {
    const rs = await this.authHttp.get(`${this.url}/issues`).toPromise();
    return rs.json();
  }

  async getProductList(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/product-list/${issueId}`).toPromise();
    return rs.json();
  }

  async getSummary(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/info/summary?issueId=${issueId}`).toPromise();
    return rs.json();
  }
  async _getIssues(warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/_getissues/${warehouseId}`).toPromise();
    return rs.json();
  }
  async getGenericsDetail(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/info/generics?issueId=${issueId}`).toPromise();
    return rs.json();
  }
  async getProductIssues(id: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/product-list/${id}`).toPromise();
    return rs.json();

  }
  async getIssues(issue_id: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/getissues/${issue_id}`).toPromise();
    return rs.json();
  }
  async getGenericList(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/generic-list/${issueId}`).toPromise();
    return rs.json();
  }
  async getIssuesProduct(data: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate`, {data: data}).toPromise();
    return rs.json();
  }
  async getEditProductList(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/info/products?issueId=${issueId}`).toPromise();
    return rs.json();
  }
  async getEditGenericList(issueId: any) {
    const rs = await this.authHttp.get(`${this.url}/issues/info/generics?issueId=${issueId}`).toPromise();
    return rs.json();
  }

  async checkApprove(username: any, password: any, action: any) {
    let rs: any = await this.authHttp.post(`${this.url}/issues/checkApprove`, {
      username: username,
      password: password,
      action: action
    }).toPromise();
    return rs.json();
  }
  
}