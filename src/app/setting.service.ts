import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class SettingService {

  constructor (
    @Inject('API_URL') private url: String,
    private authHttp: AuthHttp
  ) { }

  byModule(module: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/setting/by-module/${module}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
