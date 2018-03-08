import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class ReceiveotherTypeService {

  constructor(  @Inject('API_URL') private url: string,
  private authHttp: AuthHttp) { }
  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/receiveotherType`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(receiveotherTypeName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/receiveotherType`, {
        receiveotherTypeName: receiveotherTypeName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(receiveotherTypeId: any, receiveotherTypeName: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/receiveotherType/${receiveotherTypeId}`, {
        receiveotherTypeName: receiveotherTypeName,
        receiveotherTypeId: receiveotherTypeId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(receiveotherTypeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/receiveotherType/${receiveotherTypeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}
