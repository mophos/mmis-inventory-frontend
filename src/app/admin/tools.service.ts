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

  async getReceivesItems(receiveId: any) {
    const resp = await this.authHttp.get(`${this.url}/tools/stockcard/receives/items/${receiveId}`).toPromise();
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
