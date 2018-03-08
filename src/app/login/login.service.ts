import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor( @Inject('LOGIN_URL') private url: string, private http: Http) { }

  doLogin(username: string, password: string) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}/login`, { username: username, password: password})
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  async doLogin1(username: string, password: string) {
    return await this.http.post(`${this.url}/login`, { username: username, password: password });
  }
}
