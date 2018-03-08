import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';


@Injectable()
export class TransectionTypeService {

  constructor(  @Inject('API_URL') private url: string,
  private authHttp: AuthHttp) { }
  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/transectiontype`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(transectionTypeName: string) {
    console.log(transectionTypeName);
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/transectiontype`, {
        transectionTypeName: transectionTypeName
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(transectionTypeId: any, transectionTypeName: string) {   
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/transectiontype/${transectionTypeId}`, {
        transectionTypeName: transectionTypeName,
        transectionTypeId: transectionTypeId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(transectionTypeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/transectiontype/${transectionTypeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}
