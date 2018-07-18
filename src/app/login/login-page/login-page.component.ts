import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'

import { LoginService } from '../login.service';
import { AlertService } from '../../alert.service';
import { JwtHelper } from 'angular2-jwt';

import * as _ from 'lodash';

@Component({
  selector: 'wm-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string;
  password: string;
  jwtHelper: JwtHelper = new JwtHelper();
  isLogging = false;
  warehouses = [];
  warehouseId: any;
  userWarehouseId:any;
  token: string;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private alertService: AlertService
  ) {
    this.token = sessionStorage.getItem('token');
  }

  ngOnInit() {
    if (this.token) {
      const decodedToken = this.jwtHelper.decodeToken(this.token);
      const accessRight = decodedToken.accessRight;

      try {
        const rights = accessRight.split(',');

        if (_.indexOf(rights, 'WM_ADMIN') > -1) {
          this.router.navigate(['admin']);
        } else if (_.indexOf(rights, 'WM_WAREHOUSE_ADMIN') > -1) {
          this.router.navigate(['staff']);
        } else {
          this.router.navigate(['page-not-found']);
        }
      } catch (error) {
        this.router.navigate(['/login']);
      }
    }
  }

  enterLogin(event) {
    // enter login
    if (event.keyCode === 13) {
      this.doLogin();
    }
  }

  doLogin() {
    this.isLogging = true;
    this.loginService.doLogin(this.username, this.password, this.userWarehouseId)
      .then((result: any) => {
        if (result.ok) {
          const token = result.token;
          const decodedToken = this.jwtHelper.decodeToken(token);
          const fullname = `${decodedToken.firstname} ${decodedToken.lastname}`;
          sessionStorage.setItem('token', token);
          // hide spinner
          this.isLogging = false;
          // redirect to admin module
          const accessRight = decodedToken.accessRight;
          const rights = accessRight.split(',');

          if (_.indexOf(rights, 'WM_ADMIN') > -1) {
            this.router.navigate(['admin']);
          } else if (_.indexOf(rights, 'WM_WAREHOUSE_ADMIN') > -1) {
            this.router.navigate(['staff']);
          } else {
            this.router.navigate(['page-not-found']);
          }
        } else {
          this.isLogging = false;
          this.alertService.error(JSON.stringify(result.error));
        }
      })
      .catch((error) => {
        this.isLogging = false;
        this.alertService.serverError();
      });
  }

  async selectWarehouse(event) {
    const rs: any = await this.loginService.searchWarehouse(this.username);
    if (rs.ok) {
      this.warehouses = rs.rows;
      this.userWarehouseId = rs.rows[0].user_warehouse_id;
    } else {
      this.warehouses = [];
      this.userWarehouseId = null;
    }
  }

}
