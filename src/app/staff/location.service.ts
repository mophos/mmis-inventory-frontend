import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class LocationService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  all() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/locations`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  save(locationName: string, locationDesc: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/locations`, {
        locationName: locationName,
        locationDesc: locationDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  update(locationId: any, locationName: string, locationDesc: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.put(`${this.url}/locations/${locationId}`, {
        locationName: locationName,
        locationDesc: locationDesc
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  remove(locationId: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.delete(`${this.url}/locations/${locationId}`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

}
