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

  async getTransactionList(genericTypes: any) {
    const resp = await this.authHttp.post(`${this.url}/staff/his-transaction/list`,
      { genericTypes: genericTypes }).toPromise();
    return resp.json();
  }

  async removeTransactionList() {
    const resp = await this.authHttp.delete(`${this.url}/staff/his-transaction/remove`).toPromise();
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
}
