import { JwtHelper } from 'angular2-jwt';
import { Router } from '@angular/router';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { StaffService } from 'app/staff/staff.service';
import * as _ from 'lodash';
@Component({
  selector: 'wm-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit {
  warehouseId: any;
  warehouseCode: any;
  warehouseName: any;
  fullname: string;
  jwtHelper: JwtHelper = new JwtHelper();


  collapsible = true;
  collapse = true;
  token: any = null;

  rights = [];
  menuNote: boolean;
  menuReceive: boolean;
  menuRequisition: boolean;
  menuPayRequisition: boolean;
  menuTranfer: boolean;
  menuIssue: boolean;
  menuIssueHis: boolean;
  menuTemplate: boolean;
  menuMinMax: boolean;
  menuMap: boolean;
  menuAdjust: boolean;

  menuTools = true;
  @ViewChild('modalChangePassword') public modalChangePassword;

  constructor(
    private router: Router,
    private staffService: StaffService,
    @Inject('API_PORTAL_URL') private apiPortal: string,
    @Inject('HOME_URL') private homeUrl: string) {
    this.token = sessionStorage.getItem('token');
    // const token = sessionStorage.getItem('token');
    const decodedToken = this.jwtHelper.decodeToken(this.token);
    const accessRight = decodedToken.accessRight;
    this.rights = accessRight.split(',');
  }

  ngOnInit() {
    const decoded = this.jwtHelper.decodeToken(this.token);
    this.fullname = decoded.fullname;
    this.warehouseId = decoded.warehouseId;
    this.warehouseName = decoded.warehouseName;
    this.warehouseCode = decoded.warehouseCode;

    this.menuNote = _.indexOf(this.rights, 'WM_BORROW') === -1 ? false : true;
    this.menuReceive = _.indexOf(this.rights, 'WM_RECEIVE') === -1 ? false : true;
    this.menuRequisition = _.indexOf(this.rights, 'WM_REQUISITION') === -1 ? false : true;
    this.menuPayRequisition = _.indexOf(this.rights, 'WM_REQUISITION') === -1 ? false : true;
    this.menuTranfer = _.indexOf(this.rights, 'WM_TRANSFER') === -1 ? false : true;
    this.menuIssue = _.indexOf(this.rights, 'WM_ISSUE') === -1 ? false : true;
    this.menuIssueHis = _.indexOf(this.rights, 'WM_HIS_TRANSACTION') === -1 ? false : true;
    this.menuTemplate = _.indexOf(this.rights, 'WM_TEMPLATE') === -1 ? false : true;
    this.menuMinMax = _.indexOf(this.rights, 'WM_MINMAX_PLANNING') === -1 ? false : true;
    this.menuMap = _.indexOf(this.rights, 'WM_HIS_MAPPING') === -1 ? false : true;
    this.menuAdjust = _.indexOf(this.rights, 'WM_ADJUST') === -1 ? false : true;
    if (!this.menuAdjust) {
      this.menuTools = false;
    }
  }

  logout() {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('fullname');
    location.href = this.homeUrl;
  }

  openChangePasswordModal() {
    this.modalChangePassword.openModal();
  }
  showManualStaff() {
    const url = `${this.apiPortal}/pdf/ManualStaff.pdf`;
    window.open(url, '_blank');
  }
}
