import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';

@Injectable()
export class ToolsService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  async searchReceives(query: any) {
    const resp = await this.authHttp.post(`${this.url}/tools/stockcard/search/receives`, {
      query: query
    }).toPromise();
    return resp.json();
  }

}
