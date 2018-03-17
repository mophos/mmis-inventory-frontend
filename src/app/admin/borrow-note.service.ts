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
    const resp = await this.authHttp.post(`${this.url}/borrow-notes`, {
      notes: notes,
      detail: detail
    }).toPromise();
    return resp.json();
  }

  async update(borrowNoteId: any, notes: any, detail: any[]) {
    const resp = await this.authHttp.put(`${this.url}/borrow-notes/${borrowNoteId}/edit`, {
      notes: notes,
      detail: detail
    }).toPromise();
    return resp.json();
  }

  async getDetailList(borrowNoteId: any) {
    const resp = await this.authHttp.get(`${this.url}/borrow-notes/${borrowNoteId}/detail-list`).toPromise();
    return resp.json();
  }

  async getList(query: any, limit: number = 20, offset: number = 0) {
    const resp = await this.authHttp.get(`${this.url}/borrow-notes?query=${query}&limit=${limit}&offset=${offset}`).toPromise();
    return resp.json();
  }

}
