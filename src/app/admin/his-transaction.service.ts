import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HisTransactionService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async getGenericType() {
    const resp = await this.authHttp.get(`${this.url}/generics/types`).toPromise();
    return resp.json();
  }

  async getTransactionList(genericTypes: any) {    
    const resp = await this.authHttp.post(`${this.url}/his-transaction/list`,
      { genericTypes: genericTypes }).toPromise();
    return resp.json();
  }

  async removeTransactionList() {
    const resp = await this.authHttp.delete(`${this.url}/his-transaction/remove`).toPromise();
    return resp.json();
  }

  async importTransaction(transactionIds: any[]) {
    const resp = await this.authHttp.post(`${this.url}/his-transaction/import`, {
      transactionIds: transactionIds
    }).toPromise();
    return resp.json();
  }

  async removeTransactionListSelect(transactionId: any) {
    const resp = await this.authHttp.delete(`${this.url}/his-transaction/remove-transaction-select/${transactionId}`).toPromise();
    return resp.json();
  }

}
