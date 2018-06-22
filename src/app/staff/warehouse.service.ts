import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class WarehouseService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  detail(warehouseId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/detail/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getUnitIssue(warehouseId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/unitissue/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(warehouseName: string, typeId: any, location: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses`, {
        warehouseName: warehouseName,
        typeId: typeId,
        location: location
      })
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
      this.authHttp.get(`${this.url}/warehouses/warehouse`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(warehouseId: any, warehouseName: string, typeId: any, location: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/warehouses/${warehouseId}`, {
        warehouseName: warehouseName,
        typeId: typeId,
        location: location
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/warehouses/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductsWarehouse(warehouseId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/products/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getReqShipingNetwork(warehouseId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/reqshipingnetwork/${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getShipingNetwork(warehouseId: any, type: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-shippingnetwork-list/${warehouseId}/${type}`).toPromise();
    return rs.json();
  }

  searchProductsWarehouse(warehouseId: string, query: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/products/search`, {
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

  saveAdjQty(id: string, newQty: number, requestQty: number, reason: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/products/adjust-qty`, {
        id: id,
        newQty: newQty,
        requestQty: requestQty,
        reason: reason
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
