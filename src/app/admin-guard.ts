import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivate } from '@angular/router';

import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';


@Injectable()
export class AdminGuard implements CanActivate {
  public token: string;
  public jwtHelper: JwtHelper = new JwtHelper();

  constructor(private router: Router) { }

  canActivate() {
    const token = sessionStorage.getItem('token');
    let isAdmin = false;
    
    try {
      const decodedToken = this.jwtHelper.decodeToken(token);
      const accessRight = decodedToken.accessRight;
      const rights = accessRight.split(',');
      
      if (_.indexOf(rights, 'WM_ADMIN') > -1) {
        isAdmin = true;
      } else {
        isAdmin = false;
      }
    } catch (error) {
      isAdmin = false;
    }

    if (token) {
      if (this.jwtHelper.isTokenExpired(token)) {
        this.router.navigate(['login']);
        return false;
      } else {
        if (isAdmin) {
          return true;
        } else {
          this.router.navigate(['access-denied']);
          return false;
        }
      }
    } else {
      this.router.navigate(['login']);
      return false;
    }
  }
}
