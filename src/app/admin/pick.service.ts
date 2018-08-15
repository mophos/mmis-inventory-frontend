import { Injectable,Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PickService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getList(){
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/getList`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  gerReceiveNotPO(){
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/gerReceiveNotPO`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
