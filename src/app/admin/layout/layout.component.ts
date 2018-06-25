import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import * as _ from 'lodash';

@Component({
  selector: 'wm-layout',
  templateUrl: './layout.component.html'
})
export class LayoutComponent implements OnInit {
  collapsible = true;
  collapse = true;
  fullname: string;
  warehouseName: string;
  warehouseId: string;
  warehouseCode: string;
  public env: any;
  rights: any;
  Purchasing = false;
  Planning = false;
  Inventory = false;
  InventoryWarehouse = false;
  Materials = false;
  Contracts = false;
  Administrator = false;
  period = false;
  jwtHelper: JwtHelper = new JwtHelper();

  @ViewChild('modalChangePassword') public modalChangePassword;

  token: any;

  constructor(
    private router: Router,
    @Inject('HOME_URL') private homeUrl: string,
    @Inject('API_URL') private apiUrl: string,
    @Inject('API_PORTAL_URL') private apiPortal: string
  ) {
    this.token = sessionStorage.getItem('token');
    const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
  }

  logout() {
    sessionStorage.removeItem('token');
    // this.router.navigate(['/']);
    this.router.navigateByUrl('/');
  }

  goHome() {
    location.href = this.homeUrl;
  }

  ngOnInit() {
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.fullname = decoded.fullname;
    this.warehouseId = decoded.warehouseId;
    this.warehouseCode = decoded.warehouseCode;
    this.warehouseName = decoded.warehouseName;
    this.env = {
      homeUrl: environment.homeUrl,
      purchasingUrl: environment.purchasingUrl,
      planningUrl: environment.planningUrl,
      inventoryUrl: environment.inventoryUrl,
      materialsUrl: environment.materialsUrl,
      reportUrl: environment.reportUrl,
      umUrl: environment.umUrl,
      contractsUrl: environment.contractsUrl
    };
    this.Purchasing = _.indexOf(this.rights, 'PO_ADMIN') === -1 ? false : true;
    this.Planning = _.indexOf(this.rights, 'BM_ADMIN') === -1 ? false : true;
    this.Inventory = _.indexOf(this.rights, 'WM_ADMIN') === -1 ? false : true;
    this.InventoryWarehouse = _.indexOf(this.rights, 'WM_WAREHOUSE_ADMIN') === -1 ? false : true;
    this.Materials = _.indexOf(this.rights, 'MM_ADMIN') === -1 ? false : true;
    this.Contracts = _.indexOf(this.rights, 'CM_ADMIN') === -1 ? false : true;
    this.Administrator = _.indexOf(this.rights, 'UM_ADMIN') === -1 ? false : true;
    this.period = _.indexOf(this.rights, 'WM_PERIOD') === -1 ? false : true;
  }

  openChangePasswordModal() {
    this.modalChangePassword.openModal();
  }

  downloadManual() {
    const url = `${this.apiUrl}/pdf/ManualAdmin.pdf`;
    window.open(url, '_blank');
  }
  showManualStaff() {
    const url = `${this.apiPortal}/pdf/ManualStaff.pdf`;
    window.open(url, '_blank');
  }
}
