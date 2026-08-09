import { Injectable, Inject } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class LoginService {

  constructor(
    @Inject('LOGIN_URL') private url: string,
    private http: Http) { }

  doLogin(username: string, password: string, userWarehouseId) {
    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}/login`, { username: username, password: password, userWarehouseId: userWarehouseId, supportLoginSteps: true })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  searchWarehouse(username: string) {
    return new Promise((resolve, reject) => {
      this.http.get(`${this.url}/login/warehouse/search?username=${username}`)
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

  /**
   * ขั้นตอนหลังตรวจรหัสผ่านทุกตัวใช้ preAuthToken แทน token จริง
   * preAuthToken มีอายุ 15 นาที และใช้เรียก API อื่นของระบบไม่ได้
   */
  private postWithPreAuth(path: string, preAuthToken: string, body: any = {}) {
    const headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${preAuthToken}`
    });

    return new Promise((resolve, reject) => {
      this.http.post(`${this.url}${path}`, body, { headers: headers })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  changePassword(preAuthToken: string, password: string, confirmPassword: string) {
    return this.postWithPreAuth('/login/change-password', preAuthToken, {
      password: password,
      confirmPassword: confirmPassword
    });
  }

  setup2fa(preAuthToken: string) {
    return this.postWithPreAuth('/login/2fa/setup', preAuthToken);
  }

  confirm2fa(preAuthToken: string, code: string) {
    return this.postWithPreAuth('/login/2fa/confirm', preAuthToken, { code: code });
  }

  verify2fa(preAuthToken: string, code: string) {
    return this.postWithPreAuth('/login/2fa/verify', preAuthToken, { code: code });
  }
}
