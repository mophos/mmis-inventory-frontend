import { Injectable, Inject } from '@angular/core';
import { AuthHttp } from 'angular2-jwt';
import 'rxjs/add/operator/map';

@Injectable()
export class AbcVenService {

  constructor(
    @Inject('API_URL') private url: string,
    private authHttp: AuthHttp
  ) { }

  getAbcList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/abc/list`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveAbc(datas: any, sorting: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/abc-ven/abc`, {
        datas: datas,
        sorting: sorting
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveProductAbcVen(ids: any[], venId: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/abc-ven/save-product-abc-ven`, {
        venId: venId,
        ids: ids
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getVenList() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/ven/list`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveVen(datas: any) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/abc-ven/ven`, {
        datas: datas
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProducts() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/products`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getProductsUnset() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/products/unset`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  saveSettingStatus(status: string, type: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/abc-ven/save-status`, {
        status: status,
        type: type
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSettingStatus(type: string) {
    return new Promise((resolve, reject) => {
      this.authHttp.post(`${this.url}/abc-ven/get-status`, {
        type: type
      })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  getSettingAbcSorting() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/abc-sorting`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }

  processingAbc() {
    return new Promise((resolve, reject) => {
      this.authHttp.get(`${this.url}/abc-ven/abc-processing`)
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          reject(error);
        });
    });
  }
}

