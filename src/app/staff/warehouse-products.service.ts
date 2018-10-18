import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

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

  searchProductsWarehouse(srcwarehouseId: string, dstwarehouseId: string, query: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouses/products/searchinwarehouse`, {
        query: query,
        warehouseId: srcwarehouseId,
        sourceWarehouseId: dstwarehouseId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
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

  updateWarehouseProductsTemplate(templateId, templateSubject: any, products: Array<any>) {
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

  // แสดงรายการ template ทั้งหมดใน warehouse
  getAllTemplateInWarehouse(warehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/alltemplateinwarehouse?warehouseId=${warehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getAllTemplateInWarehouseSearch(warehouseId: any, query: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/alltemplateinwarehouse/search?warehouseId=${warehouseId}&query=${query}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }



  getTemplateInWarehouse(warehouseId: any, sourceWarehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/templateinwarehouse?srcWarehouseId=${warehouseId}&dstWarehouseId=${sourceWarehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  // แสดงรายการสินค้าใน template
  getTemplate(templateId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouses/warehousetemplate/${templateId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }



  async removeRequisitionTemplate(templateId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/staff/warehouses/requisition/remove-template/${templateId}`)
      .toPromise();
    return rs.json();
  }

  async getTemplateIssue(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/warehouses/warehousetemplate-issue/${templateId}`).toPromise();
    return rs.json();
  }
  getAllTemplateSearchIssue(query: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/warehouses/warehouseproducttemplate-issue/search?query=${query}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  async removeRequisitionTemplateIssue(templateId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/staff/warehouses/issue/remove-template/${templateId}`)
      .toPromise();
    return rs.json();
  }
  getallTemplateIssue() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/staff/warehouses/getwarehouseproducttemplate-issue`)
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
      this.authHttp.post(`${this.url}/staff/warehouses/updatewarehouseproducttemplate-issue`, {
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
  async saveWarehouseProductsTemplateIssue(templateSummary, products: Array<any>) {
    const rs:any =  await this.authHttp.post(`${this.url}/staff/warehouses/savewarehouseproducttemplate-issue`, {
        templateSummary: templateSummary,
        products: products
      }).toPromise();
      return rs.json();
  }
}
