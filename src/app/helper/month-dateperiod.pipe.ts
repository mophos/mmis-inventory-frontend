import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({
  name: 'monthDateperiod'
})
export class MonthDateperiodPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const month: any = moment(value).format('M');
    const year: any = moment(new Date()).get('year');
    let y: any;
    if (month < 10) {
      y = year;
    }
    if (month >= 10) {
      y = (year + 1);
    }
    y = moment(y).format('YYYY');
    const date = y + '-' + month;
    const days = moment(date, "YYYY-MM").daysInMonth();
    return days;
  }

}
