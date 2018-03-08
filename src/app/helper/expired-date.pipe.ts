import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import { JwtHelper } from 'angular2-jwt';

@Pipe({
  name: 'expiredDate'
})
export class ExpiredDatePipe implements PipeTransform {
  jwtHelper: JwtHelper = new JwtHelper();
  transform(value: any, args?: any): any {

    const token = sessionStorage.getItem('token');
    const decodedToken: any = this.jwtHelper.decodeToken(token);
    const expired = decodedToken.expired;

    moment.locale('th');
    if(expired === 'BE'){
      if (moment(value, 'YYYY-MM-DD').isValid()) {
        const thaiDate = `${moment(value).format('DD MMM')} ${moment(value).get('year') + 543}`;
        return thaiDate;
      } else {
        return '-';
      }
    } else{
      if (moment(value, 'YYYY-MM-DD').isValid()) {
        const engDate = moment(value).format('DD/MM/YYYY');
        return engDate;
      } else {
        return '-';
      } 
    }
  }
}