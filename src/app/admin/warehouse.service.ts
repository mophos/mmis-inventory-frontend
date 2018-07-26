import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

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

  async getMappingsGenerics() {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-mappings-generics`).toPromise();
    return rs.json();
  }

  async getMappingsGenericsSearchType(keywords: any, genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-mappings-generics-search-type/${keywords}/${genericType}`).toPromise();
    return rs.json();
  }

  async getMappingsGenericsType(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-mappings-generics-type/${genericType}`).toPromise();
    return rs.json();
  }

  async getMappingsProducts(genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-mappings-products/${genericId}`).toPromise();
    return rs.json();
  }

  async getStaffMappings() {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-staff-mappings`).toPromise();
    return rs.json();
  }
  async getSearchStaffMappings(query: any, genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-staff-mappings/search/${query}/${genericType}`).toPromise();
    return rs.json();
  }
  async getSearchStaffMappingsType(genericType: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-staff-mappings/type/${genericType}`).toPromise();
    return rs.json();
  }
  async getShipingNetwork(warehouseId: any, type: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/get-shippingnetwork-list/${warehouseId}/${type}`).toPromise();
    return rs.json();
  }

  getWarehouseProduct() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/listall`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveMapping(mmis: any, his: any, conversion: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/mapping/save`, {
        mmis: mmis,
        his: his,
        conversion: conversion
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  removeMapping(genericId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/warehouses/mapping/remove/${genericId}`)
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

  async getReqShipingNetwork(warehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/reqshipingnetwork/${warehouseId}`)
      .toPromise();
    return rs.json();
  }

  save(warehouseName: string, shortCode: string, location: string, isActived: string, isReceive: string, isUnitIssue: string, hospcode: any, depCode: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses`, {
        warehouseName: warehouseName,
        shortCode: shortCode,
        location: location,
        isActived: isActived,
        isReceive: isReceive,
        isUnitIssue: isUnitIssue,
        hospcode: hospcode,
        depCode: depCode
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(warehouseId: any, warehouseName: string, shortCode: string, location: string, isActived: string, isReceive: string, isUnitIssue: string, hospcode: any, depCode: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/warehouses/${warehouseId}`, {
        warehouseName: warehouseName,
        shortCode: shortCode,
        location: location,
        isActived: isActived,
        isReceive: isReceive,
        isUnitIssue: isUnitIssue,
        hospcode: hospcode,
        depCode: depCode
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

  async changeCost(productId: any, cost: number) {
    const rs: any = await this.authHttp.post(`${this.url}/warehouses/products/change-cost`, {
      productId: productId,
      cost: cost
    }).toPromise();
    return rs.json();
  }

  saveAdjQty(id: string, newQty: number, oldQty: number, reason: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/products/adjust-qty`, {
        id: id,
        newQty: newQty,
        oldQty: oldQty,
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

  getAdjLogs(productNewId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/products/adjust-logs/${productNewId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductsDetail(productNewId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/products/full-detail/${productNewId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async saveReceivePlanning(warehouseId: any, generics: any[]) {
    const rs = await this.authHttp.post(`${this.url}/warehouses/receive-planning`, {
      warehouseId: warehouseId,
      generics: generics
    }).toPromise();

    return rs.json();
  }

  async getReceivePlanning() {
    const rs = await this.authHttp.get(`${this.url}/warehouses/receive-planning`).toPromise();
    return rs.json();
  }

  async getReceivePlanningGenericList(warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/warehouses/receive-planning/generics/${warehouseId}`).toPromise();
    return rs.json();
  }

  async getGenericByGenericTypes(genericTypeId: any) {
    const rs = await this.authHttp.get(`${this.url}/warehouses/receive-planning/generics-by-types/${genericTypeId}`).toPromise();
    return rs.json();
  }

  async getGenericAll() {
    const rs = await this.authHttp.get(`${this.url}/warehouses/receive-planning/generics-all`).toPromise();
    return rs.json();
  }

  async getProductPlannings(warehouseId: any) {
    const res: any = await this.authHttp.get(`${this.url}/warehouses/warehouse-planning/planning?warehouseId=${warehouseId}`)
      .toPromise();
    return res.json();
  }

  async saveAllProductPlanningWarehouse(warehouseId: any, products: any) {
    const res: any = await this.authHttp.post(`${this.url}/warehouses/warehouse-planning/planning`, {
      warehouseId: warehouseId,
      products: products
    })
      .toPromise();
    return res.json();
  }
  getWarehouseProductImport(warehouse) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/productImport?warehouseId=${warehouse}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  getProductImport(working) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/productImportlist?working=${working}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async getProductHistory(productId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/products/history/${productId}`).toPromise();
    return rs.json();
  }

  async updateProductLotExpired(data: any) {
    const rs: any = await this.authHttp.put(`${this.url}/warehouses/products/lot-expired`, {
      data: data
    }).toPromise();
    return rs.json();
  }

  async getExpiredSetting() {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/expired/setting`).toPromise();
    return rs.json();
  }

}
