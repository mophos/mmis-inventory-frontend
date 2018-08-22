import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PickService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getList(limit: number, offset: number) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/getList/${limit}/${offset}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  removePick(pick_id) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/pick/removePick/${pick_id}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  approvePick(pick_id) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/pick/approvePick`, {
        pick_id: pick_id
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  savePick(pickId: any, pickDate: any, wmPick: any, products: any, peopleId: any, remark: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/pick/savePick`, {
        pickDate: pickDate,
        wmPick: wmPick,
        products: products,
        people_id: peopleId,
        remark: remark,
        pickId: pickId
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  getPick(pickId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/getPick/${pickId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  gerProductReceiveNotPO(query: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/gerProductReceiveNotPO/${query}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  gerReceiveItem(receiveId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/gerReceiveItem?receiveId=${receiveId}`).map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
  getDetail(pickId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/pick/getDetail/${pickId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
