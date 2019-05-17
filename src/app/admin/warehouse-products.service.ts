import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class WarehouseProductsService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }

  saveWarehouseProducts(warehouseId, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/warehouseproduct`, {
        warehouseId: warehouseId,
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

  async searchProductsWarehouse(srcWarehouseId, dstwarehouseId: string, query: string) {
    let rs: any = await this.authHttp.post(`${this.url}/products/template/search-product-warehouse/${srcWarehouseId}/${dstwarehouseId}`, {
      query: query
    }).toPromise();

    return rs.json();
  }

  saveWarehouseProductsTemplate(templateSummary, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/warehouseproducttemplate`, {
        templateSummary: templateSummary,
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
 
  updateWarehouseProductsTemplate(templateId: any, templateSubject: any, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/updatewarehouseproducttemplate`, {
        templateId: templateId,
        templateSubject: templateSubject,
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

  // แสดง template ทั้งหมด
  getallTemplate() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/warehouseproducttemplate`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  
  async removeRequisitionTemplate(templateId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/warehouses/requisition/remove-template/${templateId}`)
      .toPromise();
    return rs.json();
  }
  
  // แสดงรายการ template ทั้งหมดใน warehouse
  getTemplateInWarehouse(warehouseId: any, SourceWarehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/templateinwarehouse/${warehouseId}/${SourceWarehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getAllTemplateSearch(query: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/warehouseproducttemplate/search?query=${query}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  
  // แสดงรายการสินค้าใน template
  async getTemplate(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/warehousetemplate/${templateId}`).toPromise();
    return rs.json();
  }
  async getTemplateDetail(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/warehousetemplate/detail/${templateId}`).toPromise();
    return rs.json();
  }
  async getTemplateIssue(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/warehouses/warehousetemplate-issue/${templateId}`).toPromise();
    return rs.json();
  }
  getAllTemplateSearchIssue(query: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/warehouseproducttemplate-issue/search?query=${query}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async removeRequisitionTemplateIssue(templateId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/warehouses/issue/remove-template/${templateId}`)
      .toPromise();
    return rs.json();
  }
  getallTemplateIssue() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/warehouseproducttemplate-issue`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  updateWarehouseProductsTemplateIssue(templateId: any, templateSubject: any, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/updatewarehouseproducttemplate-issue`, {
        templateId: templateId,
        templateSubject: templateSubject,
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
  saveWarehouseProductsTemplateIssue(templateSummary, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/warehouseproducttemplate-issue`, {
        templateSummary: templateSummary,
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
}
