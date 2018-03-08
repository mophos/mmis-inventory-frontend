import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class RequisitionTypeService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all() {
    let rs: any = await this.authHttp.get(`${this.url}/staff/requisition-type`).toPromise();
    return rs.json();
  }

}
