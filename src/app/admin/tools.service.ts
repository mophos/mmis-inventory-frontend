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
    let params = {
      receiveId: receiveId,
      productId: productId,
      lotNo: lotNo
    };

    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/receives/list`, params).toPromise();
    return resp.json();
  }

}
