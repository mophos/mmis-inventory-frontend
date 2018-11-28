import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class DonatorService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async all(query:any) {
    const resp = await this.authHttp.get(`${this.url}/donators?query=${query}`).toPromise();
    return resp.json();
  }

  async save(donatorName: string, donatorAddress: string, donatorTelephone: string) {
    const resp = await this.authHttp.post(`${this.url}/donators`, {
      donatorName: donatorName,
      donatorAddress: donatorAddress,
      donatorTelephone: donatorTelephone
    }).toPromise();

    return resp.json();
  }

  async update(donatorId: any, donatorName: string, donatorAddress: string, donatorTelephone) {
    const resp = await this.authHttp.put(`${this.url}/donators/${donatorId}`, {
      donatorName: donatorName,
      donatorAddress: donatorAddress,
      donatorTelephone: donatorTelephone
    }).toPromise();

    return resp.json();
  }

  async remove(donatorId: string) {
    const resp = await this.authHttp.delete(`${this.url}/donators/${donatorId}`).toPromise();
    return resp.json();
  }

}