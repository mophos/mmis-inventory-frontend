import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class BorrowService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }

  getTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrows/types`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchProducts(query: string, warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/search-product`, {
        query: query,
        warehouseId: warehouseId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getWherehouseList(id: string = null) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses?id=${id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveBorrow(summary: any, items: any[]) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/save`, {
        items: items,
        summary: summary
      })
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
      this.authHttp.get(`${this.url}/borrows/waiting`)
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
      this.authHttp.get(`${this.url}/borrows/workings`)
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
      this.authHttp.get(`${this.url}/borrows/success`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSummaryDetailForCheck(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrows/check/summary-detail/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductListForCheck(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrows/check/product-list/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductForCheck(productId: string, warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/check/product-check`, {
        productId: productId,
        warehouseId: warehouseId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductForReturn(productId: string, warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/return/product-return`, {
        productId: productId,
        warehouseId: warehouseId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveReturn(items: any[], summary: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/return/save`, {
        items: items,
        summary: summary
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveCheckBorrow(items: any[], summary: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/check/save`, {
        items: items,
        summary: summary
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getApproveInfo(borrowId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrows/approve/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveApprove(borrowId: any, approveDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/approve`, {
        borrowId: borrowId,
        approveDate: approveDate
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveApproveReturn(borrowId: any, approveDate: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/borrows/return/approve`, {
        borrowId: borrowId,
        approveDate: approveDate
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductsInWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/borrows/products-list/warehouse/${warehouseId}`)
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
