import { Injectable,Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PeopleService {

  constructor(
     @Inject('API_URL') private url: string,
     private authHttp: AuthHttp
  ) { }

  all() {
    const res: any = this.authHttp.get(`${this.url}/people`).toPromise();
    return res.json();
  }

}
