import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class GenericService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) {

  }

  async getGenericInWarehouse() {
    const rs = await this.authHttp.get(`${this.url}/generics/in/warehouse`).toPromise();
    return rs.json();
  }
}
