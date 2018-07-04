import { Injectable } from '@angular/core';
import { AlertService } from './alert.service';
import { tokenNotExpired, JwtHelper } from 'angular2-jwt';
import * as _ from 'lodash';

@Injectable()
export class AccessCheck {

    public permissionName: string;
    public jwtHelper: JwtHelper = new JwtHelper();
    public rights: Array<any> = [];

    constructor(
        private alertService: AlertService
    ) {
        const token = sessionStorage.getItem('token');
        const decodedToken = this.jwtHelper.decodeToken(token);
        const accessRight = decodedToken.accessRight;
        this.rights = accessRight.split(',');
    }

    getRighs() {
        return this.rights;
    }

    can(permissionName: string) {
        if (_.indexOf(this.rights, permissionName) > -1) {
            return true;
        } else {
            return false;
        }
    }

    confirm(permissionName: string, msg: string = 'คุณไม่ได้รับสิทธิ์การเข้าใช้งานส่วนนี้!') {
        if (this.can(permissionName) === false) {
            this.alertService.error(msg, 'Access denied!');
            return false;
        }
        return true;
    }
}
