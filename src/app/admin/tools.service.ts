import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ToolsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async searchReceives(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/receives/search`, {
      query: query
    }).toPromise();
    return resp.json();
  }

  async getHistory() {
    const resp = await this.authHttp.get(`${this.url}/tools/stockcard/history`).toPromise();
    return resp.json();
  }

  async searchRequisitions(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/requisitions/search`, {
      query: query
    }).toPromise();
    return resp.json();
  }

  async searchTranfers(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/tranfers/search`, {
      query: query
    }).toPromise();
    return resp.json();
  }

  async searchIssues(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/issues/search`, {
      query: query
    }).toPromise();
    return resp.json();
  }

  async searchPick(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/pick/search`, {
      query: query
    }).toPromise();
    return resp.json();
  }
  async updateStockCard(data: any[], receiveType: any, receiveDetailId: any, newQty: number, unitGenericId: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/update`, {
      data: data,
      receiveType: receiveType,
      receiveDetailId: receiveDetailId,
      newQty: newQty,
      unitGenericId: unitGenericId
    }).toPromise();
    return resp.json();
  }

  async getReceivesItems(receiveId: any, type: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/receives/items`, {
      receiveId: receiveId,
      type: type
    }).toPromise();
    return resp.json();
  }

  async getStockForEditCardList(receiveId: any, productId: any, lotNo: any) {
    const params = {
      receiveId: receiveId,
      productId: productId,
      lotNo: lotNo
    };

    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/receives/list`, params).toPromise();
    return resp.json();
  }

  async saveReceive(receiveId: any, summary: any, products: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/receives`, {
      receiveId: receiveId,
      summary: summary,
      products: products
    }).toPromise();
    return resp.json();
  }

  async saveReceiveOther(receiveOtherId: any, summary: any, products: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/receive-others`, {
      receiveOtherId: receiveOtherId,
      summary: summary,
      products: products
    }).toPromise();
    return resp.json();
  }

  async saveRequisition(requisitionId: any, confirmId: any, summary: any, products: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/requisitions`, {
      requisitionId: requisitionId,
      confirmId: confirmId,
      summary: summary,
      products: products
    }).toPromise();
    return resp.json();
  }

  async saveTransfer(transferId: any, summary: any, generics: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/transfers`, {
      transferId: transferId,
      summary: summary,
      generics: generics
    }).toPromise();
    return resp.json();
  }

  async saveIssue(issueId: any, summary: any, products: any) {
    const resp = await this.authHttp.put(`${this.url}/tools/stockcard/issues`, {
      issueId: issueId,
      summary: summary,
      products: products
    }).toPromise();
    return resp.json();
  }

  async checkPassword(password) {
    const rs = await this.authHttp.post(`${this.url}/tools/check/password`, { password: password }).toPromise();
    return rs.json();
  }

  async calStockCard() {
    const rs = await this.authHttp.get(`${this.url}/tools/calculate/stockcard`).toPromise();
    return rs.json();
  }

  async removestockcard(warehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/tools/removestockcard`, { warehouseId: warehouseId }).toPromise();
    return rs.json();
  }

  async calbalanceunitcost(warehouseId: any, token: any) {
    const rs = await this.authHttp.get(`${this.url}/tools/calculate/balanceunitcost?warehouseId=${warehouseId}&token=${token}`).toPromise();
    return rs.json();
  }

  async calbalancelot(warehouseId: any, token: any) {
    const rs = await this.authHttp.get(`${this.url}/tools/calculate/stockcard/lot?warehouseId=${warehouseId}&token=${token}`).toPromise();
    return rs.json();
  }

}
