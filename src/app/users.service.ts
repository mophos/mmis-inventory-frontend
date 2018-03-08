import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class UsersService {
  constructor(private authHttp: AuthHttp, @Inject('API_URL') private url: string) {
  
  }

  async changePassword(password: any) {
    const res = await this.authHttp.post(`${this.url}/users/change-password`, {
      password: password
    }).toPromise();
    return res.json()
  }

}
