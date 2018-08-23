import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

import { IRequisition } from '../models';

@Injectable()
export class RequisitionService {

  constructor(
    @Inject('API_URL') private url: string,
    @Inject('DOC_URL') private docUrl: string,
    private authHttp: AuthHttp
  ) { }

  async getWating(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/staff/pay-requisition/orders/waiting?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getWaitingApprove(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/waiting-approve?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getPayWaitingApprove(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/staff/pay-requisition/orders/waiting-approve?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  async getApproved(limit: number, offset: number, query = '') {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/approved?limit=${limit}&offset=${offset}&query=${query}`)
      .toPromise();
    return rs.json();
  }

  async getUnPaid(limit: number, offset: number, query = '', fillterCancel = 'all') {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/unpaid?limit=${limit}&offset=${offset}&query=${query}&fillterCancel=${fillterCancel}`)
      .toPromise();
    return rs.json();
  }

  // async getWating() {
  //   const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/waiting`)
  //     .toPromise();
  //   return rs.json();
  // }

  // async getWaitingApprove() {
  //   const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/waiting-approve`)
  //     .toPromise();
  //   return rs.json();
  // }

  // async getApproved(limit: number, offset: number, query = '') {
  //   const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/approved?limit=${limit}&offset=${offset}&query=${query}`)
  //     .toPromise();
  //   return rs.json();
  // }

  // async getUnPaid() {
  //   const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/unpaid`)
  //     .toPromise();
  //   return rs.json();
  // }

  async getOrderDetail(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/detail/${requisitionId}`)
      .toPromise();
    return rs.json();
  }

  async saveRequisitionOrder(order: any, products: Array<any>) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/requisition/orders`, {
      order: order,
      products: products
    }).toPromise();
    return rs.json();
  }

  async updateRequisitionOrder(requisitionId: any, order: any, products: Array<any>) {
    const rs: any = await this.authHttp.put(`${this.url}/staff/requisition/orders/${requisitionId}`, {
      order: order,
      products: products
    }).toPromise();
    return rs.json();
  }

  async removeRequisitionOrder(requisitionId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/staff/requisition/orders/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getEditRequisitionOrderItems(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/generics-requisition/for-edit/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderItems(requisitionId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/generics-requisition/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderUnpaidItems(unpaidId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/generics-requisition/unpaid/${unpaidId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderItemsPay(requisitionId: any, confirmId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/generics-requisition/pay/${requisitionId}/${confirmId}`).toPromise();
    return rs.json();
  }

  async getRequisitionOrderProductItems(genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/products-requisition/${genericId}`).toPromise();
    return rs.json();
  }

  async getEditRequisitionOrderProductItems(confirmId: any, genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/products-requisition/edit/${confirmId}/${genericId}`).toPromise();
    return rs.json();
  }

  async getOrderConfirmItems(confirmId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/orders/confirm/${confirmId}`).toPromise();
    return rs.json();
  }

  async saveOrderConfirmItemsWithOutUnpaid(requisitionId: any, items: any) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/requisition/orders/confirm-without-unpaid`, {
      requisitionId: requisitionId,
      items: items
    }).toPromise();
    return rs.json();
  }

  async saveOrderConfirmItemsWithUnpaid(requisitionId: any, items: any, generics: any) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/requisition/orders/confirm-with-unpaid`, {
      requisitionId: requisitionId,
      items: items,
      generics: generics
    }).toPromise();
    return rs.json();
  }

  async updateOrderConfirmItems(confirmId: any, items: any) {
    const rs: any = await this.authHttp.put(`${this.url}/staff/requisition/orders/confirm/${confirmId}`, {
      items: items
    }).toPromise();
    return rs.json();
  }

  async removeOrderConfirm(confirmId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/staff/requisition/orders/confirm/${confirmId}`).toPromise();
    return rs.json();
  }

  async saveApproveOrderConfirm(confirmId: any) {
    const rs: any = await this.authHttp.put(`${this.url}/staff/requisition/orders/confirm/approve/${confirmId}`, {}).toPromise();
    return rs.json();
  }

  async saveUnpaidConfirm(unpaidId: any, requisitionId: any, items: any[]) {
    const rs: any = await this.authHttp.post(`${this.url}/staff/requisition/unpaid/confirm`, {
      unpaidId: unpaidId,
      requisitionId: requisitionId,
      items: items
    }).toPromise();
    return rs.json();
  }

  async getTemplates(srcWarehouseId: any, dstWarehouseId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/templates/${srcWarehouseId}/${dstWarehouseId}`).toPromise();
    return rs.json();
  }

  async getTemplateItems(templateId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/templates-items/${templateId}`).toPromise();
    return rs.json();
  }

  async getTempList() {
    const rs: any = await this.authHttp.get(`${this.url}/staff/requisition/temp`).toPromise();
    return rs.json();
  }

  async removeTemp(requisitionId: any) {
    const rs: any = await this.authHttp.delete(`${this.url}/staff/requisition/temp/remove/${requisitionId}`).toPromise();
    return rs.json();
  }

  async getGenericWarehouseRemain(warehouseId: any, genericId: any) {
    const rs: any = await this.authHttp.get(`${this.url}/basic/get-generic-warehouse-remain/${warehouseId}/${genericId}`).toPromise();
    return rs.json();
  }

}
