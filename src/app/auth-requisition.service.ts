import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';

@Injectable()
export class AuthRequisition implements CanActivate {
  public token: string;
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router) { }

  canActivate() {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const accessRight = decodedToken.accessRight;

      if (accessRight) {
        if (this.jwtHelper.isTokenExpired(token)) {
          this.router.navigate(['login']);
          return false;
        } else {
          const rights = accessRight.split(',');
          let isAdmin = false;
          if (_.indexOf(rights, 'WM_REQUISITION') > -1) {
            isAdmin = true;
          } else {
            isAdmin = false;
          }

          if (!isAdmin) {
            this.router.navigate(['access-denied']);
            return false;
          } else {
            return true;
          }
        }

      } else {
        this.router.navigate(['access-denied']);
        return false;
      }

    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
