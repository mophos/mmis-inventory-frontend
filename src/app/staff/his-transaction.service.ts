import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HisTransactionService {
  token: any = null;

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) {
    this.token = sessionStorage.getItem('token');
  }

  async getGenericType() {
    const resp = await this.authHttp.get(`${this.url}/generics/types`).toPromise();
    return resp.json();
  }

  async getTransactionList(genericTypes: any, warehouseId: any) {
    const resp = await this.authHttp.post(`${this.url}/staff/his-transaction/list`, {
      genericTypes: genericTypes,
      warehouseId: warehouseId
    }).toPromise();
    return resp.json();
  }

  async getHistoryTransactionList(genericTypes: any, date: any, warehouseId: any) {
    const resp = await this.authHttp.post(`${this.url}/staff/his-transaction/history-list`,
      {
        genericTypes: genericTypes,
        date: date,
        warehouseId: warehouseId
      }).toPromise();
    return resp.json();
  }

  async removeTransactionList(warehouseId: any) {
    const resp = await this.authHttp.delete(`${this.url}/staff/his-transaction/remove/${warehouseId}?token=${this.token}`).toPromise();
    return resp.json();
  }

  async importTransaction(transactionIds: any[]) {
    const resp = await this.authHttp.post(`${this.url}/staff/his-transaction/import`, {
      transactionIds: transactionIds
    }).toPromise();
    return resp.json();
  }

  uploadHisTransaction(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/staff/his-transaction/upload?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  uploadTransaction(files: File) {
    return new Promise((resolve, reject) => {
      const formData: any = new FormData();
      const xhr = new XMLHttpRequest();

      formData.append("file", files, files.name);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      const url = `${this.url}/staff/transaction/upload?token=${this.token}`;
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  async removeTransactionListSelect(transactionId: any) {
    const resp = await this.authHttp.delete(`${this.url}/staff/his-transaction/remove-transaction-select/${transactionId}?token=${this.token}`).toPromise();
    return resp.json();
  }

  async getNotMappings(warehouseId: any) {
    const resp = await this.authHttp.get(`${this.url}/staff/his-transaction/get-not-mappings/${warehouseId}?token=${this.token}`).toPromise();
    return resp.json();
  }
}
