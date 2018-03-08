import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class RequisitionTypeService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/requisitiontype`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(requisitionTypeName: string, requisitionTypeDesc: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/requisitiontype`, {
        requisitionTypeName: requisitionTypeName,
        requisitionTypeDesc: requisitionTypeDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(requisitionTypeId: any, requisitionTypeName: string, requisitionTypeDesc: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/requisitiontype/${requisitionTypeId}`, {
        requisitionTypeName: requisitionTypeName,
        requisitionTypeDesc: requisitionTypeDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(requisitionTypeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/requisitiontype/${requisitionTypeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }


}
