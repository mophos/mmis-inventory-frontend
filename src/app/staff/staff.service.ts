import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class StaffService {
  token: any = null;

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) {
    this.token = sessionStorage.getItem('token');
  }

  getWarehouseList(ownerId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/warehouse-list/${ownerId}`)
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
      this.authHttp.post(`${this.url}/staff/borrow/save`, {
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

  getBorrows(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/list/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getBorrowsRequest(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/request/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getBorrowsWorking(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/working/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getBorrowsSuccess(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/success/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getTypes() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/types`)
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
      this.authHttp.post(`${this.url}/staff/borrow/search-product`, {
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

  getWarehouseDetail(warehouseId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/warehouse/detail/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getProductsWarehouse(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/products?genericType=${genericType}`).toPromise();
    return rs.json();
  }

  async getProductsWarehouseSearch(genericType: any, query: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/products/search?genericType=${genericType}&query=${query}`).toPromise();
    return rs.json();
  }

  async getProductStockDetail(productId: any) {
    const resp = await this.authHttp.get(`${this.url}/staff/products/stock/remain/${productId}`).toPromise();
    return resp.json();
  }

  async getGenericsRequisitionWarehouse(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/generics/requisition?genericType=${genericType}`).toPromise();
    return rs.json();
  }

  async getGenericsRequisitionWarehouseSearch(genericType: any, query: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/generics/requisition/search?genericType=${genericType}`).toPromise();
    return rs.json();
  }

  async getGenericsWarehouse(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/generics?genericType=${genericType}`).toPromise();
    return rs.json();
  }

  async getGenericsWarehouseSearch(genericType: any, query: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/generics/search?genericType=${genericType}&query=${query}`).toPromise();
    return rs.json();
  }

  async getGenericsWarehosueMinMax(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouse/generics/min-max?genericType=${genericType}`).toPromise();
    return rs.json();
  }

  async saveGenericMinMax(items: any[], fromDate, toDate) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/warehouse/save-minmax`, {
      items: items,
      fromDate: fromDate,
      toDate: toDate
    }).toPromise();
    return rs.json();
  }

  removeBorrow(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/staff/borrow/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeCheck(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/staff/borrow/check/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchProductsWarehouse(warehouseId: string, query: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/warehouse/products/search`, {
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
  searchGenericsWarehosue(genericType: string, query: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/warehouse/generics/min-max/search`, {
        query: query,
        genericType: genericType
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async saveAdjQty(id: string, newQty: number, oldQty: number, reason: string) {
    const rs: any = await this.authHttp.post(`${this.url}/warehouses/products/adjust-qty`, {
      id: id,
      newQty: newQty,
      oldQty: oldQty,
      reason: reason
    }).toPromise();

    return rs.json();
  }

  getBorrowDetail(borrowId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/borrow/${borrowId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  approveBorrow(borrowId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/borrow/approve`, {
        borrowId: borrowId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  // check

  getSummaryDetailForCheck(borrowId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/check/summary-detail/${borrowId}`)
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
      this.authHttp.get(`${this.url}/staff/check/product-list/${borrowId}`)
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
      this.authHttp.post(`${this.url}/staff/check/product-check`, {
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

  saveCheckBorrow(items: any[], summary: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/check/save`, {
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

  getAdjLogs(productNewId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/products/adjust-logs/${productNewId}`)
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
      this.authHttp.get(`${this.url}/staff/borrows/products-list/warehouse/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getCycleProductsInWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/counting/cycle/warehouse/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveCycleRemark(countingCycleLogsId: any, remark: string, remainStock: number, remainAcc: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/staff/counting/cycle/save-remark`, {
        countingCycleLogsId: countingCycleLogsId,
        remark: remark,
        remainStock: +remainStock,
        remainAcc: +remainAcc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getCycleRemark(countingCycleLogsId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/counting/cycle/get-remark/${countingCycleLogsId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getGenericType() {
    const resp = await this.authHttp.get(`${this.url}/generics/types`).toPromise();
    return resp.json();
  }
  async getProductAll(query, genericTypes) {
    const resp = await this.authHttp.post(`${this.url}/staff/products/all`,
      { query: query, genericTypes: genericTypes }).toPromise();
    return resp.json();
  }

  async getMinMaxHeader() {
    const resp = await this.authHttp.get(`${this.url}/min-max/header`).toPromise();
    return resp.json();
  }

  async calculateMinMax(fromDate: any, toDate: any) {
    const resp = await this.authHttp.post(`${this.url}/min-max/calculate`, {
      fromDate: fromDate,
      toDate: toDate
    }).toPromise();
    return resp.json();
  }

}
