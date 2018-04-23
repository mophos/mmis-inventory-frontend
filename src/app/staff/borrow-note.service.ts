import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class BorrowNoteService {
  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async save(notes: any, detail: any[]) {
    const resp = await this.authHttp.post(`${this.url}/staff/borrow-notes`, {
      notes: notes,
      detail: detail
    }).toPromise();
    return resp.json();
  }

  async cancelNote(borrowNoteId: any) {
    const resp = await this.authHttp.delete(`${this.url}/staff/borrow-notes/${borrowNoteId}`).toPromise();
    return resp.json();
  }

  async update(borrowNoteId: any, notes: any, detail: any[]) {
    const resp = await this.authHttp.put(`${this.url}/staff/borrow-notes/${borrowNoteId}/edit`, {
      notes: notes,
      detail: detail
    }).toPromise();
    return resp.json();
  }

  async updateRequisitionBorrow(requisitionOrderId: any, data: any[], borrowItems: any[]) {
    const resp = await this.authHttp.put(`${this.url}/staff/borrow-notes/update-requisition/${requisitionOrderId}`, {
      data: data,
      borrowItems: borrowItems
    }).toPromise();
    return resp.json();
  }

  async getDetailList(borrowNoteId: any) {
    const resp = await this.authHttp.get(`${this.url}/staff/borrow-notes/${borrowNoteId}/detail-list`).toPromise();
    return resp.json();
  }

  async getList(query: any, limit: number = 20, offset: number = 0) {
    const resp = await this.authHttp.get(`${this.url}/staff/borrow-notes?query=${query}&limit=${limit}&offset=${offset}`).toPromise();
    return resp.json();
  }

  async getDetailWithItems(borrowNoteId: any) {
    const resp = await this.authHttp.get(`${this.url}/staff/borrow-notes/${borrowNoteId}/detail-edit`).toPromise();
    return resp.json();
  }

}
