import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class LocationService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all(warehouseId: any) {
    const rs = await this.authHttp.get(`${this.url}/locations/${warehouseId}`).toPromise();
    return rs.json();
  }

  async save(location: any, warehouseId: any) {
    const rs = await this.authHttp.post(`${this.url}/locations/${warehouseId}`, {
      location: location
    }).toPromise();

    return rs.json();
  }

  async update(location: any) {
    const rs = await this.authHttp.put(`${this.url}/locations/${location.location_id}`, {
      location: location
    }).toPromise();
    return rs.json();
  }

  async remove(locationId: string) {
    const rs = await this.authHttp.delete(`${this.url}/locations/${locationId}`).toPromise();
    return rs.json();
  }

}
