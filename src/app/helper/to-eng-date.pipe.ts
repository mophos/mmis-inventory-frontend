import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'toEngDate'
})
export class ToEngDatePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    moment.locale('th');
    if (moment(value, 'YYYY-MM-DD').isValid()) {
      const engDate = moment(value).format('DD/MM/YYYY');
      return engDate;
    } else {
      return '-';
    }
  }

}
