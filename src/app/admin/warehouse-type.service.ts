import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class WarehouseTypeService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/warehouse-types`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(typeName: string, typeDesc: string, isMain: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/warehouse-types`, {
        typeName: typeName,
        typeDesc: typeDesc,
        isMain: isMain
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(typeId: any, typeName: string, typeDesc: string, isMain: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/warehouse-types/${typeId}`, {
        typeName: typeName,
        typeDesc: typeDesc,
        isMain: isMain
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(typeId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/warehouse-types/${typeId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}