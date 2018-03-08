import { Injectable } from '@angular/core';
import * as moment from 'moment';

@Injectable()
export class DateService {
  maxDate = new Date(2199, 12, 31);
  minDate = new Date(1980, 1, 1);

  constructor() { }

  isValid(strDate: string): boolean {
    const d: any = strDate.split('-');
    var dx = new Date(d[2], d[1], d[0]);
    // const _strEngDate = `${d[0]}-${d[1]}-${+d[2] - 543}`;
    const valid = moment(dx).isValid();
    if (valid) {
      return moment(dx).isBetween(moment(this.minDate), moment(this.maxDate));
    } else {
      return false;
    }
  }

  isValidDateExpire(strDate: string): boolean {
    try {
      const d: any = strDate.split('/');
      var dx = new Date(d[2], d[1], d[0]);
      const valid = moment(dx).isValid();
      const between = moment(dx).isBetween('2015-01-01', '2090-12-31');
      if (valid && between) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      return false;
    }
  }
}
