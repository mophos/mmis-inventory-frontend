import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { IReceive } from '../models';

@Injectable()
export class ReceiveService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }

  // get conversion
  async getUnitConversion(genericId: any) {
    const response = await this.authHttp.get(`${this.url}/products/unit-conversion/${genericId}`)
      .toPromise();
    return response.json();
  }

  searchProduct(query: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffreceive/search`, {
        query: query
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductPackages(productId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffreceive/product-packages`, {
        productId: productId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getLocation() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/locations`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getWarehouse() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/warehouse`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveReceive(summary: IReceive, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffreceive`, {
        summary: summary,
        products: products
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getWorkings() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/workings`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getWaiting() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/waiting`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSuccess() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/success`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveApprove(receiveId: any, approveStatus: any, approveDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffreceive/approve`, {
        receiveId: receiveId,
        approveDate: approveDate,
        approveStatus: approveStatus
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getApproveInfo(receiveId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/approve/${receiveId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getReceiveInfo(receiveId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/info/${receiveId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getPeople() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/people/list`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getReceiveProducts(receiveId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/products/${receiveId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  // ================== check product service ============== //
  saveCheck(summary, products) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staffreceive/check`, {
        summary: summary,
        products: products
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  // =============== document service =============== //
  getFiles(documentCode) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.docUrl}/uploads/info/${documentCode}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeFile(documentId) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.docUrl}/uploads/${documentId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getReceiveOtherStatusSearch(limit: number = 15, offset: number = 0, query, status, sort: any = {}) {
    const res = await this.authHttp.post(`${this.url}/staff/receives/other/status/search`, {
      limit: limit,
      offset: offset,
      status: status,
      query: query,
      sort: sort
    }).toPromise();
    return res.json();
  }

  async getReceiveOtherStatus(limit: number = 15, offset: number = 0, status, sort: any = {}) {
    const res = await this.authHttp.post(`${this.url}/staff/receives/other/status`, {
      limit: limit,
      offset: offset,
      status: status,
      sort: sort
    }).toPromise();
    return res.json();
  }

  async getApprove() {
    const res = await this.authHttp.get(`${this.url}/staff/receives/count/approve`)
      .toPromise();
    return res.json();
  }

  async getApproveOther() {
    const res = await this.authHttp.get(`${this.url}/staff/receives/count/approve/other`)
      .toPromise();
    return res.json();
  }

  async getReceiveOtherProducts(receiveOtherId) {
    const res = await this.authHttp.get(`${this.url}/staff/receives/other/product-list/${receiveOtherId}`)
      .toPromise();
    return res.json();
  }

  async checkApprove(username: any, password: any, action: any) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/basic/checkApprove`, {
      username: username,
      password: password,
      action: action
    }).toPromise();
    return rs.json();
  }

  async saveApproveOther(receiveIds: any[], approveDate: any, comment: any) {
    const res = await this.authHttp.post(`${this.url}/staff/receives/other/approve`, {
      receiveIds: receiveIds,
      approveDate: approveDate,
      comment: comment
    }).toPromise();
    return res.json();
  }

  async getPurchaseCheckHoliday(date) {
    const res = await this.authHttp.get(`${this.url}/staff/receives/purchases/check-holiday?date=${date}`)
      .toPromise();
    return res.json();
  }

  async saveReceiveOther(summary: any, products: Array<any>) {
    const res = await this.authHttp.post(`${this.url}/staff/receives/other`, {
      summary: summary,
      products: products
    }).toPromise();

    return res.json();
  }

  async saveCost(products: any) {
    const rs: any = await this.authHttp.put(`${this.url}/staff/receives/update/cost`, {
      products: products
    }).toPromise();
    return rs.json();
  }

  async getPurchaseCheckExpire(genericId: any, expiredDate: any) {
    const res = await this.authHttp.get(`${this.url}/staff/receives/purchases/check-expire?genericId=${genericId}&expiredDate=${expiredDate}`)
      .toPromise();
    return res.json();
  }

  getReceiveTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/receives/types`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getStatusStatus() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/receives/status`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getReceiveOtherDetail(receiveOtherId: any) {
    const res = await this.authHttp.get(`${this.url}/staff/receives/other/detail/${receiveOtherId}`).toPromise();
    return res.json();
  }

  async getReceiveOtherDetailProductList(receiveOtherId: any) {
    const res = await this.authHttp.get(`${this.url}/staff/receives/other/detail/product-list/${receiveOtherId}`).toPromise();
    return res.json();
  }

  async updateReceiveOther(receiveOtherId: any, summary: any, products: Array<any>) {
    const res = await this.authHttp.put(`${this.url}/staff/receives/other/${receiveOtherId}`, {
      summary: summary,
      products: products
    }).toPromise();

    return res.json();
  }

}
