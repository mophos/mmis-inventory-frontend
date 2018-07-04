import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { Iissue } from '../models';

@Injectable()
export class IssueService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }


  searchProduct(query: string, warehouseid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/internalissue/search`, {
        query: query,
        warehouseid: warehouseid
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchProductall(warehouseid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/internalissue/searchall`, {
        warehouseid: warehouseid
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
      this.authHttp.post(`${this.url}/internalissue/product-packages`, {
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

  getpackageLotsInfo(productID: any, warehouseID: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/internalissue/detail/${productID}/${warehouseID}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  getInternalIssueDetail(InternalIssueId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/internalissue//issuedetail/${InternalIssueId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveIssue(summary: Iissue, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/internalissue`, {
        summary: summary,
        products: products
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          console.log(error);
          reject(error);
        });
    });
  }

  ApproveList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/internalissue`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  SuccessList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/internalissue/success`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  // =============== document service ===============
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

  saveApprove(internalissueId: any, approveStatus: any, approveDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/internalissue/approve`, {
        internalissueId: internalissueId,
        approveDate: approveDate,
        approveStatus: approveStatus,
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
