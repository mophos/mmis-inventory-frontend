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

  getReceiveTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staffreceive/types`)
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
      this.authHttp.get(`${this.url}/staffreceive/status`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
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

}
