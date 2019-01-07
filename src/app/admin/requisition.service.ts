import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

import { IRequisition } from '../models';

@Injectable()
export class RequisitionService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }

  /***************** siteslave ****************/

  async getWating(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/waiting?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getWaitingApprove(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/waiting-approve?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getApproved(limit: number, offset: number, query = '') {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/approved?limit=${limit}&offset=${offset}&query=${query}`)
      .toPromise();
    return rs.json();
  }

  async getKeeps(limit: number, offset: number, query = '') {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/keep?limit=${limit}&offset=${offset}&query=${query}`)
      .toPromise();
    return rs.json();
  }

  async keep(requisitionId) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/orders/keep`, {
      requisitionId: requisitionId
    })
      .toPromise();
    return rs.json();
  }

  async getUnPaid(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/unpaid?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getOrderDetail(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/detail/${requisitionId}`)
      .toPromise();
    return rs.json();
  }

  async saveRequisitionOrder(order: any, products: Array<any>) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/orders`, {
      order: order,
      products: products
    }).toPromise();
    return rs.json();
  }

  async saveRequisitionFastOrder(order: any, generics: Array<any>) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/fast/orders`, {
      order: order,
      generics: generics
    }).toPromise();
    return rs.json();
  }

  async saveRequisitionReOrder(requisitionOrderUnpaidId: any, requisitionOrderId: any) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/orders/unpaid/reorder`, {
      requisitionOrderUnpaidId: requisitionOrderUnpaidId,
      requisitionOrderId: requisitionOrderId
    }).toPromise();
    return rs.json();
  }

  async updateRequisitionOrder(requisitionId: any, order: any, products: Array<any>) {
    const rs: any = await this.authHttp.put(`${this.url}/requisition/orders/${requisitionId}`, {
      order: order,
      products: products
    }).toPromise();
    return rs.json();
  }

  async removeRequisitionOrder(requisitionId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/requisition/orders/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getEditRequisitionOrderItems(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/generics-requisition/for-edit/${requisitionId}`).toPromise();
    return rs.json();
  }

  // async getRequisitionOrderItems(requisitionId: any) {
  //   const rs: any = await this.authHttp.get(`${this.url}/requisition/generics-requisition/${requisitionId}`).toPromise();
  //   return rs.json();
  // }

  async getRequisitionOrderItems(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/generic-requisition/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderUnpaidItems(unpaidId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/generics-requisition/unpaid/${unpaidId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderItemsPay(requisitionId: any, confirmId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/generics-requisition/pay/${requisitionId}/${confirmId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderProductItems(genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/products-requisition/${genericId}`).toPromise();
    return rs.json();
  }

  async getEditRequisitionOrderProductItems(confirmId: any, genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/products-requisition/edit/${confirmId}/${genericId}`).toPromise();
    return rs.json();
  }

  async getOrderConfirmItems(confirmId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/confirm/${confirmId}`).toPromise();
    return rs.json();
  }

  async saveOrderConfirmItemsWithOutUnpaid(requisitionId: any, items: any) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/orders/confirm-without-unpaid`, {
      requisitionId: requisitionId,
      items: items
    }).toPromise();
    return rs.json();
  }

  async saveOrderConfirmItemsWithUnpaid(requisitionId: any, items: any, generics: any) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/orders/confirm-with-unpaid`, {
      requisitionId: requisitionId,
      items: items,
      generics: generics
    }).toPromise();
    return rs.json();
  }

  // update
  async updateOrderConfirmItemsWithOutUnpaid(requisitionId: any, confirmId: any, items: any) {
    const rs: any = await this.authHttp.put(`${this.url}/requisition/orders/confirm-without-unpaid/${confirmId}`, {
      requisitionId: requisitionId,
      items: items
    }).toPromise();
    return rs.json();
  }
  async checkUnpaid(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/orders/check-unpaid?requisitionId=${requisitionId}`).toPromise();
    return rs.json();
  }
  async updateOrderConfirmItemsWithUnpaid(requisitionId: any, confirmId: any, items: any, generics: any) {
    const rs: any = await this.authHttp.put(`${this.url}/requisition/orders/confirm-with-unpaid/${confirmId}`, {
      requisitionId: requisitionId,
      items: items,
      generics: generics
    }).toPromise();
    return rs.json();
  }

  async updateOrderConfirmItems(confirmId: any, items: any) {
    const rs: any = await this.authHttp.put(`${this.url}/requisition/orders/confirm/${confirmId}`, {
      items: items
    }).toPromise();
    return rs.json();
  }

  async removeOrderConfirm(confirmId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/requisition/orders/confirm/${confirmId}`).toPromise();
    return rs.json();
  }

  async saveApproveOrderConfirm(confirmId: any) {
    const rs: any = await this.authHttp.put(`${this.url}/requisition/orders/confirm/approve/${confirmId}`, {}).toPromise();
    return rs.json();
  }

  async changeToPaid(requisitionId: any) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/unpaid/change-unpaid`, {
      requisitionOrderId: requisitionId
    }).toPromise();
    return rs.json();
  }

  async cancelUnpaid(requisitionIds: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/unpaid/cancel-unpaid`, {
      requisitionOrderIds: requisitionIds
    }).toPromise();
    return rs.json();
  }

  async saveUnpaidConfirm(unpaidId: any, requisitionId: any, items: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/unpaid/confirm`, {
      unpaidId: unpaidId,
      requisitionId: requisitionId,
      items: items
    }).toPromise();
    return rs.json();
  }

  async getTemplates(srcWarehouseId: any, dstWarehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/templates/${srcWarehouseId}/${dstWarehouseId}`).toPromise();
    return rs.json();
  }
  async getTemplate(dstWarehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/templates/${dstWarehouseId}`).toPromise();
    return rs.json();
  }

  async getTemplateItems(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/templates-items/${templateId}`).toPromise();
    return rs.json();
  }

  async getBorrowNotes(warehouseId: any, genericIds: any[], requisitionId: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/requisition/borrow-notes`, {
      genericIds: genericIds,
      warehouseId: warehouseId,
      requisitionId: requisitionId
    }).toPromise();
    return rs.json();
  }

  /********************************************/
  async getLots(productId: any, warehouseId: any) {
    const response = await this.authHttp.post(`${this.url}/requisition/get-lots`, {
      productId: productId,
      warehouseId: warehouseId
    })
      .toPromise();
    return response.json();
  }

  getRequisitions() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition`)
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
      this.authHttp.get(`${this.url}/requisition/people/list`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchProduct(query: string, warehouseid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/search`, {
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

  searchallProduct(warehouseid: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/searchall`, {
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

  saveRequisitionBorrow(summary: IRequisition, products: Array<any>, confirmSummary: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/borrow`, {
        summary: summary,
        products: products,
        confirmSummary: confirmSummary
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

  saveEditRequisition(requisitionId: any, products: Array<any>) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/edit`, {
        requisitionId: requisitionId,
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

  getConfirming() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/confirming`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getApprovings() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/approving`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getOverdueRequisitionList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/overdue`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  getSuccessRequisitionList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/success`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getRequisitionInfo(requisitionId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/info/${requisitionId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  doCancelRequisition(requisitionId) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/cancel/${requisitionId}`)
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
      this.authHttp.post(`${this.url}/receives/product-packages`, {
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

  saveConfirm(summary, products, requisitionStatus) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/confirm`, {
        summary: summary,
        products: products,
        requisitionStatus: requisitionStatus,
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getApproveInfo(requisitionId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/approve/${requisitionId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveApprove(requisitionId: any, approveStatus: any, approveDate: any, requisitionStatus: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisition/approve`, {
        requisitionId: requisitionId,
        approveDate: approveDate,
        approveStatus: approveStatus,
        requisitionStatus: requisitionStatus,
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

  getAllBorrowProducts() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/all-borrow-products`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getReceiveProductsCheckList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/check/product-list`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getReceiveProductRemain(productId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/receiveproductremain/${productId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


  getApproveDetail(checkId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/approve-detail/${checkId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSuccessDetail(requisitionId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/success-detail/${requisitionId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getOverdueDetail(requisitionId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/overdue-detail/${requisitionId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getEDIVMI() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/get-edi-vmi`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getAllRequisitionQty(productId: any, srcWarehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/get-all-requisition-qty/${productId}/${srcWarehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getAllReseveRequisitionQty(productId: any, srcWarehouseId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisition/get-all-reserve-requisition-qty/${productId}/${srcWarehouseId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async checkApprove(username: any, password: any, action: any) {
    const rs: any = await this.authHttp.post(`${this.url}/basic/checkApprove`, {
      username: username,
      password: password,
      action: action
    }).toPromise();
    return rs.json();
  }
  async rollbackOrder(confirmId: any, requisitionOrderId) {
    const rs: any = await this.authHttp.delete(`${this.url}/requisition/rollbackOrder/${confirmId}/${requisitionOrderId}`)
      .toPromise();
    return rs.json();
  }
  async getRequisitionConfirmTemp(confirmId) {
    const rs: any = await this.authHttp.get(`${this.url}/requisition/confirm/temp/${confirmId}`)
      .toPromise();
    return rs.json();
  }

  async getAllocate(data: any) {
    const rs = await this.authHttp.post(`${this.url}/generics/allocate`, { data: data }).toPromise();
    return rs.json();
  }

  async getLink() {
    const rs = await this.authHttp.get(`${this.url}/requisition/report/approve`).toPromise();
    return rs.json();
  }
}
